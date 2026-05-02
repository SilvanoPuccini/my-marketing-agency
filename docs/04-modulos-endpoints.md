# Etapa 4 — Modulos y Operaciones de Supabase

## 4.1 Aclaracion Arquitectonica

A diferencia de un backend con Express o Django, Supabase expone una API auto-generada sobre PostgreSQL. La seguridad se implementa mediante:

| Mecanismo | Funcion |
|-----------|---------|
| Supabase Client SDK | Operaciones CRUD desde el frontend |
| Row Level Security (RLS) | Politicas de seguridad a nivel de fila |
| Database Functions | Logica de negocio compleja en SQL |
| Realtime Channels | Suscripciones a cambios via WebSocket |
| Storage Policies | Control de acceso a archivos |

## 4.2 Listado de Modulos

| # | Modulo | Tablas afectadas | Responsabilidad |
|---|--------|-----------------|-----------------|
| 1 | Autenticacion | auth.users, users | Registro, login, sesion, roles |
| 2 | Cuentas-Cliente | accounts, account_members, account_clients | CRUD y asignaciones |
| 3 | Piezas | pieces, piece_files | CRUD y ciclo de vida |
| 4 | Aprobaciones | pieces | Cambios de estado por el cliente |
| 5 | Comentarios | comments | Comentarios + Realtime |
| 6 | Storage | bucket pieces-files | Archivos adjuntos |
| 7 | Dashboard | multiples (lectura) | Metricas agregadas |

## 4.3 Modulo 1 — Autenticacion

### Operaciones

**1.1 — Registro de usuario**
```typescript
supabase.auth.signUp({
  email: string,
  password: string,
  options: {
    data: {
      full_name: string,
      role: 'admin_agency' | 'team_member' | 'client',
      agency_id: string
    }
  }
})
```

**1.2 — Inicio de sesion**
```typescript
supabase.auth.signInWithPassword({ email: string, password: string })
```

**1.3 — Cierre de sesion**
```typescript
supabase.auth.signOut()
```

**1.4 — Obtener sesion actual**
```typescript
supabase.auth.getSession()
```

**1.5 — Obtener perfil extendido**
```typescript
supabase.from('users').select('*').eq('id', userId).single()
```

### Politicas RLS

```sql
-- Usuario solo puede ver su propio perfil
CREATE POLICY "users_select_own"
ON users FOR SELECT USING (auth.uid() = id);

-- Admin puede ver todos los usuarios de su agencia
CREATE POLICY "users_select_agency"
ON users FOR SELECT USING (
  agency_id IN (
    SELECT agency_id FROM users WHERE id = auth.uid() AND role = 'admin_agency'
  )
);

-- Solo admins pueden crear usuarios
CREATE POLICY "users_insert_admin"
ON users FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin_agency')
);
```

## 4.4 Modulo 2 — Cuentas-Cliente

### Operaciones

**2.1 — Listar cuentas**
```typescript
supabase.from('accounts')
  .select('*, account_members(user_id), account_clients(user_id)')
  .eq('is_active', true)
  .order('created_at', { ascending: false })
```

**2.2 — Crear cuenta**
```typescript
supabase.from('accounts').insert({ name, industry, contact_name, contact_email, contact_phone, plan })
```

**2.3 — Editar cuenta**
```typescript
supabase.from('accounts').update({ ... }).eq('id', accountId)
```

**2.4 — Eliminar cuenta (soft delete)**
```typescript
supabase.from('accounts').update({ is_active: false }).eq('id', accountId)
```

**2.5 — Asignar miembro a cuenta**
```typescript
supabase.from('account_members').insert({ account_id, user_id })
```

**2.6 — Vincular cliente a cuenta**
```typescript
supabase.from('account_clients').insert({ account_id, user_id })
```

### Politicas RLS

```sql
-- Admin ve todas las cuentas de su agencia
CREATE POLICY "accounts_select_admin"
ON accounts FOR SELECT USING (
  agency_id IN (SELECT agency_id FROM users WHERE id = auth.uid() AND role = 'admin_agency')
);

-- Miembro del equipo solo ve cuentas asignadas
CREATE POLICY "accounts_select_member"
ON accounts FOR SELECT USING (
  id IN (SELECT account_id FROM account_members WHERE user_id = auth.uid())
);

-- Cliente solo ve su cuenta
CREATE POLICY "accounts_select_client"
ON accounts FOR SELECT USING (
  id IN (SELECT account_id FROM account_clients WHERE user_id = auth.uid())
);
```

## 4.5 Modulo 3 — Piezas

### Operaciones

**3.1 — Listar piezas por cuenta y rango de fechas**
```typescript
supabase.from('pieces')
  .select('*, piece_files(*), users:author_id(full_name)')
  .eq('account_id', accountId)
  .gte('scheduled_date', startDate)
  .lte('scheduled_date', endDate)
  .order('scheduled_date', { ascending: true })
```

**3.2 — Crear pieza**
```typescript
supabase.from('pieces').insert({
  account_id, title, type, copy, scheduled_date
  // status se inicializa como 'draft' por defecto
})
```

**3.3 — Editar pieza**
```typescript
supabase.from('pieces').update({ ... }).eq('id', pieceId)
// Solo permitido si status === 'draft'
```

**3.4 — Cambiar estado a "enviada al cliente"**
```typescript
supabase.from('pieces')
  .update({ status: 'sent_client', updated_at: new Date() })
  .eq('id', pieceId)
```

**3.5 — Subir archivo adjunto**
```typescript
// Paso 1: subir archivo a Storage
const { data: fileData } = await supabase.storage
  .from('pieces-files')
  .upload(`${accountId}/${pieceId}/${fileName}`, file)

// Paso 2: registrar metadata
await supabase.from('piece_files').insert({
  piece_id: pieceId,
  file_url: fileData.path,
  file_name: file.name,
  file_type: file.type,
  file_size_kb: Math.round(file.size / 1024)
})
```

**3.6 — Marcar como publicada**
```typescript
supabase.from('pieces').update({ status: 'published' }).eq('id', pieceId)
// Solo si status === 'approved'
```

## 4.6 Modulo 4 — Aprobaciones

**4.1 — Aprobar pieza**
```typescript
supabase.from('pieces').update({ status: 'approved' }).eq('id', pieceId)
```

**4.2 — Rechazar pieza con motivo**
```typescript
supabase.from('pieces')
  .update({ status: 'rejected', rejection_reason: reasonText })
  .eq('id', pieceId)
```

### Politicas RLS

```sql
CREATE POLICY "pieces_update_client"
ON pieces FOR UPDATE
USING (
  account_id IN (SELECT account_id FROM account_clients WHERE user_id = auth.uid())
  AND status = 'sent_client'
)
WITH CHECK (status IN ('approved', 'rejected'));
```

## 4.7 Modulo 5 — Comentarios

**5.1 — Listar comentarios**
```typescript
supabase.from('comments')
  .select('*, users:author_id(full_name, role, avatar_url)')
  .eq('piece_id', pieceId)
  .order('created_at', { ascending: true })
```

**5.2 — Agregar comentario**
```typescript
supabase.from('comments').insert({ piece_id: pieceId, author_id: currentUserId, content: text })
```

**5.3 — Suscripcion Realtime**
```typescript
supabase.channel(`piece-${pieceId}-comments`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'comments',
    filter: `piece_id=eq.${pieceId}`
  }, payload => {
    // actualizar UI con el nuevo comentario
  })
  .subscribe()
```

## 4.8 Modulo 6 — Storage

**Estructura del bucket `pieces-files`:**
```
pieces-files/
  {agency_id}/
    {account_id}/
      {piece_id}/
        {file_name}
```

```typescript
// Subir archivo
supabase.storage.from('pieces-files').upload(path, file)

// URL firmada (1 hora de expiracion)
supabase.storage.from('pieces-files').createSignedUrl(path, 3600)

// Eliminar archivo
supabase.storage.from('pieces-files').remove([path])
```

## 4.9 Modulo 7 — Dashboard

**7.1 — Conteo de piezas por estado**
```typescript
supabase.rpc('pieces_by_status_count', { p_agency_id: agencyId })
```

```sql
CREATE OR REPLACE FUNCTION pieces_by_status_count(p_agency_id uuid)
RETURNS TABLE(status text, total bigint) AS $$
  SELECT p.status, COUNT(*) as total
  FROM pieces p
  JOIN accounts a ON p.account_id = a.id
  WHERE a.agency_id = p_agency_id
  GROUP BY p.status
$$ LANGUAGE sql;
```

**7.2 — Piezas pendientes de aprobacion**
```typescript
supabase.from('pieces').select('*, accounts(name)', { count: 'exact' }).eq('status', 'sent_client')
```

**7.3 — Evolucion mensual**
```typescript
supabase.rpc('published_pieces_by_month', { p_agency_id: agencyId, p_months: 6 })
```

## 4.10 Resumen de la Etapa 4

| Modulo | Operaciones | Tablas | Politicas RLS |
|--------|-------------|--------|---------------|
| Autenticacion | 5 | users + auth.users | 3 |
| Cuentas-Cliente | 6 | accounts + N:M | 4 |
| Piezas | 6 | pieces + piece_files | 3 |
| Aprobaciones | 2 | pieces (update) | 1 |
| Comentarios | 3 | comments | 2 |
| Storage | 3 | bucket | 2 |
| Dashboard | 3 | multiples | — |

**Decision arquitectonica:**

> Optamos por Supabase porque genera automaticamente una API REST y GraphQL sobre PostgreSQL, con autenticacion JWT y politicas RLS integradas. Esto nos permitio enfocarnos en la logica de negocio y la experiencia de usuario en lugar de mantener un backend duplicado. La seguridad se garantiza a nivel base de datos mediante RLS, que es una arquitectura mas robusta y menos propensa a errores.
