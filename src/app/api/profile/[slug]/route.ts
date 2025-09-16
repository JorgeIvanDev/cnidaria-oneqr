import { NextResponse } from 'next/server';
import { getProfile, getAddresses } from '@/lib/db';
import { buildPaymentURI } from '@/lib/uri';

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const profile = getProfile(params.slug);
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const rows = getAddresses(params.slug);
  const uris = rows.map(r => ({
    chain: r.chain,
    address: r.address,
    uri: buildPaymentURI(r.chain, r.address, { label: profile.displayName }),
  }));

  return NextResponse.json({ profile, uris });
}