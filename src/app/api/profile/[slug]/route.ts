// src/app/api/profile/[slug]/route.ts
import { NextResponse } from 'next/server';
import { getProfile, getAddresses, type AddressRow } from '@/lib/db';

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> } // Next 15: params is a Promise
) {
  const { slug } = await ctx.params;

  const profile = getProfile(slug);
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const rows = getAddresses(slug);
  const uris = rows.map((r: AddressRow) => ({
    chain: r.chain,
    address: r.address,
    asset: r.asset,
    uri: r.uri,
  }));

  return NextResponse.json({ profile, uris });
}
