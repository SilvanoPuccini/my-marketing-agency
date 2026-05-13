// Shared email layout — Carbon Violet design system
// Used by Edge Functions that send email via Resend.

const BRAND = {
  bg: '#0A0A0F',
  card: '#13131A',
  cardBorder: '#1F1F2A',
  text: '#F4F4F7',
  muted: '#B6B6C2',
  faint: '#7A7A88',
  violet: '#7C3AED',
  violetDark: '#6929D6',
  green: '#10B981',
  greenBg: 'rgba(16,185,129,0.14)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.14)',
  radius: '6px',
}

export function emailLayout(opts: {
  preheader?: string
  title: string
  body: string
  cta?: { label: string; url: string }
  footer?: string
}): string {
  const { preheader, title, body, cta, footer } = opts

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${title}</title>
<style>
  body, table, td { font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  a { color: ${BRAND.violet}; text-decoration: none; }
</style>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};color:${BRAND.text};-webkit-font-smoothing:antialiased;">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ''}

<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${BRAND.bg};">
<tr><td align="center" style="padding:40px 16px;">

  <!-- Logo -->
  <table width="480" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;width:100%;">
  <tr><td style="padding-bottom:32px;text-align:center;">
    <table cellpadding="0" cellspacing="0" role="presentation" style="display:inline-table;vertical-align:middle;">
    <tr><td width="36" height="36" align="center" bgcolor="${BRAND.violet}" style="border-radius:8px;font-weight:700;font-size:16px;color:#ffffff;">M</td></tr>
    </table>
    <span style="margin-left:10px;font-size:15px;font-weight:600;color:${BRAND.text};vertical-align:middle;letter-spacing:-0.02em;">My Marketing Agency</span>
  </td></tr>
  </table>

  <!-- Card -->
  <table width="480" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;width:100%;background:${BRAND.card};border:1px solid ${BRAND.cardBorder};border-radius:10px;">
  <tr><td style="padding:36px 32px;">

    <h1 style="margin:0 0 20px;font-size:20px;font-weight:600;color:${BRAND.text};letter-spacing:-0.02em;">${title}</h1>

    <div style="font-size:14px;line-height:1.7;color:${BRAND.muted};">
      ${body}
    </div>

    ${cta ? `
    <table cellpadding="0" cellspacing="0" role="presentation" style="margin-top:28px;">
    <tr><td style="border-radius:${BRAND.radius};background:${BRAND.violet};text-align:center;">
      <a href="${cta.url}" target="_blank" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.01em;">${cta.label}</a>
    </td></tr>
    </table>
    ` : ''}

  </td></tr>
  </table>

  <!-- Footer -->
  <table width="480" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;width:100%;">
  <tr><td style="padding:24px 0;text-align:center;font-size:12px;color:${BRAND.faint};line-height:1.6;">
    ${footer || 'My Marketing Agency — Gestion de contenido para agencias'}
    <br>
    <span style="color:${BRAND.faint};">Si no esperabas este email, podes ignorarlo.</span>
  </td></tr>
  </table>

</td></tr>
</table>
</body>
</html>`
}

export function statusBadge(status: 'approved' | 'rejected'): string {
  const isApproved = status === 'approved'
  const color = isApproved ? BRAND.green : BRAND.red
  const bg = isApproved ? BRAND.greenBg : BRAND.redBg
  const label = isApproved ? 'Aprobada' : 'Rechazada'
  return `<span style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;color:${color};background:${bg};letter-spacing:0.02em;">${label}</span>`
}

export function alertBox(text: string, variant: 'error' | 'info' = 'error'): string {
  const color = variant === 'error' ? BRAND.red : BRAND.muted
  const bg = variant === 'error' ? BRAND.redBg : 'rgba(255,255,255,0.04)'
  const border = variant === 'error' ? 'rgba(239,68,68,0.25)' : BRAND.cardBorder
  return `<div style="margin-top:16px;padding:14px 16px;border-radius:${BRAND.radius};background:${bg};border:1px solid ${border};font-size:13px;color:${color};line-height:1.6;">${text}</div>`
}
