export type ChainKey =
  | 'btc'
  | 'bsv'
  | 'bch'
  | 'eth'
  | 'base'
  | 'polygon'
  | 'arbitrum'
  | 'sol';

export const CHAIN_META: Record<ChainKey, { label: string; chainId?: number }> = {
  btc:      { label: 'Bitcoin' },
  bsv:      { label: 'Bitcoin SV' },
  bch:      { label: 'Bitcoin Cash' },
  eth:      { label: 'Ethereum', chainId: 1 },
  base:     { label: 'Base', chainId: 8453 },
  polygon:  { label: 'Polygon', chainId: 137 },
  arbitrum: { label: 'Arbitrum One', chainId: 42161 },
  sol:      { label: 'Solana' },
};

/** Minimal token registries (add more later). Keys are lowercase. */
export const ERC20_TOKENS: Record<string, { symbol: string; address: string; decimals: number }> = {
  // Ethereum mainnet
  usdc: { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
  usdt: { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
  dai:  { symbol: 'DAI',  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
};

export const SPL_TOKENS: Record<string, { symbol: string; mint: string; decimals: number }> = {
  usdc: { symbol: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 },
  usdt: { symbol: 'USDT', mint: 'Es9vMFrzaCERmJfrF4H2FYD4Kqv3dDwLYbEsmX3bRc2', decimals: 6 },
};
