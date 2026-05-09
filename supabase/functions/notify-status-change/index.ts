// Supabase Edge Function: notify-status-change
// Se llama desde un DB webhook cuando una pieza cambia de status.
// Envía email al equipo cuando el cliente aprueba o rechaza.
//
// Deploy: supabase functions deploy notify-status-change --no-verify-jwt
// Env vars: SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, SITE_URL
//
// DB Webhook config en Supabase Dashboard:
//   Table: pieces, Event: UPDATE, Filter: status changed
//   URL: https://<project>.supabase.co/functions/v1/notify-status-change

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const payload = await req.json()
    const { record, old_record } = payload

    // Solo notificar cambios de status relevantes
    if (!record || !old_record) return new Response('ok')
    if (record.status === old_record.status) return new Response('ok')

    const notifyStatuses = ['approved', 'rejected']
    if (!notifyStatuses.includes(record.status)) return new Response('ok')

    // Obtener datos de la pieza con cuenta y autor
    const { data: piece } = await supabase
      .from('pieces')
      .select('title, status, rejection_reason, accounts(name, agency_id), users!author_id(email, full_name)')
      .eq('id', record.id)
      .single()

    if (!piece) return new Response('ok')

    const account = piece.accounts as { name: string; agency_id: string } | null
    const author = piece.users as { email: string; full_name: string } | null
    if (!account || !author) return new Response('ok')

    const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:5173'
    const statusLabel = record.status === 'approved' ? 'aprobada' : 'rechazada (con cambios)'

    // Si no hay Resend key, logear y salir
    if (!RESEND_API_KEY) {
      console.log(`[notify] Pieza "${piece.title}" ${statusLabel} - email skipped (no RESEND_API_KEY)`)
      return new Response('ok')
    }

    // Enviar email al autor de la pieza
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'MMA <notificaciones@mymarketing.com.ar>',
        to: [author.email],
        subject: `Pieza ${statusLabel}: ${piece.title}`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1a1a2e;">Pieza ${statusLabel}</h2>
            <p><strong>${piece.title}</strong> de la cuenta <strong>${account.name}</strong> fue ${statusLabel} por el cliente.</p>
            ${record.status === 'rejected' && piece.rejection_reason
              ? `<p style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; color: #991b1b;"><strong>Motivo:</strong> ${piece.rejection_reason}</p>`
              : ''
            }
            <a href="${siteUrl}/dashboard" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #7c3aed; color: white; text-decoration: none; border-radius: 6px;">Ver en MMA</a>
          </div>
        `,
      }),
    })

    return new Response('ok')
  } catch (err) {
    console.error('notify-status-change error:', err)
    return new Response('ok')
  }
})
