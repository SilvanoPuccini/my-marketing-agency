// Supabase Edge Function: send-invite
// Invita a un miembro del equipo o cliente vía email.
// Pasa agency_id en metadata para que handle_new_user cree el perfil correcto.
//
// Deploy: supabase functions deploy send-invite --no-verify-jwt
// Env vars: SUPABASE_SERVICE_ROLE_KEY, SITE_URL

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PLAN_LIMITS: Record<string, number> = {
  solo: 2,
  estudio: 5,
  casa: 15,
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, full_name, role, position, account_id } = await req.json()

    if (!email || !full_name || !role) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos: email, full_name, role' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const validRoles = ['admin_agency', 'manager', 'creator', 'team_member', 'client']
    if (!validRoles.includes(role)) {
      return new Response(
        JSON.stringify({ error: `Rol inválido: ${role}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Verify inviter is authenticated
    const authHeader = req.headers.get('Authorization')!
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )
    const { data: { user: inviter }, error: authError } = await supabaseUser.auth.getUser()
    if (authError || !inviter) {
      return new Response(
        JSON.stringify({ error: 'No autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Get inviter's agency_id, role, and validate permissions
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: inviterProfile } = await supabaseAdmin
      .from('users')
      .select('agency_id, role')
      .eq('id', inviter.id)
      .single()

    if (!inviterProfile?.agency_id) {
      return new Response(
        JSON.stringify({ error: 'No se encontró la agencia' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Only admin_agency can invite
    if (inviterProfile.role !== 'admin_agency') {
      return new Response(
        JSON.stringify({ error: 'Solo el administrador puede enviar invitaciones' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const agencyId = inviterProfile.agency_id

    // Validate account_id belongs to inviter's agency
    if (account_id) {
      const { data: account } = await supabaseAdmin
        .from('accounts')
        .select('id')
        .eq('id', account_id)
        .eq('agency_id', agencyId)
        .single()

      if (!account) {
        return new Response(
          JSON.stringify({ error: 'La cuenta no pertenece a tu agencia' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
    }

    // Pre-flight seat check (only for team roles, not clients)
    if (role !== 'client') {
      const { data: agency } = await supabaseAdmin
        .from('agencies')
        .select('plan')
        .eq('id', agencyId)
        .single()

      const limit = PLAN_LIMITS[agency?.plan ?? 'solo'] ?? 2

      const { count } = await supabaseAdmin
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('agency_id', agencyId)
        .in('role', ['admin_agency', 'manager', 'creator', 'team_member'])

      if ((count ?? 0) >= limit) {
        return new Response(
          JSON.stringify({ error: `Límite de equipo alcanzado (${count}/${limit}). Actualizá tu plan.` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
    }

    const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:5173'

    // Invite by email — pass agency_id in metadata so handle_new_user
    // creates the profile with the correct agency and role (no orphan agency)
    const { data: invited, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        data: { full_name, role, agency_id: agencyId },
        redirectTo: `${siteUrl}/complete-invitation`,
      },
    )

    if (inviteError) {
      return new Response(
        JSON.stringify({ error: inviteError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (invited.user) {
      // The trigger now creates the correct profile (with agency_id from metadata).
      // We only need to update position if provided, and link to account.

      if (position) {
        await supabaseAdmin
          .from('users')
          .update({ position })
          .eq('id', invited.user.id)
      }

      // Link to account if provided
      if (account_id) {
        if (role === 'client') {
          await supabaseAdmin.from('account_clients').upsert({
            account_id,
            user_id: invited.user.id,
          })
        } else {
          // All team roles: link via account_members
          await supabaseAdmin.from('account_members').upsert({
            account_id,
            user_id: invited.user.id,
          })
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, userId: invited.user?.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
