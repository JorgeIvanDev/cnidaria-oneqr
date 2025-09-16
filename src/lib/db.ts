import type { ChainKey } from './chains';

export type Profile = {
  slug: string;
  displayName: string;
  defaultChain: ChainKey;
  note?: string;
};

export type AddressRow = {
  profileSlug: string;
  chain: ChainKey;
  address: string;
  asset?: string;
  label?: string;
};

export const PROFILES: Profile[] = [
  { slug: 'mike', displayName: 'Cnidaria', defaultChain: 'base', note: 'Thanks for supporting the jelly gang.' },
];

export const ADDRESSES: AddressRow[] = [
  { profileSlug: 'mike', chain: 'btc', address: 'bc1qEXAMPLEmikebtc' },
  { profileSlug: 'mike', chain: 'eth', address: '0xAbCDEF...ETH' },
  { profileSlug: 'mike', chain: 'base', address: '0xAbCDEF...ETH' },
  { profileSlug: 'mike', chain: 'polygon', address: '0xAbCDEF...ETH' },
  { profileSlug: 'mike', chain: 'sol', address: '9xyEXAMPLEmikesol' },
];

export function getProfile(slug: string) {
  return PROFILES.find(p => p.slug === slug) || null;
}

export function getAddresses(slug: string) {
  return ADDRESSES.filter(a => a.profileSlug === slug);
}