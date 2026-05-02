-- =============================================================
-- seed_dev.sql — Datos de prueba para desarrollo
-- My Marketing Agency
-- NO ejecutar en producción
-- =============================================================

-- Variables reutilizables
DO $$
DECLARE
  v_agency_id  UUID := '318f5679-a20f-4f46-aadb-e3fa6141b3fc';
  v_admin_id   UUID := '6762718f-3f51-4f68-912c-e9c317b42e79';

  -- Cuentas
  v_acc1 UUID := gen_random_uuid();
  v_acc2 UUID := gen_random_uuid();
  v_acc3 UUID := gen_random_uuid();

  -- Team members adicionales
  v_user2 UUID := gen_random_uuid();
  v_user3 UUID := gen_random_uuid();

  -- Piezas
  v_p1  UUID := gen_random_uuid();
  v_p2  UUID := gen_random_uuid();
  v_p3  UUID := gen_random_uuid();
  v_p4  UUID := gen_random_uuid();
  v_p5  UUID := gen_random_uuid();
  v_p6  UUID := gen_random_uuid();
  v_p7  UUID := gen_random_uuid();
  v_p8  UUID := gen_random_uuid();
  v_p9  UUID := gen_random_uuid();
  v_p10 UUID := gen_random_uuid();
  v_p11 UUID := gen_random_uuid();
  v_p12 UUID := gen_random_uuid();
  v_p13 UUID := gen_random_uuid();
  v_p14 UUID := gen_random_uuid();
  v_p15 UUID := gen_random_uuid();
  v_p16 UUID := gen_random_uuid();
  v_p17 UUID := gen_random_uuid();
  v_p18 UUID := gen_random_uuid();

BEGIN

  -- ─── Actualizar nombre de agencia ──────────────────────────
  UPDATE agencies SET name = 'Pixel Studio' WHERE id = v_agency_id;

  -- ─── Team members ──────────────────────────────────────────
  -- Nota: estos NO tienen auth.users, solo public.users
  -- Son para simular carga de equipo en el Dashboard
  INSERT INTO users (id, agency_id, email, full_name, position, role)
  VALUES
    (v_user2, v_agency_id, 'mateo@pixelstudio.com.ar', 'Mateo Rodríguez', 'Diseño', 'team_member'),
    (v_user3, v_agency_id, 'camila@pixelstudio.com.ar', 'Camila Sosa', 'Copy', 'team_member')
  ON CONFLICT (id) DO NOTHING;

  -- ─── Cuentas ───────────────────────────────────────────────
  INSERT INTO accounts (id, agency_id, name, handle, industry, contact_name, contact_email, plan, monthly_budget, is_active)
  VALUES
    (v_acc1, v_agency_id, 'Parrilla Don Tito', '@parrilladonttito', 'Gastronomía', 'Roberto Sánchez', 'roberto@donttito.com.ar', 'Premium', 480000, true),
    (v_acc2, v_agency_id, 'Talampaya Coworking', '@talampayaco', 'Servicios', 'Luciana Ferreyra', 'lu@talampaya.com.ar', 'Estándar', 180000, true),
    (v_acc3, v_agency_id, 'Empanadas del Norte', '@empanadasdelnorte', 'Gastronomía', 'Carlos Díaz', 'carlos@empanadasdelnorte.com.ar', 'Básico', 260000, true);

  -- ─── Asignar equipo a cuentas ──────────────────────────────
  INSERT INTO account_members (account_id, user_id)
  VALUES
    (v_acc1, v_admin_id),
    (v_acc1, v_user2),
    (v_acc2, v_admin_id),
    (v_acc2, v_user3),
    (v_acc3, v_user2),
    (v_acc3, v_user3)
  ON CONFLICT DO NOTHING;

  -- ─── Piezas — Parrilla Don Tito ────────────────────────────
  INSERT INTO pieces (id, account_id, author_id, title, type, platform, scheduled_date, scheduled_time, status, has_pauta, pauta_amount, updated_at)
  VALUES
    (v_p1,  v_acc1, v_admin_id, 'Reel — apertura de temporada', 'reel', 'Instagram', CURRENT_DATE + 2, '18:00', 'rejected', false, null, NOW() - INTERVAL '2 hours'),
    (v_p2,  v_acc1, v_user2,    'Post — promo almuerzo ejecutivo', 'post', 'Instagram', CURRENT_DATE + 3, '12:00', 'sent_client', false, null, NOW() - INTERVAL '4 hours'),
    (v_p3,  v_acc1, v_admin_id, 'Story — viernes 2x1 en cortes', 'story', 'Instagram', CURRENT_DATE + 5, '11:00', 'approved', true, 45000, NOW() - INTERVAL '1 day'),
    (v_p4,  v_acc1, v_user2,    'Carrusel — los 5 mejores cortes', 'carrusel', 'Instagram', CURRENT_DATE + 7, '10:00', 'draft', false, null, NOW() - INTERVAL '3 hours'),
    (v_p5,  v_acc1, v_admin_id, 'Reel — el asador habla', 'reel', 'Instagram', CURRENT_DATE - 5, '19:00', 'published', true, 60000, NOW() - INTERVAL '5 days'),
    (v_p6,  v_acc1, v_user2,    'Post — caso del mes: la vuelta del asado', 'post', 'Facebook', CURRENT_DATE - 10, '14:00', 'published', false, null, NOW() - INTERVAL '10 days');

  -- ─── Piezas — Talampaya Coworking ──────────────────────────
  INSERT INTO pieces (id, account_id, author_id, title, type, platform, scheduled_date, scheduled_time, status, has_pauta, pauta_amount, updated_at)
  VALUES
    (v_p7,  v_acc2, v_user3,    'Carrusel — 5 tips para emprender desde casa', 'carrusel', 'LinkedIn', CURRENT_DATE + 1, '09:00', 'sent_client', false, null, NOW() - INTERVAL '1 day'),
    (v_p8,  v_acc2, v_admin_id, 'Post — nuevo plan de membresía anual', 'post', 'LinkedIn', CURRENT_DATE + 4, '10:00', 'draft', false, null, NOW() - INTERVAL '6 hours'),
    (v_p9,  v_acc2, v_user3,    'Reel — tour por las salas privadas', 'reel', 'Instagram', CURRENT_DATE + 6, '17:00', 'approved', true, 35000, NOW() - INTERVAL '2 days'),
    (v_p10, v_acc2, v_admin_id, 'Story — evento networking jueves', 'story', 'Instagram', CURRENT_DATE + 2, '09:00', 'sent_client', false, null, NOW() - INTERVAL '5 hours'),
    (v_p11, v_acc2, v_user3,    'Post — caso de éxito: startup de agro', 'post', 'LinkedIn', CURRENT_DATE - 7, '11:00', 'published', false, null, NOW() - INTERVAL '7 days');

  -- ─── Piezas — Empanadas del Norte ──────────────────────────
  INSERT INTO pieces (id, account_id, author_id, title, type, platform, scheduled_date, scheduled_time, status, has_pauta, pauta_amount, updated_at)
  VALUES
    (v_p12, v_acc3, v_user2,    'Story — promo viernes 2x1', 'story', 'Instagram', CURRENT_DATE + 2, '12:00', 'rejected', false, null, NOW() - INTERVAL '30 minutes'),
    (v_p13, v_acc3, v_user3,    'Post — nueva sabor: empanada criolla dulce', 'post', 'Instagram', CURRENT_DATE + 4, '12:00', 'sent_client', true, 25000, NOW() - INTERVAL '3 hours'),
    (v_p14, v_acc3, v_user2,    'Reel — así se hace la masa', 'reel', 'TikTok', CURRENT_DATE + 8, '18:00', 'draft', false, null, NOW() - INTERVAL '1 hour'),
    (v_p15, v_acc3, v_user3,    'Carrusel — los 6 sabores clásicos', 'carrusel', 'Instagram', CURRENT_DATE - 3, '11:00', 'published', true, 30000, NOW() - INTERVAL '3 days'),
    (v_p16, v_acc3, v_user2,    'Post — abrimos en Belgrano', 'post', 'Instagram', CURRENT_DATE - 8, '10:00', 'published', false, null, NOW() - INTERVAL '8 days'),
    (v_p17, v_acc3, v_admin_id, 'Story — encuesta: ¿cuál es tu favorita?', 'story', 'Instagram', CURRENT_DATE + 3, '13:00', 'approved', false, null, NOW() - INTERVAL '2 days'),
    (v_p18, v_acc3, v_user3,    'Reel — delivery en 30 minutos', 'reel', 'TikTok', CURRENT_DATE + 10, '19:00', 'draft', true, 20000, NOW() - INTERVAL '4 hours');

  -- ─── Comentarios ───────────────────────────────────────────
  INSERT INTO comments (piece_id, author_id, content)
  VALUES
    (v_p1,  v_admin_id, 'El cliente pidió que sea más informal, estilo behind the scenes.'),
    (v_p1,  v_user2,    'Entendido, rehago la intro y subo nueva versión hoy.'),
    (v_p7,  v_user3,    'El cliente quiere agregar un tip sobre impuestos, ¿lo sumamos o lo dejamos para una segunda parte?'),
    (v_p12, v_admin_id, 'Cambiar el copy del CTA, el cliente dice que suena muy agresivo.'),
    (v_p9,  v_user3,    'Aprobado con cambios menores en el texto de cierre.');

END $$;
