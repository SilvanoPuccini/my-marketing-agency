// Supabase Edge Function: send-invite
// Invita a un miembro del equipo o cliente vía email.
// Crea el usuario en auth.users con inviteUserByEmail y el perfil en public.users.
//
// Deploy: supabase functions deploy send-invite --no-verify-jwt
// Env vars: SUPABASE_SERVICE_ROLE_KEY, SITE_URL

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, full_name, role, account_id } = await req.json()

    if (!email || !full_name || !role) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos: email, full_name, role' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Verificar que el usuario que invita está autenticado
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

    // Obtener agency_id del que invita
    const { data: inviterProfile } = await supabaseUser
      .from('users')
      .select('agency_id')
      .eq('id', inviter.id)
      .single()

    if (!inviterProfile?.agency_id) {
      return new Response(
        JSON.stringify({ error: 'No se encontró la agencia' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Service role para crear el usuario invitado
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:5173'

    // Invitar por email (Supabase envía el email automáticamente)
    const { data: invited, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        data: { full_name, role },
        redirectTo: `${siteUrl}/complete-invitation`,
      },
    )

    if (inviteError) {
      return new Response(
        JSON.stringify({ error: inviteError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Crear perfil en public.users
    // NOTA: inviteUserByEmail dispara el trigger handle_new_user que ya crea
    // una fila en public.users (con role='admin_agency' y una agency nueva).
    // Por eso usamos upsert en vez de insert puro — si el trigger ya creó
    // el perfil, lo actualizamos con el agency_id y role correctos.
    if (invited.user) {
      const { data: existingProfile } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('id', invited.user.id)
        .single()

      if (existingProfile) {
        // Trigger already created profile — update with correct agency and role
        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({
            agency_id: inviterProfile.agency_id,
            email,
            full_name,
            role,
            is_active: true,
          })
          .eq('id', invited.user.id)
        if (updateError) {
          return new Response(
            JSON.stringify({ error: `Error al actualizar perfil: ${updateError.message}` }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          )
        }
      } else {
        // Fallback: trigger didn't run, insert from scratch
        const { error: insertError } = await supabaseAdmin.from('users').insert({
          id: invited.user.id,
          agency_id: inviterProfile.agency_id,
          email,
          full_name,
          role,
          is_active: true,
        })
        if (insertError) {
          return new Response(
            JSON.stringify({ error: `Error al crear perfil: ${insertError.message}` }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          )
        }
      }

      // Si es cliente y tiene account_id, vincularlo
      if (role === 'client' && account_id) {
        await supabaseAdmin.from('account_clients').insert({
          account_id,
          user_id: invited.user.id,
        })
      }

      // Si es team_member y tiene account_id, agregarlo como member
      if (role === 'team_member' && account_id) {
        await supabaseAdmin.from('account_members').insert({
          account_id,
          user_id: invited.user.id,
        })
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
