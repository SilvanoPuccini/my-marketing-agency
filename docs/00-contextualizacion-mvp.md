# Etapa 0 — Contextualizacion, Cliente y Definicion del Producto

## 0.1 Analisis del Cliente / Organizacion

**Cliente prototipico:** Pixel Studio — Agencia de marketing digital boutique con sede en Cordoba Capital, Argentina. Operativa desde 2021.

| Atributo | Detalle |
|----------|---------|
| Tamano del equipo | 6 personas |
| Composicion | 1 Director, 2 Community Managers, 1 Disenador grafico, 1 Redactor publicitario, 1 Editor audiovisual |
| Clientes activos | 12 cuentas |
| Modelo de negocio | Fee mensual fijo por cuenta (entre ARS 250.000 y ARS 800.000) |
| Modalidad | Remoto/hibrido, equipo distribuido en Argentina |
| Rubros de clientes | Gastronomia (35%), retail (25%), profesionales independientes (20%), inmobiliarias (10%), otros (10%) |

**Servicios que ofrece Pixel Studio:**
- Gestion integral de redes sociales (Instagram, Facebook, TikTok)
- Produccion de contenido (fotos, videos, copies)
- Diseno de piezas graficas
- Campanas de paid media (Meta Ads, Google Ads basico)
- Estrategia de contenidos mensual
- Reportes mensuales de performance

## 0.2 Tipo de Aplicacion

**Uso Externo / Mixto** — dos interfaces diferenciadas que comparten la misma base de datos:

- **Panel Interno (Backoffice):** utilizado por el director y el equipo para gestionar cuentas, calendarios, piezas, horas y facturacion.
- **Portal del Cliente:** acceso limitado para clientes finales — ver piezas, aprobar, ver calendario, descargar materiales, consultar facturas.
- **Landing Publica:** punto de entrada comercial de la plataforma SaaS.

## 0.3 Infraestructura Actual del Cliente

| Proceso | Herramienta actual | Limitacion |
|---------|-------------------|------------|
| Calendario editorial | Google Sheets compartido | Sin estados, sin notificaciones |
| Aprobacion de piezas | WhatsApp + capturas | No queda registro auditable |
| Almacenamiento creativos | Google Drive | Estructura caotica, archivos duplicados |
| Registro de horas | Toggl (uso parcial) | Solo 40% de las horas reales |
| Facturacion | Excel + email + AFIP manual | Errores, demoras, sin recordatorios |
| Reuniones de status | Google Meet + Notion | Notas no vinculadas a entregables |
| Comunicacion con cliente | WhatsApp del director | Saturacion del director, no escala |

## 0.4 Diagnostico de la Problematica

**Puntos de dolor:**
1. Ciclo de aprobacion lento — promedio de 3 dias por pieza (deberia ser 24 hs)
2. Falta de visibilidad de rentabilidad por cuenta
3. Sobrecarga del director en comunicacion — 6 a 10 hs semanales
4. Piezas publicadas sin aprobacion formal — riesgo legal
5. Facturacion demorada

**Impacto cuantificado:**

| Punto de dolor | Impacto estimado mensual |
|----------------|--------------------------|
| Demora en aprobaciones | Perdida de ventana para 30% del contenido |
| Cuentas no rentables sin detectar | ARS 600.000 a 900.000/mes |
| Horas del director respondiendo consultas | 24 a 40 hs/mes |
| Facturacion tardia | 25% del facturable mensual bloqueado |

## 0.5 Definicion de Objetivos Globales

**My Marketing Agency** es una plataforma web que centraliza la operacion completa de una agencia de marketing digital, integrando gestion de clientes, calendario editorial, flujo de aprobacion de piezas, registro de horas, facturacion y comunicacion con el cliente mediante un portal dedicado.

**Vision de Negocio:**
- Reducir el ciclo de aprobacion de 3 dias a menos de 24 horas
- Conocer la rentabilidad real de cada cuenta
- Eliminar el caos de WhatsApp, Drive y planillas
- Profesionalizar la relacion con el cliente final
- Escalar de 12 a 25+ cuentas sin sumar personal administrativo
- Construir un activo de datos historico

## 0.6 Analisis de Priorizacion (MoSCoW)

### Must Have (Obligatorio — Core del MVP)
1. Sistema de autenticacion con tres roles (admin agencia, miembro equipo, cliente)
2. Gestion de cuentas-cliente (CRUD)
3. Calendario editorial mensual visual por cuenta-cliente
4. Creacion de piezas con tipo, fecha, copy y archivos adjuntos
5. Flujo de estados: borrador > revision interna > enviada al cliente > aprobada > publicada
6. Portal del cliente con vista de calendario y aprobacion pieza por pieza
7. Sistema de comentarios por pieza (agencia <-> cliente)
8. Dashboard ejecutivo con metricas basicas

### Should Have
9. Registro de horas trabajadas por miembro y cuenta
10. Generacion de facturas mensuales
11. Notificaciones en tiempo real (Realtime)
12. Reportes de performance por cuenta

### Could Have
13. Plantillas de piezas reutilizables
14. Exportacion del calendario a PDF
15. Integracion con Meta API para publicacion automatica
16. Sistema de aprobacion con observaciones inline

### Won't Have
17. Aplicacion mobile nativa
18. Facturacion electronica integrada con AFIP
19. Pagos online integrados
20. Sistema de gestion de paid media
21. Mensajeria en vivo tipo chat
22. Multi-idioma

## 0.7 MVP Confirmado

El MVP consiste en una aplicacion web responsive que permite a una agencia de marketing digital gestionar el ciclo completo de creacion, aprobacion y publicacion de piezas de contenido, con un portal dedicado para que los clientes aprueben o soliciten cambios en tiempo real.

**Alcance critico (Must Have):** Autenticacion con 3 roles - Gestion de cuentas-cliente - Calendario editorial visual - CRUD de piezas con archivos - Flujo de estados - Portal del cliente - Sistema de comentarios - Dashboard ejecutivo

**Limitaciones reconocidas:**
- No es mobile-first (responsive, pero disenada para desktop primario)
- No integra publicacion automatica a redes sociales
- No procesa pagos online
- Soporta una sola agencia por instancia (multi-tenancy queda para v2)
