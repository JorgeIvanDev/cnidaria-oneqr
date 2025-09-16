export type ChainKey = 'btc' | 'eth' | 'base' | 'polygon' | 'arbitrum' | 'sol';

export const CHAIN_META: Record<ChainKey, { label: string; chainId?: number }> = {
  btc:      { label: 'Bitcoin' },
  eth:      { label: 'Ethereum', chainId: 1 },
  base:     { label: 'Base', chainId: 8453 },
  polygon:  { label: 'Polygon', chainId: 137 },
  arbitrum: { label: 'Arbitrum One', chainId: 42161 },
  sol:      { label: 'Solana' },
};