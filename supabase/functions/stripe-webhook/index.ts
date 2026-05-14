// Supabase Edge Function: stripe-webhook
// Escucha eventos de Stripe y actualiza el plan de la agencia.
//
// Deploy: supabase functions deploy stripe-webhook --no-verify-jwt
// Env vars: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-04-10' })
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

// Service role para escribir sin RLS
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret)
  } catch (err) {
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const agencyId = session.metadata?.agency_id
    const plan = session.metadata?.plan
    const newSubscriptionId = session.subscription as string

    if (agencyId && plan) {
      // Leer la suscripción anterior ANTES de actualizar
      const { data: agency } = await supabase
        .from('agencies')
        .select('stripe_subscription_id')
        .eq('id', agencyId)
        .single()

      const oldSubscriptionId = agency?.stripe_subscription_id

      // Actualizar al nuevo plan y suscripción
      await supabase
        .from('agencies')
        .update({
          plan,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: newSubscriptionId,
        })
        .eq('id', agencyId)

      // Cancelar la suscripción anterior SOLO después de confirmar el nuevo pago
      if (oldSubscriptionId && oldSubscriptionId !== newSubscriptionId) {
        try {
          await stripe.subscriptions.cancel(oldSubscriptionId, { prorate: true })
        } catch (cancelErr) {
          console.warn('Could not cancel previous subscription:', (cancelErr as Error).message)
        }
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    // Downgrade: no borra datos, solo quita suscripción y baja el plan.
    // Los datos (cuentas, piezas, archivos) quedan intactos pero
    // el payment gate bloquea acceso al dashboard hasta que reactive.
    // Las cuentas/miembros que excedan el límite del nuevo plan quedan
    // en estado read-only (no se pueden crear nuevos hasta hacer upgrade).
    const { data: agencies } = await supabase
      .from('agencies')
      .select('id')
      .eq('stripe_subscription_id', subscription.id)
    if (agencies?.[0]) {
      await supabase
        .from('agencies')
        .update({ plan: 'solo', stripe_subscription_id: null })
        .eq('id', agencies[0].id)
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
