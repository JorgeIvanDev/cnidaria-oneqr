import type { ChainKey } from './chains';
import { ERC20_TOKENS, SPL_TOKENS } from './chains';

/** Resolve a token identifier to a contract/mint string */
function resolveTokenAddress(chain: ChainKey, asset?: string): string | null {
  if (!asset) return null;
  const key = asset.toLowerCase();

  if (chain === 'sol') {
    return SPL_TOKENS[key]?.mint ?? asset; // allow raw mint
  }

  if (chain === 'eth' || chain === 'base' || chain === 'polygon' || chain === 'arbitrum') {
    return ERC20_TOKENS[key]?.address ?? asset; // allow raw contract
  }

  return null;
}

export function buildPaymentURI(
  chain: ChainKey,
  address: string,
  opts?: { label?: string; amount?: string; memo?: string; asset?: string }
): string {
  const { amount, label, memo, asset } = opts || {};
  const tokenAddr = resolveTokenAddress(chain, asset);

  // --- Bitcoin-style chains ---
  if (chain === 'btc') {
    const p = new URLSearchParams();
    if (amount) p.set('amount', amount);
    if (label) p.set('label', label);
    if (memo) p.set('message', memo);
    const qs = p.toString();
    return `bitcoin:${address}${qs ? `?${qs}` : ''}`;
  }

  if (chain === 'bsv') {
    // Some wallets also accept `bitcoin:`, but `bitcoinsv:` is common.
    return `bitcoinsv:${address}`;
  }

  if (chain === 'bch') {
    // CashAddr recommended
    return `bitcoincash:${address}`;
  }

  // --- Solana / Solana Pay ---
  if (chain === 'sol') {
    const p = new URLSearchParams();
    if (amount) p.set('amount', amount);
    if (label) p.set('label', label || '');
    if (memo) p.set('memo', memo || '');
    if (tokenAddr) p.set('spl-token', tokenAddr); // SPL token mint
    const qs = p.toString();
    return `solana:${address}${qs ? `?${qs}` : ''}`;
  }

  // --- EVM chains (ETH/Base/Polygon/Arbitrum) ---
  if (!tokenAddr) {
    // Native coin (ETH, MATIC, etc). For MVP we omit value.
    return `ethereum:${address}`;
  }

  // ERC-20 transfer (EIP-681).
  // NOTE: If you pass `amount`, it must be in minimal units (wei) for MVP.
  const p = new URLSearchParams();
  p.set('address', address);
  if (amount) p.set('uint256', amount);
  return `ethereum:${tokenAddr}/transfer?${p.toString()}`;
}
