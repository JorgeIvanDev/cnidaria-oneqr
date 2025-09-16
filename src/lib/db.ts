// src/lib/db.ts
import fs from 'node:fs';
import path from 'node:path';
import type { ChainKey } from './chains';
import { buildUri } from './uri';


export type Profile = {
  slug: string;
  displayName: string;
  defaultChain: ChainKey;
  note?: string;
};

export type AddressInput = {
  chain: ChainKey;
  address: string;
  asset?: string;
};

export type AddressRow = AddressInput & {
  uri: string;
};

export type ProfilesFile = {
  profiles: Record<
    string,
    {
      displayName: string;
      defaultChain: ChainKey;
      note?: string;
      addresses: AddressInput[];
    }
  >;
};

const DATA_PATH = path.join(process.cwd(), 'data', 'profiles.json');

function loadFile(): ProfilesFile | null {
  try {
    const txt = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(txt) as ProfilesFile;
  } catch {
    return null;
  }
}

/** ------- PUBLIC API used by routes/pages ------- **/

export function getProfile(slug: string): Profile | null {
  const file = loadFile();
  if (file?.profiles?.[slug]) {
    const p = file.profiles[slug];
    return {
      slug,
      displayName: p.displayName,
      defaultChain: p.defaultChain,
      note: p.note,
    };
  }

  // Fallback (hard-coded example) — adjust or remove
  if (slug === 'mike') {
    return {
      slug: 'mike',
      displayName: 'Cnidaria',
      defaultChain: 'btc',
      note: 'Thanks for supporting the jelly gang.',
    };
  }

  return null;
}

export function getAddresses(slug: string): AddressRow[] {
  const file = loadFile();
  if (file?.profiles?.[slug]) {
    const addrs = file.profiles[slug].addresses;
    return addrs.map((a) => ({
      ...a,
      uri: buildUri(a.chain, a.address, a.asset),
    }));
  }

  // Fallback (hard-coded example) — adjust or remove
  if (slug === 'mike') {
    const fallback: AddressInput[] = [
      { chain: 'btc', address: 'bc1qEXAMPLEmikebtc' },
      { chain: 'bsv', address: '1EXAMPLEmikebsv' },
      { chain: 'bch', address: 'bitcoincash:qEXAMPLEmikebch' },

      { chain: 'eth', address: '0xAbCDEF...ETH' },
      { chain: 'base', address: '0xAbCDEF...ETH' },
      { chain: 'polygon', address: '0xAbCDEF...ETH' },
      { chain: 'arbitrum', address: '0xAbCDEF...ETH' },

      { chain: 'eth', asset: 'USDC', address: '0xAbCDEF...ETH' },
      { chain: 'eth', asset: 'USDT', address: '0xAbCDEF...ETH' },

      { chain: 'sol', address: '9xyEXAMPLEmikesol' },
      { chain: 'sol', asset: 'USDC', address: '9xyEXAMPLEmikesol' },
      { chain: 'sol', asset: 'USDT', address: '9xyEXAMPLEmikesol' },

      { chain: 'btc', asset: 'ORDI', address: 'bc1qEXAMPLEmikebtc' },
      { chain: 'btc', asset: 'DOG',  address: 'bc1qEXAMPLEmikebtc' },
    ];

    return fallback.map((a) => ({
      ...a,
      uri: buildUri(a.chain, a.address, a.asset),
    }));
  }

  return [];
}
