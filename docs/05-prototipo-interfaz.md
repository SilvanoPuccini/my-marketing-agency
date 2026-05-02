# Etapa 5 — Prototipado de Interfaz

## 5.1 Design System

### Identidad Visual

- **Nombre:** My Marketing Agency
- **Concepto:** SaaS profesional, minimal, moderno. Inspiracion en Linear, Vercel y Notion.
- **Tono:** Limpio, confiable, eficiente. Pensado para uso intensivo desktop.
- **Tema:** Dark (Carbon Violet) — decision tomada en la etapa de diseno para mayor calidad visual y coherencia con las herramientas de referencia.

### Paleta de Colores

**Superficies (escala carbon):**

| Token | Hex | Uso |
|-------|-----|-----|
| `--bg-0` | `#0A0A0F` | Fondo de la app |
| `--bg-1` | `#0F0F15` | Sidebar / nav |
| `--bg-2` | `#13131A` | Card / panel |
| `--bg-3` | `#1A1A22` | Hover / panel anidado |
| `--bg-4` | `#22222C` | Input / chip |

**Texto:**

| Token | Hex | Uso |
|-------|-----|-----|
| `--fg-1` | `#F4F4F7` | Texto principal |
| `--fg-2` | `#B6B6C2` | Texto secundario |
| `--fg-3` | `#7A7A88` | Labels / terciario |
| `--fg-4` | `#4A4A55` | Deshabilitado |

**Brand:**

| Token | Hex | Uso |
|-------|-----|-----|
| `--violet-500` | `#7C3AED` | Botones primarios, acento |
| `--violet-400` | `#9560F4` | Hover, texto sobre oscuro |
| `--violet-600` | `#6929D6` | Active / pressed |

**Colores de estado:**

| Token | Hex | Uso |
|-------|-----|-----|
| `--status-draft` | `#7A7A88` | Estado borrador |
| `--status-sent` | `#3B82F6` | Estado enviada al cliente |
| `--status-approved` | `#10B981` | Estado aprobada |
| `--status-rejected` | `#EF4444` | Estado rechazada |
| `--status-published` | `#7C3AED` | Estado publicada |

### Tipografia

| Uso | Fuente |
|-----|--------|
| Texto general | Geist Variable |
| Mono | JetBrains Mono (IDs, valores tecnicos, badges de estado) |

### Iconografia

Lucide Icons (incluido en Shadcn/UI). Estilo: linea fina, 1.5px stroke. Tamano base 16px.

| Funcion | Icono |
|---------|-------|
| Calendario | `Calendar` |
| Cuentas | `Building2` |
| Piezas | `FileImage` |
| Comentarios | `MessageSquare` |
| Aprobado | `CheckCircle2` |
| Rechazado | `XCircle` |
| Pendiente | `Clock` |
| Usuarios | `Users` |
| Dashboard | `LayoutDashboard` |

### Componentes Base

| Componente | Variantes |
|------------|-----------|
| Button | primary, secondary, outline, ghost, destructive |
| Input | text, email, password, number |
| Textarea | normal |
| Select | simple |
| Card | elevated, outlined |
| Badge / Pill | draft, sent, approved, rejected, published |
| Modal/Dialog | small, medium, large |
| Avatar | sm, md, lg con stack |

### Componentes de Dominio

| Componente | Funcion |
|------------|---------|
| `PieceCard` | Tarjeta visual de una pieza en el calendario |
| `StatusBadge` | Badge con color segun estado de pieza |
| `CalendarDay` | Celda del calendario mensual |
| `AccountCard` | Tarjeta de cuenta-cliente en listado |
| `CommentItem` | Comentario con avatar, autor, rol y timestamp |
| `MetricCard` | Tarjeta del dashboard con numero grande + icono |
| `Sidebar` | Navegacion lateral del backoffice |
| `TopBar` | Barra superior con buscador y avatar |

## 5.2 Templates de Estructura

**Template 1 — Landing publica:** Header - Hero - Features (3 columnas) - How it works - Social proof - CTA - Footer

**Template 2 — Auth:** Logo centrado - Card con formulario (email, password, boton, links)

**Template 3 — Backoffice de la agencia:** Sidebar + TopBar + Contenido de la pagina

**Template 4 — Portal del cliente:** TopBar simple - Saludo - Grid de piezas - Calendario

## 5.3 User Flow Principal

### Flujo del Miembro del Equipo

```
[Login] -> [Dashboard] -> [Selecciona Cuenta-Cliente] -> [Calendario Editorial]
-> [Click dia] -> [Modal "Crear Pieza"] -> [Completa formulario]
-> [Adjunta archivos] -> [Guarda como Borrador]
-> [Click "Enviar al cliente"] -> [Pieza en SENT_CLIENT]
-> [Notificacion: Cliente aprobo] -> [Marcar como publicada] -> [PUBLISHED]
```

### Flujo del Cliente Final

```
[Login portal] -> [Home: "X piezas pendientes"] -> [Click en pieza]
-> [Modal Detalle: preview + copy + comentarios]
  -> [Aprobar] -> [Estado APPROVED] -> [Notificacion a equipo]
  -> [Rechazar] -> [Modal: motivo obligatorio] -> [Estado REJECTED] -> [Vuelve a DRAFT]
```

## 5.4 Pantallas Implementadas

| # | Pantalla | Archivo | Proposito |
|---|----------|---------|-----------|
| 1 | Landing Publica | `pages/public/Landing.tsx` | Punto de entrada comercial |
| 2 | Login | `pages/public/Login.tsx` | Autenticacion |
| 3 | Dashboard del Admin | `pages/dashboard/Dashboard.tsx` | Vista general del estado de la agencia |
| 4 | Listado de Cuentas-Cliente | `pages/dashboard/Accounts.tsx` | Gestion del portfolio |
| 5 | Calendario Editorial | `pages/dashboard/Calendar.tsx` | Pantalla central del producto |
| 6 | Modal de Detalle de Pieza | `features/pieces/PieceDetailModal.tsx` | Vista completa con todas las interacciones |
| 7 | Biblioteca de Contenido | `pages/dashboard/Library.tsx` | Archivo de piezas publicadas |
| 8 | Reportes | `pages/dashboard/Reports.tsx` | Metricas y performance |
| 9 | Equipo | `pages/dashboard/Team.tsx` | Gestion de miembros |
| 10 | Facturacion | `pages/dashboard/Billing.tsx` | Facturas y plan |
| 11 | Configuracion | `pages/dashboard/Settings.tsx` | Ajustes de la agencia |
| 12 | Perfil | `pages/dashboard/Profile.tsx` | Datos del usuario |
| 13 | Portal del Cliente (Home) | `pages/client-portal/ClientPortal.tsx` | Centro de aprobaciones del cliente |
| 14 | Aprobacion de Pieza | `pages/client-portal/ClientApproval.tsx` | Accion critica del cliente |

## 5.5 Herramientas de Diseno

- **Prototipo HTML:** Carpeta `src/assets/diseno claude/` — 14 pantallas en HTML + CSS con los tokens del design system
- **Tokens:** `src/assets/diseno claude/tokens.css` — sistema de tokens compartido entre prototipo y codigo
- **Codigo:** Los tokens se replican en `src/index.css` con Tailwind CSS v3 + Shadcn/UI
