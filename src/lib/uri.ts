import type { ChainKey } from './chains';

export function buildPaymentURI(
  chain: ChainKey,
  address: string,
  opts?: { amount?: string; label?: string; memo?: string; asset?: string }
): string {
  const { amount, label, memo } = opts || {};

  if (chain === 'btc') {
    const params = new URLSearchParams();
    if (amount) params.set('amount', amount);
    if (label) params.set('label', label);
    if (memo) params.set('message', memo);
    return `bitcoin:${address}${params.toString() ? '?' + params.toString() : ''}`;
  }

  if (chain === 'sol') {
    const params = new URLSearchParams();
    if (amount) params.set('amount', amount);
    if (label) params.set('label', label);
    if (memo) params.set('memo', memo);
    return `solana:${address}${params.toString() ? '?' + params.toString() : ''}`;
  }

  // EVM (ETH/Base/Polygon/Arbitrum) minimal EIP-681 style (no amount for MVP)
  return `ethereum:${address}`;
}