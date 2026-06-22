const CSV_URL = process.env.GOOGLE_SHEET_CSV_URL || process.env.NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL || '';
const CACHE_SECONDS = Number(process.env.GOOGLE_SHEET_CACHE_SECONDS || 60);

let cache = {
  url: '',
  at: 0,
  rows: null,
  error: null
};

export function hasGoogleSheetSource() {
  return Boolean(CSV_URL);
}

export function getGoogleSheetUrlStatus() {
  return CSV_URL ? 'configured' : 'not-configured';
}

export async function getGoogleSheetRows() {
  if (!CSV_URL) return null;

  const now = Date.now();
  const ttl = Math.max(5, CACHE_SECONDS) * 1000;
  if (cache.url === CSV_URL && cache.rows && now - cache.at < ttl) {
    return cache.rows;
  }

  const response = await fetch(CSV_URL, {
    cache: 'no-store',
    headers: { Accept: 'text/csv,text/plain,*/*' }
  });

  if (!response.ok) {
    throw new Error(`Google Sheet CSV request failed: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  const rows = parseCsv(text);
  cache = { url: CSV_URL, at: now, rows, error: null };
  return rows;
}

function parseCsv(text) {
  const cleaned = String(text || '').replace(/^\uFEFF/, '');
  const matrix = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < cleaned.length; i += 1) {
    const ch = cleaned[i];
    const next = cleaned[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && next === '\n') i += 1;
      row.push(cell);
      matrix.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += ch;
  }

  row.push(cell);
  matrix.push(row);

  const nonEmptyRows = matrix.filter(r => r.some(c => String(c || '').trim() !== ''));
  if (!nonEmptyRows.length) return [];

  const headers = nonEmptyRows[0].map(h => String(h || '').trim());
  return nonEmptyRows.slice(1).map(values => {
    const obj = {};
    headers.forEach((header, index) => {
      if (!header) return;
      obj[header] = String(values[index] ?? '').trim();
    });
    return obj;
  });
}
