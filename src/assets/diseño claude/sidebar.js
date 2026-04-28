// Shared sidebar renderer for the agency-side pages.
// Call renderSidebar('panel'|'accounts'|'calendar'|'library'|'reports'|'team'|'billing'|'settings'|'profile')
function renderSidebar(active) {
  const items = [
    { id: 'panel',     href: 'dashboard.html',   label: 'Panel',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="5" height="5"/><rect x="9" y="2" width="5" height="5"/><rect x="2" y="9" width="5" height="5"/><rect x="9" y="9" width="5" height="5"/></svg>' },
    { id: 'accounts',  href: 'accounts.html',    label: 'Cuentas', count: '18',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="6" r="3"/><path d="M2 14c0-3 3-5 6-5s6 2 6 5"/></svg>' },
    { id: 'calendar',  href: 'calendar.html',    label: 'Calendario', count: '142',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="12" height="11"/><path d="M2 6h12M5 1v3M11 1v3"/></svg>' },
    { id: 'library',   href: 'library.html',     label: 'Biblioteca',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="12" height="10"/><path d="M2 7h12"/></svg>' },
    { id: 'reports',   href: 'reports.html',     label: 'Reportes',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 13V3M2 13h12M5 10V7M8 10V5M11 10V8"/></svg>' },
  ];
  const studio = [
    { id: 'team',      href: 'team.html',        label: 'Equipo', count: '12',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="5" cy="6" r="2.5"/><circle cx="11" cy="6" r="2.5"/><path d="M1 14c0-2.2 1.8-4 4-4s4 1.8 4 4M9 14c0-2.2 1.8-4 4-4s2 0.8 2 2"/></svg>' },
    { id: 'billing',   href: 'billing.html',     label: 'Facturación',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="12" height="9"/><path d="M2 7h12"/></svg>' },
    { id: 'settings',  href: 'settings.html',    label: 'Ajustes',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="2"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3"/></svg>' },
  ];
  function row(it) {
    return `<a href="${it.href}" class="nav-item ${active===it.id?'active':''}">${it.icon||''}${it.label}${it.count?`<span class="count">${it.count}</span>`:''}</a>`;
  }
  const html = `
    <div class="brand">
      <div class="brand-mark">M</div>
      <div>
        <div class="brand-name">Estudio Pampas</div>
        <div class="brand-sub">PLAN ESTUDIO · 18 / 25</div>
      </div>
    </div>
    <div class="nav-section">Operación</div>
    ${items.map(row).join('')}
    <div class="nav-section">Estudio</div>
    ${studio.map(row).join('')}
    <div style="flex:1"></div>
    <a href="profile.html" class="${active==='profile'?'nav-item active':''}" style="padding: 12px 8px; border-top: 1px solid var(--line-1); display: flex; align-items: center; gap: 10px; color: inherit; text-decoration: none; ${active==='profile'?'':'border-radius:0;'}">
      <div class="avatar avatar-violet">LF</div>
      <div style="font-size: 12px; line-height: 1.3;">
        <div style="font-weight: 500;">Lucía Fernández</div>
        <div class="faint mono" style="font-size: 10px;">DIRECTORA</div>
      </div>
      <div style="flex:1"></div>
      <span class="faint" style="font-size: 14px;">›</span>
    </a>`;
  document.getElementById('sidebar').innerHTML = html;
}
