function getCsvUrl() {
  return process.env.GOOGLE_SHEET_CSV_URL || process.env.NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL || '';
}

function getCacheSeconds() {
  return Number(process.env.GOOGLE_SHEET_CACHE_SECONDS || 30);
}

const SHEET_TIMEOUT_MS = Number(process.env.GOOGLE_SHEET_TIMEOUT_MS || 6000);

let cache = {
  url: '',
  at: 0,
  rows: null,
  error: null,
  status: 'not-configured'
};

export function hasGoogleSheetSource() {
  return Boolean(getCsvUrl());
}

export function getGoogleSheetUrlStatus() {
  const url = getCsvUrl();

  if (!url) {
    return 'not-configured';
  }

  if (cache.url === url && cache.status) {
    return cache.status;
  }

  return 'configured';
}

export function getGoogleSheetLastError() {
  return cache.error || null;
}

export async function getGoogleSheetRows() {
  const csvUrl = getCsvUrl();

  if (!csvUrl) {
    cache = {
      ...cache,
      url: '',
      status: 'not-configured',
      error: null
    };

    return null;
  }

  const now = Date.now();
  const ttl = Math.max(5, getCacheSeconds()) * 1000;

  if (cache.url === csvUrl && Array.isArray(cache.rows) && now - cache.at < ttl) {
    return cache.rows;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SHEET_TIMEOUT_MS);

  try {
    const response = await fetch(csvUrl, {
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        Accept: 'text/csv,text/plain,*/*',
        'User-Agent': 'Foodica-Dashboard/1.0'
      }
    });

    clearTimeout(timer);

    if (!response.ok) {
      const message = `Google Sheet CSV request failed: ${response.status} ${response.statusText}`;

      cache = {
        url: csvUrl,
        at: Date.now(),
        rows: null,
        error: message,
        status: 'error'
      };

      throw new Error(message);
    }

    const text = await response.text();
    const rows = parseCsv(text);

    cache = {
      url: csvUrl,
      at: Date.now(),
      rows,
      error: null,
      status: 'connected'
    };

    return rows;
  } catch (error) {
    clearTimeout(timer);

    const message = error?.name === 'AbortError'
      ? `Google Sheet request timed out after ${Math.round(SHEET_TIMEOUT_MS / 1000)} seconds`
      : String(error?.message || error);

    cache = {
      url: csvUrl,
      at: Date.now(),
      rows: null,
      error: message,
      status: 'error'
    };

    throw new Error(message);
  }
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
      row.push(cell.trim());
      cell = '';
      continue;
    }

    if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && next === '\n') {
        i += 1;
      }

      row.push(cell.trim());
      matrix.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += ch;
  }

  row.push(cell.trim());
  matrix.push(row);

  const nonEmptyRows = matrix.filter((r) =>
    r.some((c) => String(c || '').trim() !== '')
  );

  if (!nonEmptyRows.length) {
    return [];
  }

  const headers = nonEmptyRows[0].map((h) => String(h || '').trim());

  return nonEmptyRows.slice(1).map((values) => {
    const obj = {};

    headers.forEach((header, index) => {
      if (!header) {
        return;
      }

      obj[header] = String(values[index] ?? '').trim();
    });

    return obj;
  });
}