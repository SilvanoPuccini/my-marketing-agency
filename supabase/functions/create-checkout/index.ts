// Supabase Edge Function: create-checkout
// Crea una Stripe Checkout Session para el plan seleccionado.
//
// Deploy: supabase functions deploy create-checkout --no-verify-jwt
// Env vars requeridas: STRIPE_SECRET_KEY, STRIPE_PRICE_SOLO, STRIPE_PRICE_ESTUDIO, STRIPE_PRICE_CASA, SITE_URL

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-04-10' })

const PRICE_MAP: Record<string, Record<string, string>> = {
  solo: {
    monthly: Deno.env.get('STRIPE_PRICE_SOLO')!,
    yearly: Deno.env.get('STRIPE_PRICE_SOLO_YEARLY')!,
  },
  estudio: {
    monthly: Deno.env.get('STRIPE_PRICE_ESTUDIO')!,
    yearly: Deno.env.get('STRIPE_PRICE_ESTUDIO_YEARLY')!,
  },
  casa: {
    monthly: Deno.env.get('STRIPE_PRICE_CASA')!,
    semiannual: Deno.env.get('STRIPE_PRICE_CASA_SEMIANNUAL')!,
  },
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { plan, interval = 'monthly' } = await req.json()
    const planPrices = PRICE_MAP[plan]
    if (!planPrices) {
      return new Response(JSON.stringify({ error: 'Plan inválido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const priceId = planPrices[interval]
    if (!priceId) {
      return new Response(JSON.stringify({ error: 'Intervalo inválido para este plan' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Obtener usuario autenticado
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'No autenticado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Obtener agency_id
    const { data: profile } = await supabase
      .from('users')
      .select('agency_id')
      .eq('id', user.id)
      .single()

    // Prevenir doble pago
    if (profile?.agency_id) {
      const { data: agency } = await supabase
        .from('agencies')
        .select('stripe_subscription_id')
        .eq('id', profile.agency_id)
        .single()

      if (agency?.stripe_subscription_id) {
        return new Response(JSON.stringify({ error: 'Ya tenés una suscripción activa' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:5173'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/billing`,
      client_reference_id: profile?.agency_id,
      customer_email: user.email,
      metadata: {
        agency_id: profile?.agency_id ?? '',
        plan,
        interval,
      },
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
