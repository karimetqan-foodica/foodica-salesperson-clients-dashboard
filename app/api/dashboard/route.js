import { NextResponse } from 'next/server';
import { getDashboardPayload } from '../../../lib/analytics';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const payload = await getDashboardPayload(Object.fromEntries(searchParams.entries()));
  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
    }
  });
}
