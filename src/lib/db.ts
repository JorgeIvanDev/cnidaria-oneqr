// src/lib/db.ts

export type ChainKey =
  | 'btc'
  | 'bsv'
  | 'bch'
  | 'eth'
  | 'base'
  | 'polygon'
  | 'arbitrum'
  | 'sol';

export type ApiPayload = {
  profile: {
    slug: string;
    displayName: string;
    defaultChain: ChainKey;
    note?: string;
  };
  uris: {
    chain: ChainKey;
    address: string;
    /** Optional token/symbol (e.g., usdc, usdt, ordi, dog). */
    asset?: string;
    /** Prebuilt wallet URI to open. */
    uri: string;
  }[];
};

const DATA: Record<string, ApiPayload> = {
  mike: {
    profile: {
      slug: 'mike',
      displayName: 'Cnidaria',
      defaultChain: 'btc',
      note: 'Thanks for supporting the jelly gang.',
    },
    uris: [
      // --- Bitcoin (native + BRC-20s)
      { chain: 'btc', address: 'bc1qEXAMPLEmikebtc', uri: 'bitcoin:bc1qEXAMPLEmikebtc' },
      { chain: 'btc', address: 'bc1qEXAMPLEmikebtc', asset: 'ordi', uri: 'bitcoin:bc1qEXAMPLEmikebtc?asset=ordi' },
      { chain: 'btc', address: 'bc1qEXAMPLEmikebtc', asset: 'dog',  uri: 'bitcoin:bc1qEXAMPLEmikebtc?asset=dog' },

      // --- Bitcoin SV
      { chain: 'bsv', address: '1EXAMPLEmikebsv', uri: 'bitcoinsv:1EXAMPLEmikebsv' },

      // --- Bitcoin Cash
      { chain: 'bch', address: 'bitcoincash:qEXAMPLEmikebch', uri: 'bitcoincash:qEXAMPLEmikebch' },

      // --- Ethereum (native + ERC-20s)
      { chain: 'eth', address: '0xAbCDEFEXAMPLEmike', uri: 'ethereum:0xAbCDEFEXAMPLEmike' },
      { chain: 'eth', address: '0xAbCDEFEXAMPLEmike', asset: 'usdc', uri: 'ethereum:0xAbCDEFEXAMPLEmike?asset=usdc' },
      { chain: 'eth', address: '0xAbCDEFEXAMPLEmike', asset: 'usdt', uri: 'ethereum:0xAbCDEFEXAMPLEmike?asset=usdt' },

      // --- Base (ETH + USDC + USDT)
      { chain: 'base', address: '0xAbCDEFEXAMPLEmike', uri: 'ethereum:0xAbCDEFEXAMPLEmike' },
      { chain: 'base', address: '0xAbCDEFEXAMPLEmike', asset: 'usdc', uri: 'ethereum:0xAbCDEFEXAMPLEmike?asset=usdc' },
      { chain: 'base', address: '0xAbCDEFEXAMPLEmike', asset: 'usdt', uri: 'ethereum:0xAbCDEFEXAMPLEmike?asset=usdt' },

      // --- Polygon (ETH + USDC + USDT)
      { chain: 'polygon', address: '0xAbCDEFEXAMPLEmike', uri: 'ethereum:0xAbCDEFEXAMPLEmike' },
      { chain: 'polygon', address: '0xAbCDEFEXAMPLEmike', asset: 'usdc', uri: 'ethereum:0xAbCDEFEXAMPLEmike?asset=usdc' },
      { chain: 'polygon', address: '0xAbCDEFEXAMPLEmike', asset: 'usdt', uri: 'ethereum:0xAbCDEFEXAMPLEmike?asset=usdt' },

      // --- Arbitrum (ETH + USDC + USDT)
      { chain: 'arbitrum', address: '0xAbCDEFEXAMPLEmike', uri: 'ethereum:0xAbCDEFEXAMPLEmike' },
      { chain: 'arbitrum', address: '0xAbCDEFEXAMPLEmike', asset: 'usdc', uri: 'ethereum:0xAbCDEFEXAMPLEmike?asset=usdc' },
      { chain: 'arbitrum', address: '0xAbCDEFEXAMPLEmike', asset: 'usdt', uri: 'ethereum:0xAbCDEFEXAMPLEmike?asset=usdt' },

      // --- Solana (native + SPLs)
      { chain: 'sol', address: '9xyEXAMPLEmikesol', uri: 'solana:9xyEXAMPLEmikesol' },
      { chain: 'sol', address: '9xyEXAMPLEmikesol', asset: 'usdc', uri: 'solana:9xyEXAMPLEmikesol?spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
      { chain: 'sol', address: '9xyEXAMPLEmikesol', asset: 'usdt', uri: 'solana:9xyEXAMPLEmikesol?spl-token=Es9vMFrzaCERmJfrF4H2FYD4Kqv3dDwLYbEsmX3bRc2' },
    ],
  },
};

export async function getProfile(slug: string): Promise<ApiPayload | null> {
  return DATA[slug] ?? null;
}
