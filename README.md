<div align="center">

# My Marketing Agency

**Plataforma SaaS de gestión integral para agencias de marketing digital**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

[**🌐 Demo en vivo**](https://my-marketing-agency.vercel.app/) · [**📦 Repositorio**](https://github.com/SilvanoPuccini/my-marketing-agency)

</div>

---

## 📚 Información Académica

| Dato | Detalle |
|---|---|
| **Materia** | Desarrollo Web III |
| **Materia complementaria** | Taller de Desarrollo de Aplicaciones |
| **Año** | 2026 |
| **Integrantes** | Puccini Silvano · Marchetti Santiago |
| **Modalidad** | Trabajo en equipo |
| **Tipo de entrega** | Proyecto final integrador |

### 🔗 Enlaces del proyecto

- **Repositorio:** https://github.com/SilvanoPuccini/my-marketing-agency
- **App en producción:** https://my-marketing-agency.vercel.app/

---

## 📖 Índice

1. [Descripción del Proyecto](#1-descripción-del-proyecto)
2. [Problemática y Solución](#2-problemática-y-solución)
3. [Perfiles de Usuario](#3-perfiles-de-usuario)
4. [Stack Tecnológico](#4-stack-tecnológico)
5. [Arquitectura del Proyecto](#5-arquitectura-del-proyecto)
6. [Unidad 1 — Prototipo de Interfaz](#6-unidad-1--prototipo-de-interfaz)
7. [Unidad 2 — Landing Page + Design System](#7-unidad-2--landing-page--design-system)
8. [Unidad 3 — React Router](#8-unidad-3--react-router)
9. [Unidad 4 — Supabase (Cloud Services)](#9-unidad-4--supabase-cloud-services)
10. [Unidad 5 — Estado Global y Manejo de Datos](#10-unidad-5--estado-global-y-manejo-de-datos)
11. [Unidad 6 — Estilización y Animaciones](#11-unidad-6--estilización-y-animaciones)
12. [Requerimientos Funcionales](#12-requerimientos-funcionales)
13. [Guía de Instalación](#13-guía-de-instalación)
14. [Scripts Disponibles](#14-scripts-disponibles)

---

## 1. Descripción del Proyecto

**My Marketing Agency (MMA)** es una aplicación web tipo SaaS que centraliza la operación completa de una agencia de marketing digital. Integra en un solo sistema la gestión de cuentas-cliente, el calendario editorial, el flujo de aprobación de piezas creativas, el registro de horas trabajadas, la facturación mensual y la comunicación con el cliente final a través de un portal dedicado.

La aplicación es de **uso mixto** con tres interfaces diferenciadas que comparten la misma base de datos pero exponen información distinta según el rol del usuario:

| Interfaz | Destinatario | Función |
|---|---|---|
| **Landing Pública** | Visitantes | Página comercial con propuesta de valor, pricing y casos de uso |
| **Panel Interno (Backoffice)** | Director y equipo de la agencia | Gestión de cuentas, calendario, piezas, equipo, facturación y métricas |
| **Portal del Cliente** | Clientes finales de la agencia | Visualización de piezas pendientes, aprobación/rechazo, histórico y reportes |

---

## 2. Problemática y Solución

Las agencias de marketing digital pequeñas (entre 5 y 50 cuentas) operan con herramientas dispersas que generan ineficiencia operativa medible:

| Proceso | Herramienta Actual | Limitación |
|---|---|---|
| Calendario editorial | Google Sheets compartido | Sin estados, sin notificaciones, sin trazabilidad |
| Aprobación de piezas | WhatsApp + capturas | Sin registro auditable, historial perdido |
| Almacenamiento de creativos | Google Drive | Estructura caótica, versiones duplicadas |
| Facturación | Excel + email manual | Errores de cálculo, demoras, sin recordatorios |
| Comunicación con cliente | WhatsApp del director | Saturación, no escala con el crecimiento |

### Impacto cuantificado del problema

- Ciclo de aprobación promedio: **3 días** (debería ser 24 hs)
- El director dedica **24–40 hs/mes** solo respondiendo consultas de clientes
- Facturación demorada **5–15 días**, bloqueando capital de trabajo
- Imposibilidad de medir la **rentabilidad real por cuenta**

### Cómo lo resuelve MMA

Centraliza estos cinco procesos en una única plataforma, con flujos de aprobación auditables, almacenamiento estructurado, notificaciones en tiempo real, métricas automáticas y un portal del cliente que reemplaza el WhatsApp del director.

---

## 3. Perfiles de Usuario

| Rol | Descripción | Acceso |
|---|---|---|
| **Admin de Agencia** | Director o socio | Acceso total: cuentas, equipo, métricas, facturación, configuración |
| **Miembro del Equipo** | CM, diseñador, redactor, account | Piezas, calendario, comentarios. Ve solo lo asignado |
| **Cliente Final** | Contacto del cliente de la agencia | Portal limitado: aprobar/rechazar piezas, ver calendario y reportes |

---

## 4. Stack Tecnológico

| Capa | Tecnología | Propósito |
|---|---|---|
| **Frontend Core** | React 19 + TypeScript | Biblioteca de UI con tipado estático |
| **Build** | Vite 8 | Bundler y dev server |
| **Navegación** | React Router DOM v7 | SPA routing con guards de autenticación |
| **UI Framework** | Tailwind CSS 3 + Shadcn/UI | Design system con componentes accesibles |
| **Animaciones** | Framer Motion v12 | Transiciones entre páginas y microinteracciones |
| **Estado Global** | Zustand v5 | Auth, UI state, filtros |
| **Datos Remotos** | TanStack Query v5 | Caché, sincronización, loading/error states |
| **Formularios** | React Hook Form + Zod v4 | Validación tipada de formularios |
| **Backend / DB** | Supabase (PostgreSQL) | Auth, base de datos, storage, realtime |
| **Pagos** | Stripe (Edge Functions) | Checkout y webhooks de suscripción |
| **Testing** | Vitest + Testing Library | Tests unitarios de componentes y hooks |
| **Deploy** | Vercel | Hosting con SSR y rewrites para SPA |

---

## 5. Arquitectura del Proyecto

El proyecto sigue una **arquitectura basada en dominios (feature-based)**, donde cada módulo de negocio encapsula su lógica, hooks y componentes:

```
src/
├── routes/                    # Navegación
│   ├── AppRouter.tsx          # Router principal con lazy loading
│   ├── ProtectedRoute.tsx     # Guard de autenticación por rol
│   └── routes.config.ts       # Constantes de rutas
│
├── pages/                     # Componentes de página
│   ├── public/                # Landing, Login, Registro, Legales
│   ├── dashboard/             # Backoffice: Dashboard, Cuentas, Calendario...
│   └── client-portal/         # Portal del cliente
│
├── features/                  # Lógica de negocio por dominio
│   ├── accounts/              # CRUD de cuentas-cliente
│   ├── pieces/                # Piezas, transiciones de estado, comentarios
│   ├── billing/               # Stripe, payment gate
│   ├── dashboard/             # Métricas, atención, actividad reciente
│   ├── settings/              # Configuración de agencia
│   ├── team/                  # Gestión de equipo
│   ├── hours/                 # Registro de horas
│   ├── reports/               # Reportes de performance
│   ├── calendar/              # Calendario editorial
│   ├── library/               # Biblioteca de archivos
│   ├── client-portal/         # Hooks específicos del portal
│   ├── comments/              # Sistema de comentarios
│   ├── agency/                # Datos de la agencia
│   ├── auth/                  # Flujos de autenticación
│   └── onboarding/            # Setup inicial
│
├── components/                # Componentes compartidos
│   ├── ui/                    # Design system (button, card, dialog...)
│   └── layout/                # AppLayout, ClientLayout, Sidebar, TopBar
│
├── stores/                    # Estado global (Zustand)
│   ├── auth.store.ts          # Usuario, sesión, login/logout
│   ├── ui.store.ts            # Sidebar, modales
│   └── filters.store.ts       # Filtros de búsqueda
│
├── hooks/                     # Hooks custom
│   └── useIsMobile.ts         # Detección responsive con matchMedia
│
├── lib/                       # Utilidades
│   ├── supabase.ts            # Cliente de Supabase
│   ├── roles.ts               # Labels y permisos por rol
│   ├── planLimits.ts          # Límites por plan
│   └── utils.ts               # Funciones auxiliares
│
├── types/                     # Definiciones TypeScript
└── test/                      # Configuración de tests
```

---

## 6. Unidad 1 — Prototipo de Interfaz

### Descripción técnica

**Propósito:** Centralizar la operación de una agencia de marketing digital en una plataforma web, eliminando la dispersión de herramientas (WhatsApp, Sheets, Drive, Excel).

**Alcance (MVP):** Gestión de cuentas-cliente, calendario editorial mensual, creación y edición de piezas con archivos adjuntos, flujo de aprobación con estados (borrador → enviada → aprobada/rechazada → publicada), portal del cliente con aprobaciones en tiempo real, sistema de comentarios por pieza y dashboard ejecutivo con métricas.

**Perfil de usuario:** Directores de agencias de 5–50 cuentas, equipos de 2–15 personas (CMs, diseñadores, redactores) y clientes finales que necesitan aprobar contenido.

### Prototipo implementado

El prototipo se materializó directamente en código funcional. Las vistas principales son:

| # | Vista | Descripción |
|---|---|---|
| 1 | Landing Pública | Propuesta de valor, pricing, casos de uso, changelog |
| 2 | Login / Registro | Autenticación con email + SSO (Google, próximamente) |
| 3 | Dashboard del Admin | Métricas en tiempo real: piezas por estado, pendientes, carga del equipo |
| 4 | Calendario Editorial | Vista mensual con chips de piezas por estado, filtrable por cuenta |
| 5 | Detalle de Pieza | Preview del creativo, copy, comentarios en tiempo real, acciones por rol |
| 6 | Portal del Cliente | Centro de aprobaciones con piezas pendientes, histórico y reportes |

**Herramienta utilizada:** Claude Design (Anthropic Labs) como punto de partida para los componentes iniciales, luego desarrollados manualmente en React + TypeScript + Tailwind.

---

## 7. Unidad 2 — Landing Page + Design System

### Landing Page

La landing (`src/pages/public/Landing.tsx`) incluye las siguientes secciones:

| Sección | Contenido |
|---|---|
| **NavBar** (sticky) | Logo, links, badge ES-AR, botones Ingresar / Crear cuenta, menú hamburguesa responsive |
| **Hero** | Badge de versión, titular con gradiente, subtítulo, CTAs duales, stats rápidos |
| **Product Mock** | Simulación visual del calendario dentro de un browser chrome |
| **Logos** | Grid de agencias como prueba social ("240+ agencias en AR") |
| **Features** (6 ítems) | Grid 3×2: Calendario, Aprobaciones, Equipo, Cuentas, Reportes, Integraciones |
| **Flow** | Timeline de 4 pasos + card interactiva simulando el flujo de aprobación |
| **Pricing** | Toggle mensual/anual, 3 planes (Solo, Estudio, Casa) con features y CTA |
| **Casos de uso** | 3 testimonios con métricas + stat tiles |
| **Changelog** | Releases recientes con badges por tipo (Nuevo, Mejora, Fix) |
| **Footer CTA** | Llamada a la acción final con gradiente |
| **Footer** | Copyright + links a Privacidad, Términos, Estado, Contacto |

**Interactividad implementada:**

- Hover states en botones, links y cards
- Toggle switch animado para pricing mensual/anual
- Smooth scroll a secciones internas
- Menú hamburguesa con toggle en mobile
- Focus states en inputs con border-color y box-shadow violeta

### Design System

**Framework:** Shadcn/UI + Tailwind CSS

**Variables CSS globales** (`src/index.css`) — 40+ custom properties organizadas por categoría:

| Categoría | Tokens | Ejemplo |
|---|---|---|
| Superficies | `--bg-0` a `--bg-4` | `#0A0A0F` → `#22222C` (escala carbon) |
| Líneas | `--line-1` a `--line-3` | rgba blanco 6%–16% |
| Texto | `--fg-1` a `--fg-4` | `#F4F4F7` → `#4A4A55` |
| Marca | `--violet-500/400/600`, `--violet-glow`, `--violet-soft` | Violeta como color principal |
| Estados | `--status-draft/sent/approved/rejected/published` | Colores semánticos por estado de pieza |
| Tipografía | `--font-sans` (Geist Variable), `--font-mono` (JetBrains Mono) | Sans-serif + monospace |
| Radii | `--r-1` (4px), `--r-2` (6px), `--r-3` (10px) | Escala de bordes redondeados |

### Catálogo de Componentes

Centralizados en `src/components/ui/`:

| Componente | Variantes | Uso principal |
|---|---|---|
| **Button** | default, destructive, outline, ghost, link + sm/default/lg/icon | Acciones primarias y secundarias |
| **Card** | Con header, content, footer | Tarjetas del dashboard, formularios |
| **Input** | Text, email, password | Formularios con estados focus/error |
| **Badge** | Por estado de pieza y rol | Indicadores visuales |
| **Dialog/Modal** | Small, medium, large | Creación de piezas, confirmaciones |
| **Avatar** | Con imagen o iniciales | Perfiles de usuario |
| **Tabs** | Navegación interna | Páginas complejas con secciones |
| **Skeleton** | Loading states | Datos asíncronos |
| **Separator** | Divisores visuales | Separación de secciones |
| **Dropdown Menu** | Menús contextuales | Tablas y headers |
| **EmptyState** | Vistas vacías con CTA | Sin datos disponibles |
| **ConfirmDialog** | Diálogos de confirmación | Logout, eliminar registros |

---

## 8. Unidad 3 — React Router

### Configuración del Router

Implementado con **React Router DOM v7** y `BrowserRouter`. El router central está en `src/routes/AppRouter.tsx` con code splitting vía `lazy()` en todas las rutas protegidas.

### Mapeo de Rutas

| Ruta | Tipo | Acceso | Descripción |
|---|---|---|---|
| `/` | Estática | Pública | Landing pública |
| `/login` | Estática | Pública | Inicio de sesión |
| `/registro` | Estática | Pública | Registro de usuario |
| `/auth/callback` | Estática | Pública | Callback OAuth |
| `/complete-invitation` | Estática | Pública | Aceptar invitación |
| `/recuperar-password` | Estática | Pública | Recuperar contraseña |
| `/reset-password` | Estática | Pública | Reset con token |
| `/privacidad` | Estática | Pública | Política de privacidad |
| `/terminos` | Estática | Pública | Términos de uso |
| `/estado` | Estática | Pública | Status page |
| `/contacto` | Estática | Pública | Formulario de contacto |
| `/onboarding` | Estática | `admin_agency` | Setup inicial |
| `/dashboard` | Estática | Staff | Panel ejecutivo |
| `/accounts` | Estática | Staff | Listado de cuentas |
| `/accounts/:id` | **Dinámica** | Staff | Detalle de cuenta |
| `/calendar` | Estática | Staff | Calendario editorial |
| `/library` | Estática | Staff | Biblioteca de archivos |
| `/reports` | Estática | Staff | Reportes |
| `/team` | Estática | Staff | Listado de equipo |
| `/team/:id` | **Dinámica** | Staff | Perfil de miembro |
| `/billing` | Estática | Staff | Facturación y plan |
| `/settings` | Estática | Staff | Configuración de agencia |
| `/profile` | Estática | Todos | Perfil de usuario |
| `/portal` | Estática | `client` | Home del cliente |
| `/portal/history` | Estática | `client` | Histórico |
| `/portal/reports` | Estática | `client` | Reportes del cliente |
| `/portal/pieces/:id` | **Dinámica** | `client` | Aprobación de pieza |
| `/portal/profile` | Estática | `client` | Perfil del cliente |
| `*` | Fallback | Todos | Página 404 |

**Total: 29 rutas** (15 públicas, 9 backoffice, 5 portal cliente, 1 fallback)

### Rutas Dinámicas con Parámetros

- `/accounts/:id` → Detalle de cuenta-cliente
- `/team/:id` → Perfil de miembro del equipo
- `/portal/pieces/:id` → Vista de aprobación de pieza

Los parámetros se acceden con `useParams()` de react-router-dom y se usan para fetchear datos específicos desde Supabase.

### Protección de Rutas

`ProtectedRoute.tsx` valida autenticación y rol antes de renderizar:

```tsx
<Route element={<ProtectedRoute allowedRoles={['admin_agency', 'team_member']} />}>
  }>
    } />
    {/* ... */}


```

---

## 9. Unidad 4 — Supabase (Cloud Services)

Supabase se utiliza como **backend-as-a-service**, proveyendo los tres servicios cloud esenciales: base de datos, autenticación y storage. Fue seleccionado por su simpleza de integración con el frontend y su modelo de seguridad a nivel de base de datos (RLS), que elimina la necesidad de mantener un backend intermedio.

### 9.1 Base de Datos (PostgreSQL)

Supabase expone una base de datos PostgreSQL con API auto-generada. El esquema incluye **8 tablas principales**:

| Tabla | Propósito |
|---|---|
| `agencies` | Datos de la agencia (nombre, plan, Stripe ID) |
| `users` | Perfiles extendidos de usuarios (rol, agency_id, posición) |
| `accounts` | Cuentas-cliente que la agencia gestiona |
| `account_members` | Asignación de miembros del equipo a cuentas (N:M) |
| `account_clients` | Vinculación de usuarios cliente a su cuenta (N:M) |
| `pieces` | Piezas de contenido con ciclo de vida (5 estados) |
| `piece_files` | Archivos adjuntos a cada pieza |
| `comments` | Comentarios sobre piezas con autor y timestamp |

**Migrations:** 30+ archivos SQL en `supabase/migrations/` que documentan la evolución del esquema, incluyendo políticas RLS, funciones de base de datos y triggers automáticos.

**Row Level Security (RLS):**
- Los clientes solo ven datos de su propia cuenta
- Los miembros del equipo ven datos de su agencia
- Los admins gestionan solo su propia agencia
- Las transiciones de estado de pieza están validadas a nivel de BD

### 9.2 Autenticación (Supabase Auth)

Método principal: **email + contraseña** (Google SSO próximamente).

| Característica | Implementación |
|---|---|
| Registro | `supabase.auth.signUp()` con metadata de rol y agency_id |
| Login | `supabase.auth.signInWithPassword()` con JWT de 1 hora + refresh token |
| Sesión persistente | `getSession()` al montar la app + `onAuthStateChange` para cambios en tiempo real |
| Roles | Se asignan en el trigger `handle_new_user()` que crea el perfil en `users` automáticamente |
| Invitaciones | Edge Function `send-invite` genera links con token |
| Recuperación | Flujo de reset password con email link de Supabase |

El store de Zustand (`auth.store.ts`) sincroniza el estado de autenticación con la UI, verificando sesión existente al iniciar y escuchando cambios.

### 9.3 Storage (Supabase Storage)

Bucket `pieces-files` para almacenar los archivos adjuntos de las piezas creativas (imágenes, videos, PDFs).

| Aspecto | Detalle |
|---|---|
| Bucket | `pieces-files` (privado, acceso controlado por RLS) |
| Política | Solo miembros de la agencia pueden subir y descargar archivos de sus cuentas |
| Integración | `supabase.storage.from().upload()` + registro de metadata en `piece_files` |
| Límites | Cuota por plan: 1 GB (Solo), 1.6 GB (Estudio), 3 GB (Casa) |

### 9.4 Servicios Adicionales

**Realtime (WebSocket):**

```tsx
supabase.channel(`piece-${id}-comments`)
  .on('postgres_changes', { event: 'INSERT', table: 'comments' }, handler)
  .subscribe()
```

Se suscribe a cambios en `comments` y `pieces` para actualizaciones en vivo del dashboard y el portal.

**Edge Functions (Deno):**

| Función | Propósito |
|---|---|
| `create-checkout` | Genera sesión de Stripe Checkout para suscripciones |
| `stripe-webhook` | Escucha eventos de Stripe y actualiza el plan de la agencia |
| `send-invite` | Envía emails de invitación al equipo |
| `notify-status-change` | Notifica al equipo cuando un cliente aprueba/rechaza |

**Database Functions:**

- `pieces_by_status_count()` → agrega piezas por estado para el dashboard
- `get_user_agency_id()` → helper para políticas RLS
- `auth_client_ac)` → retorna IDs de cuentas vinculadas al cliente

### 9.5 Decisiones Arquitectónicas

| Decisión | Justificación |
|---|---|
| Supabase en lugar de backend custom | Elimina backend intermedio. La seguridad se garantiza a nivel de BD con RLS, no en código |
| UUID como PK | IDs no adivinables, compatibilidad nativa con Supabase Auth |
| Tabla `users` separada de `auth.users` | Permite extender el modelo (rol, posición, avatar) sin tocar el auth interno |
| Soft delete (`is_active`) | Conserva historial y permite recuperación de registros eliminados |
| CHECK constraints en roles y estados | Integridad de datos a nivel de base de datos, no solo en aplicación |

---

## 10. Unidad 5 — Estado Global y Manejo de Datos

### Estado Global (Zustand)

Tres stores centralizan el estado transversal de la aplicación:

| Store | Responsabilidad |
|---|---|
| `useAuthStore` | Usuario autenticado, rol, sesión, funciones login/logout. Se inicializa con `initAuth()` que verifica sesión existente y escucha cambios de Supabase Auth |
| `useUiStore` | Sidebar abierto/cerrado, filtros globales, modales |
| `useFiltersStore` | Filtros de búsqueda y estado persistente de tablas |

**Ventaja:** Cualquier componente accede al estado sin prop drilling:

```tsx
const { user, isAuthenticated } = useAuthStore()
const { sidebarOpen, toggleSidebar } = useUiStore()
```

### Manejo de Datos Remotos (TanStack Query v5)

Todas las consultas a Supabase se gestionan con `useQuery` / `useMutation`:

- Caché automático con invalidación selectiva
- Revalidación en foco y reconexión
- Deduplicación de requests simultáneos
- Estados de loading/error integrados

### Ciclo de vida de una petición

1. Componente monta → `useQuery` dispara la consulta
2. `isLoading = true` → se muestra `<Skeleton />`
3. Supabase responde → data se cachea en QueryClient
4. Componente re-renderiza con datos
5. Si hay error → `isError = true`, se muestra `<EmptyState />` con retry
6. Mutaciones → `useMutation` con `invalidateQueries` para refrescar caché

### Ejemplo completo

```tsx
function AccountsPage() {
  const { data, isLoading, isError, refetch } = useAccounts()

  if (isLoading) return
  if (isError) return
  if (!data?.length) return

  return
}
```

### Datos en Tiempo Real

Supabase Realtime (WebSocket) para actualizaciones sin recargar:

- **Comentarios en piezas:** nuevos comentarios aparecen instantáneamente
- **Cambios de estado:** cuando un cliente aprueba, el dashboard se actualiza al instante

---

## 11. Unidad 6 — Estilización y Animaciones

### Estilización

**Estrategia:** Inline styles + CSS Custom Properties + Tailwind CSS

Los componentes usan estilos inline con variables CSS definidas en `:root`, lo que permite:

- **Control total:** cada componente define sus estilos sin dependencias externas
- **Temas consistentes:** un cambio en `:root` se refleja en toda la aplicación
- **Reutilización:** los style objects se comparten (ej: `btnPrimary`, `btnSecondary`)
- **Proximidad:** los estilos viven junto al código que afectan

```tsx

```

Adicionalmente, Tailwind CSS se usa para utilidades responsive y clases de componentes Shadcn (vía class-variance-authority).

### Animaciones (Framer Motion v12)

| Animación | Dónde se aplica |
|---|---|
| **PageTransition** | Transición entre rutas del backoffice (fade + slide). Usa `AnimatePresence mode="wait"` |
| **Mobile Sidebar** | Slide-in desde la izquierda con spring physics: `initial={{ x: -240 }} → animate={{ x: 0 }}` |
| **Backdrop** | Fade-in del overlay cuando se abre el sidebar en mobile |
| **Hover states** | Transiciones CSS de 100ms ease en botones, links y cards |
| **Pricing Toggle** | Cambio de posición del knob con `transition: left 0.2s` |
| **Loading spinner** | `@keyframes spin` con CSS puro en `ProtectedRoute` |

### Efectos Visuales

- **Gradientes:** Hero title con `background-clip: text`, footer CTA con radial-gradient overlay
- **Backdrop blur:** Navbar con `backdrop-filter: blur(12px)` para efecto glass
- **Glow effects:** Sombras con `--violet-glow` en elementos destacados
- **Skeleton pulse:** `@keyframes pulse` para estados de carga
- **Scroll suave:** Smooth scroll a secciones del landing

### Responsive Design

| Breakpoint | Adaptación |
|---|---|
| **≤ 1023px** (tablet) | Sidebar → overlay, grids 3→2→1, landing nav → hamburguesa, pricing 3→1 columna |
| **≤ 768px** (mobile) | Auth layout 2→1 columna, client nav reordena, piece detail → stack vertical |
| **≤ 640px** (phone) | Hero h1 64→28px, padding reducido, stat grid 1 columna, file viewer compacto |

Hook personalizado `useIsMobile(breakpoint)` que usa `matchMedia` para detectar el tamaño de pantalla y reaccionar en tiempo real.

---

## 12. Requerimientos Funcionales

Estado final de implementación: **20 / 20 RF completados** ✅

| ID | Requerimiento | Estado |
|---|---|---|
| RF-01 | Registro de usuarios | ✅ |
| RF-02 | Inicio de sesión | ✅ |
| RF-03 | Cierre de sesión | ✅ |
| RF-04 | Tres roles diferenciados | ✅ |
| RF-05 | Admin crea miembros del equipo | ✅ |
| RF-06 | CRUD de cuentas-cliente | ✅ |
| RF-07 | Asignar miembros a cuenta | ✅ |
| RF-08 | Vincular cliente a cuenta | ✅ |
| RF-09 | Listado de cuentas con búsqueda | ✅ |
| RF-10 | Calendario mensual visual | ✅ |
| RF-11 | Crear piezas con datos y archivos | ✅ |
| RF-12 | Editar/eliminar piezas en borrador | ✅ |
| RF-13 | Estados de pieza (5 estados) | ✅ |
| RF-14 | Portal cliente con pendientes | ✅ |
| RF-15 | Aprobar/rechazar pieza | ✅ |
| RF-16 | Rechazo con comentario obligatorio | ✅ |
| RF-17 | Comentarios por pieza | ✅ |
| RF-18 | Comentarios cronológicos con autor | ✅ |
| RF-19 | Dashboard con métricas | ✅ |
| RF-20 | Gráficos de evolución mensual | ✅ |

---

## 13. Guía de Instalación

### Requisitos previos

- **Node.js** 18 o superior
- **npm** 9 o superior
- Cuenta gratuita en [Supabase](https://supabase.com)

### Pasos

**1. Clonar el repositorio**

```bash
git clone https://github.com/SilvanoPuccini/my-marketing-agency.git
cd my-marketing-agency
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Configurar variables de entorno**

```bash
cp .env.example .env.local
```

Editar `.env.local` con las credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

Las credenciales se obtienen en **Supabase Dashboard → Settings → API**.

**4. Ejecutar en desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:5173

**5. Ejecutar tests**

```bash
npm run test:run
```

**6. Build de producción**

```bash
npm run build
```

---

## 14. Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo en http://localhost:5173 |
| `npm run build` | Genera el build de producción optimizado |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run test` | Ejecuta tests en modo watch |
| `npm run test:run` | Ejecuta tests una vez y termina |
| `npm run test:coverage` | Reporte de cobertura de tests |
| `npm run typecheck` | Validación de tipos TypeScript |
| `npm run lint` | Verifica calidad de código con ESLint |

---

<div align="center">

**My Marketing Agency** — Desarrollo Web III · 2026

Puccini Silvano · Marchetti Santiago

</div>
