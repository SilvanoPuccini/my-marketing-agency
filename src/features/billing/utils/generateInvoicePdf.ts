import type { Invoice } from '../hooks/useInvoices'

function formatAmount(cents: number): string {
  return '$' + (cents / 100).toLocaleString('es-AR', { minimumFractionDigits: 2 })
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export function generateInvoicePdf(invoice: Invoice, agencyName: string) {
  const statusLabel =
    invoice.status === 'paid' ? 'PAGADA' :
    invoice.status === 'overdue' ? 'VENCIDA' : 'PENDIENTE'

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Factura ${invoice.number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a2e; padding: 48px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 2px solid #7c3aed; }
    .brand { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
    .brand span { color: #7c3aed; }
    .invoice-info { text-align: right; }
    .invoice-number { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; }
    .invoice-date { font-size: 13px; color: #666; margin-top: 4px; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 600; letter-spacing: 0.05em; margin-top: 8px; }
    .status-paid { background: #dcfce7; color: #166534; }
    .status-overdue { background: #fef2f2; color: #991b1b; }
    .status-pending { background: #fef9c3; color: #854d0e; }
    .section { margin-bottom: 32px; }
    .section-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #888; margin-bottom: 12px; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; }
    .detail-label { color: #666; }
    .detail-value { font-weight: 500; font-variant-numeric: tabular-nums; }
    .totals { margin-top: 24px; border-top: 2px solid #1a1a2e; padding-top: 16px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .total-row.grand { font-size: 20px; font-weight: 700; margin-top: 8px; padding-top: 12px; border-top: 1px solid #ddd; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand"><span>My</span> Marketing Agency</div>
      <div style="font-size: 13px; color: #666; margin-top: 4px;">${agencyName}</div>
    </div>
    <div class="invoice-info">
      <div class="invoice-number">${invoice.number}</div>
      <div class="invoice-date">Emision: ${formatDate(invoice.emision_date)}</div>
      <div class="status status-${invoice.status}">${statusLabel}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Detalle de factura</div>
    <div class="detail-row">
      <span class="detail-label">Periodo</span>
      <span class="detail-value">${invoice.period}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Concepto</span>
      <span class="detail-value">${invoice.concept}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Fecha de emision</span>
      <span class="detail-value">${formatDate(invoice.emision_date)}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Importes</div>
    <div class="totals">
      <div class="total-row">
        <span>Subtotal</span>
        <span>${formatAmount(invoice.subtotal)}</span>
      </div>
      <div class="total-row">
        <span>IVA (21%)</span>
        <span>${formatAmount(invoice.iva)}</span>
      </div>
      <div class="total-row grand">
        <span>Total</span>
        <span>${formatAmount(invoice.total)}</span>
      </div>
    </div>
  </div>

  <div class="footer">
    ${agencyName} &middot; Factura generada el ${new Date().toLocaleDateString('es-AR')}
  </div>
</body>
</html>`

  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.onload = () => {
    printWindow.print()
  }
}
