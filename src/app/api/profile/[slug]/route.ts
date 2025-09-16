import { NextRequest, NextResponse } from 'next/server';
import { getProfile } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await ctx.params;

    // getProfile now returns the full payload { profile, uris }
    const data = await getProfile(slug);
    if (!data) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // just return it as-is; matches what the client expects
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.error('[api/profile] error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
