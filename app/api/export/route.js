import { getCsv } from '../../../lib/analytics';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 10;

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  try {
    const csv = await getCsv(Object.fromEntries(searchParams.entries()));
    const rawTab = searchParams.get('tab');
    const tab = rawTab === 'detail' ? 'detail' : rawTab === 'stores' ? 'stores' : 'profile';
    const lang = searchParams.get('lang') === 'ar' ? 'ar' : 'en';

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="foodica_sales_${tab}_${lang}.csv"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (error) {
    const message = `Export failed: ${String(error?.message || error)}`;

    return new Response('\ufeff' + message, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="foodica_export_error.csv"',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  }
}