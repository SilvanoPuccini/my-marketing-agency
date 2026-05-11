# My Marketing Agency

Plataforma SaaS para agencias de marketing digital. Gestiona cuentas-cliente, calendario editorial, flujo de aprobacion de piezas, portal del cliente y facturacion.

## Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Supabase (Auth, Database, Storage, Edge Functions)
- **Pagos:** Stripe Checkout
- **Deploy:** Vercel

## Planes

| Plan | Precio | Cuentas | Asientos | Clientes portal/cuenta | Piezas/mes/cliente | Storage/cuenta |
|------|--------|---------|----------|------------------------|--------------------|----------------|
| Solo | $36.000/mes | 1 | 2 | 2 | 60 | 1 GB |
| Estudio | $72.000/mes | 5 | 5 | 5 | 80 | 1.6 GB |
| Casa | $144.000/mes | 15 | 15 | 15 | 160 | 3 GB |

**Notas:**
- Asientos = admin + miembros del equipo. Los clientes portal NO consumen asiento.
- Storage es por cuenta-cliente, no compartido.
- Piezas/mes es por cliente portal individual, se renueva automaticamente.
- Archivos: imagenes max 10 MB, videos max 50 MB.

## Desarrollo

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run build
# Deploy automatico en Vercel al pushear a main
```

## Migraciones SQL

Los archivos de migracion estan en `supabase/migrations/` con formato `YYYYMMDD_descripcion.sql`. Ejecutar en orden en el SQL Editor de Supabase.
