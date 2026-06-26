import { NextResponse } from 'next/server';
import { getDashboardPayload } from '../../../lib/analytics';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 10;

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  try {
    const payload = await getDashboardPayload(Object.fromEntries(searchParams.entries()));

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        title: 'Foodica Sales Person Analytics Dashboard',
        sourceType: 'api-error',
        sheetStatus: 'error',
        sheetError: String(error?.message || error),
        metrics: {
          totalClients: 0,
          repCount: 0,
          regionCount: 0,
          channelCount: 0,
          storeCount: 0,
          missingChannel: 0,
          missingChannelPct: 0,
          topRep: null
        },
        options: {
          salespersons: [],
          regions: [],
          channels: [],
          groups: [],
          stores: []
        },
        charts: {
          topReps: [],
          groups: [],
          regions: [],
          channels: [],
          heatmap: {
            regions: [],
            groups: [],
            matrix: []
          }
        },
        tables: {
          profile: [],
          detail: [],
          stores: []
        },
        rowCounts: {
          profile: 0,
          detail: 0,
          stores: 0
        }
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
        }
      }
    );
  }
}