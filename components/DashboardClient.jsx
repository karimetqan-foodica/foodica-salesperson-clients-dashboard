'use client';

import { useEffect, useMemo, useState } from 'react';

const I18N = {
  ar: {
    otherLang: 'English',
    themeDarkBtn: '☀️ الوضع الفاتح',
    themeLightBtn: '🌙 الوضع الداكن',
    eyebrow: 'Executive Sales Analytics',
    subtitle: 'تحليل تفاعلي لعدد العملاء لكل مندوب، المناطق، قنوات البيع، ونِسب التوزيع.',
    reset: 'إعادة ضبط الفلاتر',
    fullscreen: 'ملء الشاشة',
    export: 'تصدير CSV',
    print: 'طباعة / PDF',
    repSearch: 'بحث باسم المندوب',
    region: 'منطقة البيع',
    channel: 'قناة البيع الفرعية',
    group: 'قنوات البيع',
    minClients: 'حد أدنى للعملاء',
    excludeArchive: 'استبعاد Archive_Rep',
    all: 'الكل',
    clients: 'عميل',
    noData: 'لا توجد بيانات بعد الفلاتر الحالية.',
    protected: 'تم تعطيل هذا الإجراء لحماية الداشبورد',
    loading: 'جاري تحميل الداشبورد...',
    filtersTitle: 'فلاتر التحليل',
    filtersHint: 'غيّر الفلاتر وشاهد النتائج فورًا بدون إعادة تحميل الصفحة.',
    activeFilters: 'الفلاتر النشطة',
    noActiveFilters: 'لا توجد فلاتر إضافية مفعّلة',
    clear: 'مسح',
    tableRows: 'عدد الصفوف',
    selectedView: 'العرض الحالي',
    archiveExcluded: 'Archive_Rep مستبعد',
    kpi: {
      filteredClients: 'العملاء بعد الفلاتر',
      byFilters: 'حسب الفلاتر الحالية',
      salespersons: 'عدد المناديب',
      repsAfter: 'مندوب ظاهر',
      regions: 'المناطق',
      visibleRegions: ' منطقة بيع ظاهرة',
      channels: 'قنوات البيع',
      visibleChannels: 'قناة بيع ظاهرة',
      missingChannel: ' قناة بيع غير محددة ',
      topRep: 'أعلى مندوب'
    },
    topSalespersons: 'أعلى المناديب حسب عدد العملاء',
    groupMix: 'توزيع مجموعات القنوات',
    regionDistribution: 'توزيع العملاء حسب المنطقة',
    channelDistribution: 'توزيع العملاء حسب قناة البيع',
    heatmap: 'الخريطة الحرارية للتوزيع :  منطقة البيع  &  قناة البيع',
    heatmapNote: 'أعلى 8 مناطق & أعلى 8 قنوات',
    profileTab: 'جدول المندوبين',
    detailTab: 'تفصيل المندوب & المنطقة & القناة',
    tableNote: 'اضغط على رأس العمود للترتيب',
    footnote: 'ملاحظة: تم احتساب العملاء من السجلات ذات Client ID فعلي. الصفوف الخاصة بالـTags أو السجلات غير المكتملة لا يتم التعامل معها كعملاء مستقلين. استبعاد Archive_Rep مفعّل افتراضيًا للحصول على قراءة أوضح للمناديب النشطين.',
    cols: {
      Salesperson: 'المندوب',
      'Client Count': 'عدد العملاء',
      Region: 'المنطقة',
      'Sales Channel': 'قناة البيع',
      'Channel Group': 'مجموعة القناة',
      'Primary Region': 'المنطقة الأساسية',
      'Primary Channel': 'القناة الأساسية',
      'Primary Channel Group': 'مجموعة القناة الأساسية',
      'Region Dominance %': 'سيطرة المنطقة %',
      'Channel Dominance %': 'سيطرة القناة %'
    },
    values: {
      'غير محدد': 'غير محدد',
      'Region غير واضح': 'منطقة بيع غير واضحة',
      Retail: 'ريتيل',
      Horeca: 'هوريكا',
      'Modern Trade': 'مودرن تريد',
      'Gas Station': 'محطات بنزين',
      'E-Commerce': 'تجارة إلكترونية',
      Wholesale: 'جملة',
      'Sub-D': 'Sub-D'
    }
  },
  en: {
    otherLang: 'العربية',
    themeDarkBtn: '☀️ Light Mode',
    themeLightBtn: '🌙 Dark Mode',
    eyebrow: 'Executive Sales Analytics',
    subtitle: 'Interactive analysis for clients per sales person, regions, sales channels, and distribution mix.',
    reset: 'Reset Filters',
    fullscreen: 'Fullscreen',
    export: 'Export CSV',
    print: 'Print / PDF',
    repSearch: 'Search salesperson',
    region: 'Region',
    channel: 'Sales Channel',
    group: 'Channel Group',
    minClients: 'Minimum clients',
    excludeArchive: 'Exclude Archive_Rep',
    all: 'All',
    clients: 'clients',
    noData: 'No data under the current filters.',
    protected: 'This action is disabled to protect the dashboard',
    loading: 'Loading dashboard...',
    filtersTitle: 'Analysis Filters',
    filtersHint: 'Change filters and see the results instantly without reloading the page.',
    activeFilters: 'Active filters',
    noActiveFilters: 'No additional filters active',
    clear: 'Clear',
    tableRows: 'Table rows',
    selectedView: 'Current view',
    archiveExcluded: 'Archive_Rep excluded',
    kpi: {
      filteredClients: 'Filtered Clients',
      byFilters: 'Current filters',
      salespersons: 'Salespersons',
      repsAfter: 'Visible reps',
      regions: 'Regions',
      visibleRegions: 'Visible regions',
      channels: 'Sales Channels',
      visibleChannels: 'Visible channels',
      missingChannel: 'Missing Channel',
      topRep: 'Top Rep'
    },
    topSalespersons: 'Top Salespersons by Client Count',
    groupMix: 'Channel Group Mix',
    regionDistribution: 'Client Distribution by Region',
    channelDistribution: 'Client Distribution by Sales Channel',
    heatmap: 'Heatmap: Region × Channel Group',
    heatmapNote: 'Top 8 regions × top 8 groups',
    profileTab: 'Salesperson Profile Table',
    detailTab: 'Rep × Region × Channel Detail',
    tableNote: 'Click any column header to sort',
    footnote: 'Note: clients were counted from records with an actual Client ID. Tag-extension rows or incomplete records are not counted as independent clients. Archive_Rep is excluded by default for a cleaner view of active sales people.',
    cols: {
      Salesperson: 'Salesperson',
      'Client Count': 'Client Count',
      Region: 'Region',
      'Sales Channel': 'Sales Channel',
      'Channel Group': 'Channel Group',
      'Primary Region': 'Primary Region',
      'Primary Channel': 'Primary Channel',
      'Primary Channel Group': 'Primary Channel Group',
      'Region Dominance %': 'Region Dominance %',
      'Channel Dominance %': 'Channel Dominance %'
    },
    values: {
      'غير محدد': 'Unspecified',
      'Region غير واضح': 'Unclear Region'
    }
  }
};

function fmt(value, lang) {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US').format(Number(value || 0));
}

function pct(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function valueLabel(value, lang) {
  return I18N[lang].values[String(value)] || String(value ?? '');
}

function colLabel(col, lang) {
  return I18N[lang].cols[col] || col;
}

function BarList({ items, lang, emptyText }) {
  if (!items?.length) return <div className="loader">{emptyText}</div>;
  const max = Math.max(1, ...items.map(x => Number(x.value || 0)));
  return (
    <div className="bar-list">
      {items.map((item, index) => (
        <div className="bar-row" key={`${item.name}-${index}`}>
          <div className="name" title={item.name}>{valueLabel(item.name, lang)}</div>
          <div className="track"><div className="fill" style={{ width: `${Math.max(2, (Number(item.value || 0) / max) * 100)}%` }} /></div>
          <div className="num">{fmt(item.value, lang)}</div>
        </div>
      ))}
    </div>
  );
}

const DEFAULT_LANG = 'ar';
const DEFAULT_THEME = 'light';
const DEFAULT_PREFS_VERSION = 'v4-ar-light';

export default function DashboardClient() {
  const [lang, setLang] = useState(DEFAULT_LANG);
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [payload, setPayload] = useState(null);
  const [tab, setTab] = useState('profile');
  const [sort, setSort] = useState({ col: 'Client Count', dir: 'desc' });
  const [filters, setFilters] = useState({
    rep: '',
    region: '',
    channel: '',
    group: '',
    minClients: '0',
    excludeArchive: true
  });
  const [toast, setToast] = useState(false);

  const t = I18N[lang];

  useEffect(() => {
    const prefsVersion = localStorage.getItem('foodicaDefaultPreferencesVersion');
    const savedLang = localStorage.getItem('foodicaWebAppLang');
    const savedTheme = localStorage.getItem('foodicaWebAppTheme');

    // First load after this update should open in Arabic + Light Mode,
    // even for browsers that previously saved Dark Mode from older versions.
    if (prefsVersion !== DEFAULT_PREFS_VERSION) {
      setLang(DEFAULT_LANG);
      setTheme(DEFAULT_THEME);
      localStorage.setItem('foodicaWebAppLang', DEFAULT_LANG);
      localStorage.setItem('foodicaWebAppTheme', DEFAULT_THEME);
      localStorage.setItem('foodicaDefaultPreferencesVersion', DEFAULT_PREFS_VERSION);
      return;
    }

    // After the default has been applied once, respect the user's manual choice.
    if (savedLang === 'ar' || savedLang === 'en') setLang(savedLang);
    if (savedTheme === 'dark' || savedTheme === 'light') setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.add('no-copy');
    localStorage.setItem('foodicaWebAppLang', lang);
    localStorage.setItem('foodicaWebAppTheme', theme);
  }, [lang, theme]);

  useEffect(() => {
    const showProtected = () => {
      setToast(true);
      setTimeout(() => setToast(false), 1300);
    };
    const ctx = e => { e.preventDefault(); showProtected(); };
    const key = e => {
      const k = e.key.toLowerCase();
      if (
        e.key === 'F12' ||
        (e.ctrlKey && ['s', 'u', 'p'].includes(k)) ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) ||
        (e.metaKey && ['s', 'u', 'p'].includes(k))
      ) {
        e.preventDefault();
        showProtected();
      }
    };
    document.addEventListener('contextmenu', ctx);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('contextmenu', ctx);
      document.removeEventListener('keydown', key);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      rep: filters.rep,
      region: filters.region,
      channel: filters.channel,
      group: filters.group,
      minClients: filters.minClients || '0',
      excludeArchive: filters.excludeArchive ? 'true' : 'false',
      lang
    });
    fetch(`/api/dashboard?${params.toString()}`, { signal: controller.signal, cache: 'no-store' })
      .then(r => r.json())
      .then(setPayload)
      .catch(err => {
        if (err.name !== 'AbortError') console.error(err);
      });
    return () => controller.abort();
  }, [filters, lang]);

  const tableRows = useMemo(() => {
    const rows = payload?.tables?.[tab] || [];
    const col = sort.col;
    const dir = sort.dir === 'asc' ? 1 : -1;
    return rows.slice().sort((a, b) => {
      const av = a[col];
      const bv = b[col];
      const na = Number(av);
      const nb = Number(bv);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return (na - nb) * dir;
      return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
    });
  }, [payload, tab, sort]);

  function setFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters({ rep: '', region: '', channel: '', group: '', minClients: '0', excludeArchive: true });
  }

  function toggleSort(col) {
    setSort(prev => prev.col === col ? { col, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'desc' });
  }

  function exportCsv() {
    const params = new URLSearchParams({
      tab,
      lang,
      rep: filters.rep,
      region: filters.region,
      channel: filters.channel,
      group: filters.group,
      minClients: filters.minClients || '0',
      excludeArchive: filters.excludeArchive ? 'true' : 'false'
    });
    window.location.href = `/api/export?${params.toString()}`;
  }

  function fullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  const kpis = payload ? [
    { icon: '👥', label: t.kpi.filteredClients, value: payload.metrics.totalClients, note: t.kpi.byFilters },
    { icon: '🧑‍💼', label: t.kpi.salespersons, value: payload.metrics.repCount, note: t.kpi.repsAfter },
    { icon: '🗺️', label: t.kpi.regions, value: payload.metrics.regionCount, note: t.kpi.visibleRegions },
    { icon: '🛒', label: t.kpi.channels, value: payload.metrics.channelCount, note: t.kpi.visibleChannels },
    { icon: '⚠️', label: t.kpi.missingChannel, value: payload.metrics.missingChannel, note: pct(payload.metrics.missingChannelPct) },
    { icon: '🏆', label: t.kpi.topRep, value: payload.metrics.topRep?.Salesperson || '-', note: payload.metrics.topRep ? `${fmt(payload.metrics.topRep['Client Count'], lang)} ${t.clients}` : '-' }
  ] : [];

  const activeFilters = [
    filters.rep ? { key: 'rep', label: t.repSearch, value: filters.rep, clear: () => setFilter('rep', '') } : null,
    filters.region ? { key: 'region', label: t.region, value: valueLabel(filters.region, lang), clear: () => setFilter('region', '') } : null,
    filters.channel ? { key: 'channel', label: t.channel, value: valueLabel(filters.channel, lang), clear: () => setFilter('channel', '') } : null,
    filters.group ? { key: 'group', label: t.group, value: valueLabel(filters.group, lang), clear: () => setFilter('group', '') } : null,
    Number(filters.minClients || 0) > 0 ? { key: 'minClients', label: t.minClients, value: fmt(filters.minClients, lang), clear: () => setFilter('minClients', '0') } : null,
    filters.excludeArchive ? { key: 'excludeArchive', label: t.archiveExcluded, value: 'ON', clear: () => setFilter('excludeArchive', false) } : null
  ].filter(Boolean);

  const columns = tab === 'profile'
    ? ['Salesperson', 'Client Count', 'Primary Region', 'Primary Channel', 'Primary Channel Group', 'Region Dominance %', 'Channel Dominance %']
    : ['Salesperson', 'Region', 'Sales Channel', 'Channel Group', 'Client Count'];

  return (
    <main className="app">
      <section className="hero">
        <div className="hero-inner">
          <div className="topbar">
            <div>
              <div className="eyebrow">{t.eyebrow}</div>
              <h1>Foodica Sales Person Analytics Dashboard</h1>
              <div className="subtitle">{t.subtitle}</div>
              <div className="hero-meta">
                <span>{t.liveApi}</span>
                <span>{t.protectedDash}</span>
                <span>{t.csvReady}</span>
              </div>
            </div>
            <div className="brand-stack">
              <div className="logo-card">
                <img src="/foodica_logo_trimmed.png" alt="Foodica Logo" className="logo" />
              </div>
              <div className="controls" style={{ marginTop: 10 }}>
                <button className="pill" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>🌐 {t.otherLang}</button>
                <button className="pill" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? t.themeDarkBtn : t.themeLightBtn}</button>
              </div>
            </div>
          </div>
          <div className="actions">
            <button className="primary" onClick={resetFilters}>{t.reset}</button>
            <button onClick={fullscreen}>{t.fullscreen}</button>
            <button onClick={exportCsv}>{t.export}</button>
            <button onClick={() => window.print()}>{t.print}</button>
          </div>
        </div>
      </section>

      {!payload ? (
        <div className="loader">{t.loading}</div>
      ) : (
        <>
          <section className="grid kpis">
            {kpis.map(({ icon, label, value, note }) => (
              <div className="kpi" key={label}>
                <div className="kpi-head"><span className="kpi-icon">{icon}</span><span className="kpi-label">{label}</span></div>
                <div className="kpi-value">{typeof value === 'number' ? fmt(value, lang) : value}</div>
                <div className="kpi-note">{note}</div>
              </div>
            ))}
          </section>

          <section className="filter-card">
            <div className="section-head">
              <div>
                <h2>{t.filtersTitle}</h2>
                <p>{t.filtersHint}</p>
              </div>
              <button className="ghost" onClick={resetFilters}>{t.reset}</button>
            </div>
            <div className="filters">
            <div className="field">
              <label>{t.repSearch}</label>
              <div className="input-wrap">
                <input value={filters.rep} onChange={e => setFilter('rep', e.target.value)} placeholder={t.repSearch} />
                {filters.rep ? <button className="input-clear" onClick={() => setFilter('rep', '')} aria-label={t.clear}>×</button> : null}
              </div>
            </div>
            <div className="field">
              <label>{t.region}</label>
              <select value={filters.region} onChange={e => setFilter('region', e.target.value)}>
                <option value="">{t.all}</option>
                {payload.options.regions.map(x => <option key={x} value={x}>{valueLabel(x, lang)}</option>)}
              </select>
            </div>
            <div className="field">
              <label>{t.channel}</label>
              <select value={filters.channel} onChange={e => setFilter('channel', e.target.value)}>
                <option value="">{t.all}</option>
                {payload.options.channels.map(x => <option key={x} value={x}>{valueLabel(x, lang)}</option>)}
              </select>
            </div>
            <div className="field">
              <label>{t.group}</label>
              <select value={filters.group} onChange={e => setFilter('group', e.target.value)}>
                <option value="">{t.all}</option>
                {payload.options.groups.map(x => <option key={x} value={x}>{valueLabel(x, lang)}</option>)}
              </select>
            </div>
            <div className="field">
              <label>{t.minClients}</label>
              <input type="number" min="0" value={filters.minClients} onChange={e => setFilter('minClients', e.target.value)} />
            </div>
            <label className="switch">
              <input type="checkbox" checked={filters.excludeArchive} onChange={e => setFilter('excludeArchive', e.target.checked)} />
              <span>{t.excludeArchive}</span>
            </label>
            </div>
            <div className="active-filter-row">
              <span className="active-title">{t.activeFilters}</span>
              {activeFilters.length ? activeFilters.map(item => (
                <button className="filter-chip" key={item.key} onClick={item.clear} title={t.clear}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <b>×</b>
                </button>
              )) : <span className="empty-filters">{t.noActiveFilters}</span>}
            </div>
          </section>

          <section className="grid dashboard-grid">
            <div className="panel">
              <h2><span>{t.topSalespersons}</span><span className="small">Top 15</span></h2>
              <BarList items={payload.charts.topReps} lang={lang} emptyText={t.noData} />
            </div>
            <div className="panel">
              <h2><span>{t.groupMix}</span><span className="small">{fmt(payload.metrics.totalClients, lang)} {t.clients}</span></h2>
              <BarList items={payload.charts.groups} lang={lang} emptyText={t.noData} />
            </div>
          </section>

          <section className="grid chart-duo" style={{ marginTop: 16 }}>
            <div className="panel">
              <h2>{t.regionDistribution}</h2>
              <BarList items={payload.charts.regions} lang={lang} emptyText={t.noData} />
            </div>
            <div className="panel">
              <h2>{t.channelDistribution}</h2>
              <BarList items={payload.charts.channels} lang={lang} emptyText={t.noData} />
            </div>
          </section>

          <section className="panel" style={{ marginTop: 16 }}>
            <h2><span>{t.heatmap}</span><span className="small">{t.heatmapNote}</span></h2>
            <div className="heatmap">
              <table className="heat-table">
                <thead>
                  <tr>
                    <th>Region</th>
                    {payload.charts.heatmap.groups.map(g => <th key={g}>{valueLabel(g, lang)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {payload.charts.heatmap.matrix.map(row => (
                    <tr key={row.region}>
                      <th>{valueLabel(row.region, lang)}</th>
                      {row.cells.map(cell => (
                        <td key={cell.group}>
                          <div className="heat-cell" style={{ opacity: Math.max(.18, cell.intensity) }}>
                            {fmt(cell.value, lang)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel" style={{ marginTop: 16 }}>
            <div className="table-toolbar">
              <div className="tabs">
                <button className={`tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>{t.profileTab}</button>
                <button className={`tab ${tab === 'detail' ? 'active' : ''}`} onClick={() => setTab('detail')}>{t.detailTab}</button>
              </div>
              <div className="table-meta">
                <span>{t.selectedView}: <strong>{tab === 'profile' ? t.profileTab : t.detailTab}</strong></span>
                <span>{t.tableRows}: <strong>{fmt(tableRows.length, lang)}</strong></span>
                <span>{t.tableNote}</span>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {columns.map(col => (
                      <th key={col} onClick={() => toggleSort(col)}>
                        {colLabel(col, lang)} {sort.col === col ? (sort.dir === 'asc' ? '▲' : '▼') : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.length ? tableRows.map((row, index) => (
                    <tr key={index}>
                      {columns.map(col => (
                        <td key={col} className={typeof row[col] === 'number' ? 'numcell' : ''}>
                          {typeof row[col] === 'number' ? fmt(row[col], lang) : valueLabel(row[col], lang)}
                        </td>
                      ))}
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={columns.length} className="empty-table">{t.noData}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="footnote">{t.footnote}</div>
        </>
      )}

      <footer className="footer">
        <div className="brand-line">@Foodica 2026</div>
        <div className="by-line">by Kareem Shehata</div>
      </footer>

      <div className={`toast ${toast ? 'show' : ''}`}>{t.protected}</div>
    </main>
  );
}