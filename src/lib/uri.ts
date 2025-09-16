// src/lib/uri.ts
import type { ChainKey } from './chains';

/**
 * Minimal, reliable payment URI generator.
 * Keeps things simple for launch. Wallets will still open and
 * pre-fill the address. You can extend to EIP-681 / SPL later.
 */
export function buildUri(chain: ChainKey, address: string, asset?: string): string {
  switch (chain) {
    case 'btc': {
      // For BRC-20 like ORDI/DOG we still use standard bitcoin: URI.
      return `bitcoin:${address}`;
    }
    case 'bch': {
      return `bitcoincash:${address}`;
    }
    case 'bsv': {
      // Commonly recognized by compatible wallets
      return `bitcoinsv:${address}`;
    }
    case 'sol': {
      // Basic solana: address URI. (SPL token-aware links can be added later.)
      return `solana:${address}`;
    }
    case 'eth':
    case 'base':
    case 'polygon':
    case 'arbitrum': {
      // Simple ethereum-style deep link. (You can upgrade to EIP-681 later.)
      return `ethereum:${address}`;
    }
    default: {
      // Fallback to raw address as last resort (shouldn't happen if ChainKey is correct)
      return address;
    }
  }
}

export default buildUri;
