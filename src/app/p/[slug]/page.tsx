'use client';

import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';

type ChainKey = 'btc' | 'eth' | 'base' | 'polygon' | 'arbitrum' | 'sol';

type ProfileRes = {
  profile: { slug: string; displayName: string; defaultChain: ChainKey; note?: string };
  uris: { chain: ChainKey; address: string; uri: string }[];
};

const CHAIN_LABEL: Record<ChainKey, string> = {
  btc: 'Bitcoin',
  eth: 'Ethereum',
  base: 'Base',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum One',
  sol: 'Solana',
};

export default function ProfilePage({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<ProfileRes | null>(null);
  const [qr, setQr] = useState<string>('');
  const [selected, setSelected] = useState<ChainKey | null>(null);

  useEffect(() => {
    fetch(`/api/profile/${params.slug}`)
      .then(r => r.json())
      .then((j: ProfileRes) => {
        setData(j);
        QRCode.toDataURL(`${location.origin}/p/${params.slug}`, { margin: 1, scale: 4 })
          .then(setQr);
        const hint = (new URLSearchParams(location.search)).get('chain') as ChainKey | null;
        setSelected(hint || j.profile.defaultChain);
      })
      .catch(console.error);
  }, [params.slug]);

  const current = useMemo(() => {
    if (!data || !selected) return null;
    return data.uris.find(u => u.chain === selected) || null;
  }, [data, selected]);

  if (!data) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-semibold">{data.profile.displayName}</div>
        <span className="text-sm opacity-70">@{data.profile.slug}</span>
      </div>

      {data.profile.note && <p className="opacity-80">{data.profile.note}</p>}

      <div className="grid grid-cols-2 gap-2">
        {data.uris.map(u => (
          <button
            key={u.chain}
            onClick={() => setSelected(u.chain)}
            className={`border rounded-xl px-3 py-2 text-left ${selected === u.chain ? 'border-black' : 'border-gray-300'}`}
          >
            <div className="text-sm opacity-70">{CHAIN_LABEL[u.chain]}</div>
            <div className="font-mono text-xs break-all">{u.address}</div>
          </button>
        ))}
      </div>

      {current && (
        <a
          href={current.uri}
          className="block w-full text-center border rounded-xl py-3 font-medium hover:bg-gray-50"
        >
          Open in wallet
        </a>
      )}

      <div className="flex items-center gap-4">
        {qr && <img src={qr} alt="QR code" className="w-32 h-32 border rounded-lg" />}
        <div className="text-sm opacity-70">
          Share this QR anywhere. It points to <span className="font-mono">{`/p/${params.slug}`}</span>.
        </div>
      </div>
    </div>
  );
}