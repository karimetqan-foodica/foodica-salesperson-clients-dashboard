import { DASHBOARD_DATA } from './dashboardData';
import { getGoogleSheetRows, getGoogleSheetUrlStatus } from './sheets';

const TITLE = 'Foodica Sales Person Analytics Dashboard';

const UNSPECIFIED = 'غير محدد';
const UNCLEAR_REGION = 'Region غير واضح';

const FIELD_ALIASES = {
  clientId: ['Client ID', 'ClientID', 'Customer ID', 'CustomerID', 'Account ID', 'ID', 'Client Code', 'Customer Code', 'كود العميل', 'كود المحل', 'رقم العميل', 'رقم المحل'],
  storeName: ['Store Name', 'Shop Name', 'Outlet Name', 'Client Name', 'Customer Name', 'Customer', 'Name', 'Branch Name', 'Merchant Name', 'Store', 'اسم المحل', 'اسم المتجر', 'اسم العميل', 'اسم الفرع'],
  salesperson: ['Salesperson', 'Sales Person', 'Sales Rep', 'Salesman', 'Representative', 'Rep', 'Employee', 'Owner', 'مندوب', 'المندوب', 'اسم المندوب', 'مندوب البيع'],
  region: ['Region', 'Area', 'Zone', 'City', 'Governorate', 'المنطقة', 'منطقة', 'المحافظة', 'محافظة'],
  salesChannel: ['Sales Channel', 'Channel', 'Customer Channel', 'Outlet Channel', 'Type', 'قناة البيع', 'قناه البيع', 'القناة', 'نوع العميل'],
  channelGroup: ['Channel Group', 'Group', 'Channel Category', 'Category', 'مجموعة القناة', 'تصنيف القناة', 'التصنيف']
};

export function valueLabel(value, lang = 'en') {
  const map = {
    ar: {
      [UNSPECIFIED]: UNSPECIFIED,
      [UNCLEAR_REGION]: UNCLEAR_REGION,
      Retail: 'ريتيل',
      Horeca: 'هوريكا',
      'Modern Trade': 'مودرن تريد',
      'Gas Station': 'محطات بنزين',
      'E-Commerce': 'تجارة إلكترونية',
      Wholesale: 'جملة',
      'Sub-D': 'Sub-D'
    },
    en: {
      [UNSPECIFIED]: 'Unspecified',
      [UNCLEAR_REGION]: 'Unclear Region'
    }
  };
  return map[lang]?.[String(value)] || String(value ?? '');
}

export function colLabel(col, lang = 'en') {
  const cols = {
    ar: {
      Salesperson: 'المندوب',
      'Client Count': 'عدد العملاء',
      Region: 'المنطقة',
      'Sales Channel': 'قناة البيع',
      'Channel Group': 'مجموعة القناة',
      'Primary Region': 'المنطقة الأساسية',
      'Primary Channel': 'القناة الأساسية',
      'Primary Channel Group': 'مجموعة القناة الأساسية',
      'Region Dominance %': 'نسبة سيطرة المنطقة',
      'Channel Dominance %': 'نسبة سيطرة القناة',
      'Client ID': 'كود العميل',
      'Store Name': 'اسم المحل'
    },
    en: {
      Salesperson: 'Salesperson',
      'Client Count': 'Client Count',
      Region: 'Region',
      'Sales Channel': 'Sales Channel',
      'Channel Group': 'Channel Group',
      'Primary Region': 'Primary Region',
      'Primary Channel': 'Primary Channel',
      'Primary Channel Group': 'Primary Channel Group',
      'Region Dominance %': 'Region Dominance %',
      'Channel Dominance %': 'Channel Dominance %',
      'Client ID': 'Client ID',
      'Store Name': 'Store Name'
    }
  };
  return cols[lang]?.[col] || col;
}

function number(v) {
  return Number(v || 0);
}

function clean(v, fallback = UNSPECIFIED) {
  const text = String(v ?? '').trim();
  return text || fallback;
}

function keyNorm(v) {
  return String(v || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_\-./\\:]+/g, '')
    .replace(/[()\[\]{}]/g, '');
}

function pick(record, aliases) {
  const keys = Object.keys(record || {});
  const lookup = new Map(keys.map(k => [keyNorm(k), k]));
  for (const alias of aliases) {
    const realKey = lookup.get(keyNorm(alias));
    if (realKey && String(record[realKey] ?? '').trim() !== '') return record[realKey];
  }
  return '';
}

function inferChannelGroup(channel) {
  const c = String(channel || '').toLowerCase();
  if (!c || c === UNSPECIFIED) return UNSPECIFIED;
  if (c.includes('horeca') || c.includes('restaurant') || c.includes('cafe') || c.includes('café') || c.includes('hotel')) return 'Horeca';
  if (c.includes('gas')) return 'Gas Station';
  if (c.includes('modern')) return 'Modern Trade';
  if (c.includes('e-commerce') || c.includes('ecommerce') || c.includes('online')) return 'E-Commerce';
  if (c.includes('wholesale')) return 'Wholesale';
  if (c.includes('sub-d') || c.includes('subd')) return 'Sub-D';
  return 'Retail';
}

function normalizeSheetRecords(records = []) {
  const unique = new Map();

  records.forEach((record, index) => {
    const clientId = clean(pick(record, FIELD_ALIASES.clientId), '');
    const storeName = clean(pick(record, FIELD_ALIASES.storeName), '');
    const salesperson = clean(pick(record, FIELD_ALIASES.salesperson));
    const region = clean(pick(record, FIELD_ALIASES.region));
    const salesChannel = clean(pick(record, FIELD_ALIASES.salesChannel));
    const rawGroup = clean(pick(record, FIELD_ALIASES.channelGroup), '');
    const channelGroup = rawGroup || inferChannelGroup(salesChannel);

    if (!clientId && !storeName && salesperson === UNSPECIFIED) return;

    const key = clientId
      ? `id:${clientId}`
      : `name:${storeName || `row-${index}`}|rep:${salesperson}`;

    if (!unique.has(key)) {
      unique.set(key, {
        'Client ID': clientId || '-',
        'Store Name': storeName || clientId || '-',
        Salesperson: salesperson,
        Region: region,
        'Sales Channel': salesChannel,
        'Channel Group': channelGroup || UNSPECIFIED
      });
    }
  });

  return Array.from(unique.values());
}

function aggregateStoresToRows(stores = []) {
  const map = new Map();
  for (const s of stores) {
    const key = [s.Salesperson, s.Region, s['Sales Channel'], s['Channel Group']].join('||');
    if (!map.has(key)) {
      map.set(key, {
        Salesperson: s.Salesperson,
        Region: s.Region,
        'Sales Channel': s['Sales Channel'],
        'Channel Group': s['Channel Group'],
        'Client Count': 0
      });
    }
    map.get(key)['Client Count'] += 1;
  }
  return Array.from(map.values());
}

async function getSource() {
  let sheetError = null;

  try {
    const records = await getGoogleSheetRows();
    const stores = normalizeSheetRecords(records || []);
    if (stores.length) {
      return {
        rows: aggregateStoresToRows(stores),
        stores,
        generatedAt: new Date().toISOString(),
        sourceFile: 'Google Sheet',
        sourceType: 'google-sheet',
        sheetStatus: getGoogleSheetUrlStatus(),
        sheetError: null
      };
    }
  } catch (error) {
    sheetError = error?.message || 'Google Sheet fetch failed';
  }

  return {
    rows: DASHBOARD_DATA.repRegionChannel,
    stores: [],
    generatedAt: DASHBOARD_DATA.generatedAt,
    sourceFile: DASHBOARD_DATA.sourceFile,
    sourceType: 'embedded-fallback',
    sheetStatus: getGoogleSheetUrlStatus(),
    sheetError
  };
}

function rowMatchesFilters(row, params = {}) {
  const rep = String(params.rep || '').trim().toLowerCase();
  const region = String(params.region || '');
  const channel = String(params.channel || '');
  const group = String(params.group || '');
  const minClients = Number(params.minClients || 0);
  const excludeArchive = String(params.excludeArchive ?? 'true') !== 'false';

  const rowRep = String(row.Salesperson || '');
  if (excludeArchive && rowRep === 'Archive_Rep') return false;
  if (rep && !rowRep.toLowerCase().includes(rep)) return false;
  if (region && row.Region !== region) return false;
  if (channel && row['Sales Channel'] !== channel) return false;
  if (group && row['Channel Group'] !== group) return false;
  if (number(row['Client Count']) < minClients) return false;
  return true;
}

function storeMatchesFilters(store, params = {}) {
  const rep = String(params.rep || '').trim().toLowerCase();
  const storeName = String(params.store || '').trim().toLowerCase();
  const region = String(params.region || '');
  const channel = String(params.channel || '');
  const group = String(params.group || '');
  const excludeArchive = String(params.excludeArchive ?? 'true') !== 'false';

  const rowRep = String(store.Salesperson || '');
  if (excludeArchive && rowRep === 'Archive_Rep') return false;
  if (rep && !rowRep.toLowerCase().includes(rep)) return false;
  if (storeName && !String(store['Store Name'] || '').toLowerCase().includes(storeName)) return false;
  if (region && store.Region !== region) return false;
  if (channel && store['Sales Channel'] !== channel) return false;
  if (group && store['Channel Group'] !== group) return false;
  return true;
}

function rowsByFilters(rows, params = {}) {
  return rows.filter(row => rowMatchesFilters(row, params));
}

function storesByFilters(stores, params = {}) {
  return stores.filter(store => storeMatchesFilters(store, params));
}

function sumBy(rows, key) {
  const map = new Map();
  for (const r of rows) {
    const k = r[key] ?? UNSPECIFIED;
    map.set(k, (map.get(k) || 0) + number(r['Client Count']));
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function repProfileFromRows(rows) {
  const grouped = new Map();

  for (const r of rows) {
    const rep = r.Salesperson || UNSPECIFIED;
    if (!grouped.has(rep)) {
      grouped.set(rep, {
        Salesperson: rep,
        'Client Count': 0,
        regions: new Map(),
        channels: new Map(),
        groups: new Map()
      });
    }
    const g = grouped.get(rep);
    const cnt = number(r['Client Count']);
    g['Client Count'] += cnt;
    g.regions.set(r.Region || UNSPECIFIED, (g.regions.get(r.Region || UNSPECIFIED) || 0) + cnt);
    g.channels.set(r['Sales Channel'] || UNSPECIFIED, (g.channels.get(r['Sales Channel'] || UNSPECIFIED) || 0) + cnt);
    g.groups.set(r['Channel Group'] || UNSPECIFIED, (g.groups.get(r['Channel Group'] || UNSPECIFIED) || 0) + cnt);
  }

  return Array.from(grouped.values()).map(g => {
    const topRegion = Array.from(g.regions.entries()).sort((a, b) => b[1] - a[1])[0] || [UNSPECIFIED, 0];
    const topChannel = Array.from(g.channels.entries()).sort((a, b) => b[1] - a[1])[0] || [UNSPECIFIED, 0];
    const topGroup = Array.from(g.groups.entries()).sort((a, b) => b[1] - a[1])[0] || [UNSPECIFIED, 0];
    return {
      Salesperson: g.Salesperson,
      'Client Count': g['Client Count'],
      'Primary Region': topRegion[0],
      'Primary Channel': topChannel[0],
      'Primary Channel Group': topGroup[0],
      'Region Dominance %': g['Client Count'] ? Math.round((topRegion[1] / g['Client Count']) * 1000) / 10 : 0,
      'Channel Dominance %': g['Client Count'] ? Math.round((topChannel[1] / g['Client Count']) * 1000) / 10 : 0
    };
  }).sort((a, b) => b['Client Count'] - a['Client Count']);
}

function topMatrix(rows, regionLimit = 8, groupLimit = 8) {
  const regions = sumBy(rows, 'Region').slice(0, regionLimit).map(x => x.name);
  const groups = sumBy(rows, 'Channel Group').slice(0, groupLimit).map(x => x.name);
  const totals = new Map();

  for (const r of rows) {
    if (!regions.includes(r.Region) || !groups.includes(r['Channel Group'])) continue;
    const key = `${r.Region}||${r['Channel Group']}`;
    totals.set(key, (totals.get(key) || 0) + number(r['Client Count']));
  }

  const max = Math.max(1, ...Array.from(totals.values()));
  const matrix = regions.map(region => ({
    region,
    cells: groups.map(group => ({
      group,
      value: totals.get(`${region}||${group}`) || 0,
      intensity: (totals.get(`${region}||${group}`) || 0) / max
    }))
  }));

  return { regions, groups, matrix };
}

function uniqueSorted(values) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b)));
}

export async function getDashboardPayload(params = {}) {
  const source = await getSource();
  const rows = rowsByFilters(source.rows, params);
  const storeRows = storesByFilters(source.stores, params)
    .sort((a, b) => String(a.Salesperson).localeCompare(String(b.Salesperson)) || String(a['Store Name']).localeCompare(String(b['Store Name'])));
  const storeOptionsRows = storesByFilters(source.stores, { ...params, store: '' });
  const profile = repProfileFromRows(rows);
  const detail = rows.slice().sort((a, b) => number(b['Client Count']) - number(a['Client Count']));

  const totalClients = rows.reduce((sum, r) => sum + number(r['Client Count']), 0);
  const repCount = new Set(rows.map(r => r.Salesperson)).size;
  const regionCount = new Set(rows.map(r => r.Region)).size;
  const channelCount = new Set(rows.map(r => r['Sales Channel'])).size;
  const missingChannel = rows
    .filter(r => r['Sales Channel'] === UNSPECIFIED)
    .reduce((sum, r) => sum + number(r['Client Count']), 0);

  return {
    title: TITLE,
    generatedAt: source.generatedAt,
    sourceFile: source.sourceFile,
    sourceType: source.sourceType,
    sheetStatus: source.sheetStatus,
    sheetError: source.sheetError,
    metrics: {
      totalClients,
      repCount,
      regionCount,
      channelCount,
      storeCount: storeRows.length,
      missingChannel,
      missingChannelPct: totalClients ? Math.round((missingChannel / totalClients) * 1000) / 10 : 0,
      topRep: profile[0] || null
    },
    options: {
      salespersons: uniqueSorted(source.rows.map(r => r.Salesperson)),
      regions: uniqueSorted(source.rows.map(r => r.Region)),
      channels: uniqueSorted(source.rows.map(r => r['Sales Channel'])),
      groups: uniqueSorted(source.rows.map(r => r['Channel Group'])),
      stores: uniqueSorted(storeOptionsRows.map(r => r['Store Name'])).slice(0, 2000)
    },
    charts: {
      topReps: profile.slice(0, 15).map(r => ({ name: r.Salesperson, value: r['Client Count'] })),
      groups: sumBy(rows, 'Channel Group').slice(0, 12),
      regions: sumBy(rows, 'Region').slice(0, 12),
      channels: sumBy(rows, 'Sales Channel').slice(0, 12),
      heatmap: topMatrix(rows)
    },
    tables: {
      profile: profile.slice(0, 500),
      detail: detail.slice(0, 800),
      stores: storeRows.slice(0, 1000)
    },
    rowCounts: {
      profile: profile.length,
      detail: detail.length,
      stores: storeRows.length
    }
  };
}

function csvEscape(v) {
  const s = String(v ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

export async function getCsv(params = {}) {
  const lang = params.lang === 'ar' ? 'ar' : 'en';
  const source = await getSource();
  const tab = params.tab === 'detail' ? 'detail' : params.tab === 'stores' ? 'stores' : 'profile';
  const rows = rowsByFilters(source.rows, params);
  const profile = repProfileFromRows(rows);
  const detail = rows.slice().sort((a, b) => number(b['Client Count']) - number(a['Client Count']));
  const stores = storesByFilters(source.stores, params);
  const table = tab === 'detail' ? detail : tab === 'stores' ? stores : profile;
  const columns = tab === 'detail'
    ? ['Salesperson', 'Region', 'Sales Channel', 'Channel Group', 'Client Count']
    : tab === 'stores'
      ? ['Store Name', 'Client ID', 'Salesperson', 'Region', 'Sales Channel', 'Channel Group']
      : ['Salesperson', 'Client Count', 'Primary Region', 'Primary Channel', 'Primary Channel Group', 'Region Dominance %', 'Channel Dominance %'];

  const header = columns.map(c => csvEscape(colLabel(c, lang))).join(',');
  const body = table.map(row => columns.map(c => csvEscape(row[c])).join(',')).join('\n');
  return '\ufeff' + header + '\n' + body;
}
