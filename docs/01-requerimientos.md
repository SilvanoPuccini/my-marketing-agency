# Etapa 1 — Especificacion de Requerimientos

## 1.1 Convenciones
- `RF-XX`: Requerimiento Funcional
- `RNF-XX`: Requerimiento No Funcional
- Todos los RF son parte del MVP (Must Have del MoSCoW)

## 1.2 Requerimientos Funcionales (RF)

### Autenticacion y Usuarios

| ID | Requerimiento |
|----|---------------|
| RF-01 | El sistema debe permitir el registro de nuevos usuarios con email y contrasena. |
| RF-02 | El sistema debe permitir el inicio de sesion con email y contrasena. |
| RF-03 | El sistema debe permitir el cierre de sesion. |
| RF-04 | El sistema debe diferenciar tres roles: admin de agencia, miembro del equipo y cliente. |
| RF-05 | El sistema debe permitir al admin crear nuevos usuarios miembros del equipo. |

### Cuentas-Cliente

| ID | Requerimiento |
|----|---------------|
| RF-06 | El sistema debe permitir al admin crear, editar y eliminar cuentas-cliente. |
| RF-07 | El sistema debe permitir asignar miembros del equipo a una cuenta-cliente. |
| RF-08 | El sistema debe permitir vincular un usuario cliente a su cuenta correspondiente. |
| RF-09 | El sistema debe mostrar un listado de cuentas-cliente con busqueda por nombre. |

### Calendario y Piezas

| ID | Requerimiento |
|----|---------------|
| RF-10 | El sistema debe mostrar un calendario mensual con las piezas planificadas por cuenta-cliente. |
| RF-11 | El sistema debe permitir crear piezas con titulo, tipo, copy, fecha de publicacion y archivos adjuntos. |
| RF-12 | El sistema debe permitir editar y eliminar piezas en estado borrador. |
| RF-13 | El sistema debe gestionar los estados: borrador, enviada al cliente, aprobada, rechazada y publicada. |

### Aprobaciones del Cliente

| ID | Requerimiento |
|----|---------------|
| RF-14 | El sistema debe permitir al cliente ver las piezas pendientes de aprobacion en su portal. |
| RF-15 | El sistema debe permitir al cliente aprobar o rechazar una pieza. |
| RF-16 | Al rechazar una pieza, el cliente debe agregar un comentario obligatorio. |

### Comentarios

| ID | Requerimiento |
|----|---------------|
| RF-17 | El sistema debe permitir agregar comentarios sobre cada pieza, tanto desde la agencia como desde el cliente. |
| RF-18 | Los comentarios deben mostrarse en orden cronologico identificando autor y rol. |

### Dashboard

| ID | Requerimiento |
|----|---------------|
| RF-19 | El sistema debe mostrar un dashboard al admin con metricas basicas: piezas por estado, piezas pendientes de aprobacion y total de cuentas activas. |
| RF-20 | El sistema debe mostrar graficos visuales de evolucion mensual de piezas publicadas. |

## 1.3 Requerimientos No Funcionales (RNF)

### Rendimiento

| ID | Requerimiento |
|----|---------------|
| RNF-01 | El sistema debe responder a las consultas de listados en menos de 2 segundos. |
| RNF-02 | La carga inicial de la aplicacion debe ser inferior a 3 segundos en banda ancha. |

### Seguridad

| ID | Requerimiento |
|----|---------------|
| RNF-03 | Las contrasenas deben almacenarse encriptadas mediante bcrypt (provisto por Supabase Auth). |
| RNF-04 | El sistema debe implementar autenticacion basada en tokens JWT. |
| RNF-05 | El sistema debe implementar Row Level Security en la base de datos. |

### Usabilidad

| ID | Requerimiento |
|----|---------------|
| RNF-06 | La interfaz debe ser responsive y funcional en pantallas de 360px a 1920px. |
| RNF-07 | La aplicacion debe estar completamente en idioma espanol. |
| RNF-08 | Toda accion del usuario debe tener feedback visual mediante notificaciones (toasts). |

### Mantenibilidad

| ID | Requerimiento |
|----|---------------|
| RNF-09 | El codigo debe seguir las convenciones de TypeScript con tipado estricto. |
| RNF-10 | El proyecto debe organizarse por dominio (feature-based architecture). |

### Disponibilidad

| ID | Requerimiento |
|----|---------------|
| RNF-11 | La aplicacion debe estar disponible en produccion mediante despliegue continuo en Vercel. |
| RNF-12 | El sistema debe ser compatible con las ultimas versiones de Chrome, Firefox, Edge y Safari. |

## 1.4 Resumen

| Tipo | Cantidad |
|------|----------|
| Requerimientos Funcionales | 20 |
| Requerimientos No Funcionales | 12 |
| **Total** | **32** |

Distribucion de RF por modulo: Auth (5) - Cuentas (4) - Calendario y Piezas (4) - Aprobaciones (3) - Comentarios (2) - Dashboard (2)
