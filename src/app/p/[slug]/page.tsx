'use client';

import { use, useEffect, useMemo, useState } from 'react';
import type { ChainKey } from '@/lib/chains';
import { CHAIN_META } from '@/lib/chains';
import { ICONS } from '@/lib/icons';

type ApiRes = {
  profile: { slug: string; displayName: string; defaultChain: ChainKey; note?: string };
  uris: { chain: ChainKey; address: string; asset?: string; uri: string }[];
};

// Native symbol per chain (for chip labels / amount unit)
const NATIVE: Record<ChainKey, string> = {
  btc: 'BTC',
  bsv: 'BSV',
  bch: 'BCH',
  eth: 'ETH',
  base: 'ETH',
  polygon: 'MATIC',
  arbitrum: 'ETH',
  sol: 'SOL',
};

const selKey = (chain: ChainKey, asset?: string) =>
  `${chain}-${(asset ?? 'native').toLowerCase()}`;

const chipBase =
  'text-xs px-2 py-1 rounded-md border transition-colors select-none inline-flex items-center gap-1';
const chipOn = `${chipBase} border-black bg-black text-white`;
const chipOff = `${chipBase} border-gray-300 hover:border-black`;

/* ---------- URI helpers (amount-aware) ---------- */

function appendParam(u: string, key: string, val: string) {
  return u.includes('?') ? `${u}&${key}=${encodeURIComponent(val)}` : `${u}?${key}=${encodeURIComponent(val)}`;
}

// very light handling so common wallets prefill amounts
function withAmount(
  baseUri: string,
  chain: ChainKey,
  asset: string | undefined,
  amount: string | null
) {
  if (!amount || !amount.trim()) return baseUri;

  // BTC family / Solana usually accept `amount=` as decimal
  if (chain === 'btc' || chain === 'bsv' || chain === 'bch' || chain === 'sol') {
    return appendParam(baseUri, 'amount', amount.trim());
  }

  // EVM native ETH uses EIP-681 `value`(wei). We keep chainId implicit.
  if ((chain === 'eth' || chain === 'base' || chain === 'polygon' || chain === 'arbitrum') && !asset) {
    // convert decimal ETH to wei (rough client-side)
    const dec = amount.trim();
    const [ints, fracRaw = ''] = dec.split('.');
    const frac = (fracRaw + '0'.repeat(18)).slice(0, 18); // pad/crop to 18
    const wei = BigInt(ints || '0') * BigInt(1e18) + BigInt(frac);
    return appendParam(baseUri, 'value', wei.toString());
  }

  // EVM ERC20 / SPL tokens: many wallets accept a loose `amount=`
  return appendParam(baseUri, 'amount', amount.trim());
}

/* ---------- Page ---------- */

export default function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [data, setData] = useState<ApiRes | null>(null);
  const [selected, setSelected] = useState<string | null>(null); // `${chain}-${asset|native}`
  const [qr, setQr] = useState<string>('');
  const [justCopied, setJustCopied] = useState(false);

  // new: amount input
  const [amount, setAmount] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const r = await fetch(`/api/profile/${slug}`, { cache: 'no-store' });
        if (!r.ok) {
          const ct = r.headers.get('content-type') || '';
          const body = ct.includes('application/json') ? JSON.stringify(await r.json()) : await r.text();
          throw new Error(`API ${r.status} ${r.statusText}: ${body?.slice(0, 300)}`);
        }

        const j: ApiRes = await r.json();
        if (cancelled) return;
        setData(j);

        // pick default
        const firstOnDefault =
          j.uris.find((u) => u.chain === j.profile.defaultChain && !u.asset) ??
          j.uris.find((u) => u.chain === j.profile.defaultChain) ??
          j.uris[0];
        if (!cancelled && firstOnDefault) setSelected(selKey(firstOnDefault.chain, firstOnDefault.asset));
      } catch (err) {
        console.error('[profile fetch error]', err);
        if (!cancelled) setData(null);
        alert(`Failed to load profile: ${err instanceof Error ? err.message : String(err)}`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // group by chain for cards
  const groups = useMemo(() => {
    if (!data) return [] as {
      chain: ChainKey;
      label: string;
      address: string;
      tokens: { key: string; label: string; icon: string; asset?: string; uri: string }[];
    }[];

    const m = new Map<
      ChainKey,
      { label: string; address: string; tokens: { key: string; label: string; icon: string; asset?: string; uri: string }[] }
    >();

    for (const u of data.uris) {
      const label = CHAIN_META[u.chain].label;
      if (!m.has(u.chain)) m.set(u.chain, { label, address: u.address, tokens: [] });
      const g = m.get(u.chain)!;

      const tokenLabel = (u.asset ? u.asset.toUpperCase() : NATIVE[u.chain]) || 'NATIVE';
      const iconKey = u.asset?.toLowerCase() ?? u.chain;
      const tokenIcon = ICONS[iconKey] || '';

      const key = selKey(u.chain, u.asset);
      if (!g.tokens.some((t) => t.key === key)) {
        g.tokens.push({ key, label: tokenLabel, icon: tokenIcon, asset: u.asset, uri: u.uri });
      }
    }

    return [...m.entries()].map(([chain, v]) => ({
      chain,
      label: v.label,
      address: v.address,
      tokens: v.tokens.sort((a, b) => (a.asset ? 1 : -1)), // native first
    }));
  }, [data]);

  const current = useMemo(() => {
    if (!data || !selected) return null;
    return data.uris.find((u) => selKey(u.chain, u.asset) === selected) ?? null;
  }, [data, selected]);

  // build the href with amount (if any)
  const payHref = useMemo(() => {
    if (!current) return '';
    return withAmount(current.uri, current.chain, current.asset, amount);
  }, [current, amount]);

  // (re)generate QR whenever slug / selection / amount changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!current) return;
      const { toDataURL } = await import('qrcode');
      const link = payHref || `${location.origin}/p/${slug}`;
      const png = await toDataURL(link, { margin: 1, scale: 4 });
      if (!cancelled) setQr(png);
    })();
    return () => {
      cancelled = true;
    };
  }, [current, payHref, slug]);

  const doCopy = async (txt: string) => {
    try {
      await navigator.clipboard.writeText(txt);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 1200);
    } catch {}
  };

  const unitLabel =
    current?.asset?.toUpperCase() ??
    (current ? NATIVE[current.chain] : '');

  if (!data) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="text-3xl font-semibold">{data.profile.displayName}</div>
        <span className="text-sm opacity-70">@{data.profile.slug}</span>
      </div>
      {data.profile.note && <p className="opacity-80">{data.profile.note}</p>}

      {/* Chain cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((g) => {
          const isSel = selected?.startsWith(`${g.chain}-`);
          return (
            <div
              key={g.chain}
              className={`rounded-2xl border p-4 shadow-sm transition ${
                isSel ? 'border-black' : 'border-gray-200'
              }`}
            >
              {/* Chain header */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setSelected(selKey(g.chain))}
                  className="flex items-center gap-3 text-left"
                >
                  <span
                    className="w-6 h-6"
                    dangerouslySetInnerHTML={{ __html: ICONS[g.chain] }}
                  />
                  <div>
                    <div className="text-sm opacity-70">{CHAIN_META[g.chain].label}</div>
                    <div className="font-mono text-xs break-all">{g.address}</div>
                  </div>
                </button>
                <button
                  onClick={() => doCopy(g.address)}
                  className="text-xs px-2 py-1 border rounded-md hover:bg-gray-50"
                >
                  {justCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Token chips */}
              <div className="flex flex-wrap gap-2">
                {g.tokens.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setSelected(t.key)}
                    className={selected === t.key ? chipOn : chipOff}
                  >
                    <span className="w-4 h-4" dangerouslySetInnerHTML={{ __html: t.icon }} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Amount + Open */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="text-xs opacity-70">Amount</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="decimal"
              placeholder={`0.00`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-xl px-3 py-2"
            />
            <span className="text-sm min-w-[56px] text-center opacity-70">{unitLabel}</span>
          </div>
        </div>

        <div className="flex items-end">
          <a
            href={payHref || (current ? current.uri : '#')}
            className="block w-full text-center border rounded-2xl py-3 font-medium hover:bg-gray-50"
          >
            Open in wallet
          </a>
        </div>
      </div>

      {/* QR + actions */}
      <div className="flex items-start gap-4">
        {qr && (
          <>
            <img src={qr} alt="QR code" className="w-32 h-32 border rounded-lg" />
            <div className="space-y-2">
              <div className="text-sm opacity-70">
                QR encodes the current selection{amount ? ` and amount (${amount} ${unitLabel})` : ''}.
              </div>
              <a
                download={`oneqr-${data.profile.slug}.png`}
                href={qr}
                className="inline-block text-xs px-3 py-1 border rounded-md hover:bg-gray-50"
              >
                Download QR
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
