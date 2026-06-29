# Talento Evolutivo S.A. — Sistema de Gestión de Haberes

Aplicación web para la gestión de empresas, empleados y la **liquidación de haberes**, desarrollada con Node.js y Express. Corresponde a la entrega final de la materia Desarrollo Web Backend, e integra una arquitectura MVC modular, persistencia en MongoDB, autenticación con roles y notificaciones en tiempo real.

## Tecnologías

- **Entorno y framework:** Node.js, Express 4
- **Base de datos:** MongoDB con ODM Mongoose
- **Motor de plantillas:** Pug (renderizado server-side)
- **Autenticación:** Passport.js (sesión) + JWT (API)
- **Tiempo real:** Socket.io
- **Seguridad:** contraseñas hasheadas con `crypto.scrypt`, protección CSRF, cookies endurecidas y sesiones persistidas en MongoDB

## Estructura del proyecto

```
src/
├── app.js                       # Aplicación principal (Express + Socket.io)
├── config/
│   ├── database.js              # Conexión a MongoDB
│   ├── passport.js              # Estrategias de autenticación y JWT
│   └── sessionStore.js          # Store de sesiones en MongoDB
├── controllers/
│   ├── auth.controller.js       # Registro, login, logout
│   ├── admin.controller.js      # Gestión de usuarios (panel admin)
│   ├── empresa.controller.js
│   ├── empleado.controller.js
│   └── liquidacion.controller.js
├── data/
│   ├── db.js                    # Datos de respaldo / seed (JSON)
│   ├── empresas.json
│   └── empleados.json
├── middlewares/
│   ├── auth.middleware.js       # Protección de rutas por sesión
│   ├── requireRole.js           # Autorización por rol
│   ├── validateToken.js         # Validación de JWT (API)
│   ├── csrf.middleware.js       # Protección CSRF
│   └── errorHandler.js          # Manejo centralizado de errores
├── models/
│   ├── Usuario.js               # Credenciales, rol y estado de aprobación
│   ├── Empresa.js
│   ├── Empleado.js              # Incluye estado activo y fecha de ingreso
│   ├── Liquidacion.js
│   ├── Notificacion.js
│   └── Session.js               # Modelo de sesión persistida
├── routes/
│   ├── auth.routes.js
│   ├── admin.routes.js
│   ├── empresa.routes.js
│   ├── empleado.routes.js       # Anidadas bajo empresa
│   ├── liquidacion.routes.js    # Anidadas bajo empresa
│   └── notificacion.routes.js
├── utils/
│   ├── liquidacion.js           # Cálculo de haberes (descuentos de ley, neto, aporte patronal)
│   ├── notificar.js             # Emisión de notificaciones (Socket.io)
│   ├── password.js              # Hash y verificación scrypt
│   └── validar.js               # Validaciones de entrada
└── views/
    ├── layout.pug
    ├── home.pug
    ├── 404.pug
    ├── auth/                    # login, register, pendiente
    ├── admin/                   # users
    ├── empresas/                # index, form, detail, liquidaciones
    ├── empleados/               # index, form, detail
    └── liquidaciones/           # nueva, empresa, empleado, recibo, historial, guardadas, reporte
```

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Talento-Evolutivo
npm install
```

### 2. Configurar variables de entorno

Creá un archivo **`.env`** en la raíz del proyecto (misma carpeta que `package.json`). El archivo `.env` **no se versiona** (está en `.gitignore`); usá `.env.example` como plantilla.

```env
# Cadena de conexión a MongoDB Atlas (reemplazá usuario, contraseña y cluster)
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/talento-evolutivo?retryWrites=true&w=majority

PORT=3000
NODE_ENV=development

# Secreto para firmar la cookie de sesión (largo, privado y aleatorio)
SESSION_SECRET=cambiar_por_un_valor_largo_y_aleatorio

# Usuario administrador por defecto (se crea al iniciar si no existe)
AUTH_USER=admin
AUTH_PASSWORD=admin

# JWT (autenticación de la API)
JWT_SECRET=cambiar_por_un_secreto_seguro
JWT_EXPIRES_IN=30m
```

> **Importante:** nunca subas el `.env` con credenciales reales al repositorio. La única variable obligatoria para arrancar en desarrollo es `MONGODB_URI`; el resto tiene valores por defecto. Si el log muestra `injected env (0)`, el `.env` no se está cargando (verificá que el nombre sea exactamente `.env`). Si la contraseña de Atlas tiene caracteres especiales (`@`, `#`, `/`, etc.), hay que URL-encodearlos.

### 3. Acceso por defecto

Al iniciar, la aplicación crea un usuario administrador con las credenciales de `AUTH_USER` / `AUTH_PASSWORD` (por defecto `admin` / `admin`).

## Uso

```bash
# Producción
npm start

# Desarrollo (recarga automática con nodemon)
npm run dev
```

El servidor inicia en `http://localhost:3000`. Si la conexión es correcta, el log muestra `✓ Conectado a MongoDB`.

## Rutas disponibles

### Autenticación

| Método | Ruta        | Descripción                          |
|--------|-------------|--------------------------------------|
| GET    | /login      | Formulario de inicio de sesión       |
| POST   | /login      | Autenticar usuario                   |
| GET    | /register   | Formulario de registro               |
| POST   | /register   | Crear usuario (queda pendiente)      |
| GET    | /pendiente  | Aviso de cuenta pendiente de aprobación |
| POST   | /logout     | Cerrar sesión                        |

### Empresas (requieren sesión)

| Método | Ruta                   | Descripción           |
|--------|------------------------|-----------------------|
| GET    | /empresas              | Listar empresas       |
| GET    | /empresas/nueva        | Formulario de alta    |
| POST   | /empresas              | Crear empresa         |
| GET    | /empresas/:id          | Ver detalle           |
| GET    | /empresas/:id/editar   | Formulario de edición |
| POST   | /empresas/:id/editar   | Actualizar empresa    |
| POST   | /empresas/:id/eliminar | Eliminar empresa (rol admin) |
| GET    | /empresas/liquidaciones | Empresas para liquidar |

### Empleados (anidadas bajo empresa)

| Método | Ruta                                        | Descripción           |
|--------|---------------------------------------------|-----------------------|
| GET    | /empresas/:empresaId/empleados              | Listar empleados      |
| GET    | /empresas/:empresaId/empleados/nuevo        | Formulario de alta    |
| POST   | /empresas/:empresaId/empleados              | Crear empleado        |
| GET    | /empresas/:empresaId/empleados/:id          | Ver detalle           |
| GET    | /empresas/:empresaId/empleados/:id/editar   | Formulario de edición |
| POST   | /empresas/:empresaId/empleados/:id/editar   | Actualizar empleado   |
| POST   | /empresas/:empresaId/empleados/:id/eliminar | Eliminar empleado (rol admin) |
| GET    | /empresas/:empresaId/empleados/:id/liquidaciones | Liquidaciones del empleado |

### Liquidaciones (anidadas bajo empresa)

| Método | Ruta                                            | Descripción                    |
|--------|-------------------------------------------------|--------------------------------|
| GET    | /empresas/:empresaId/liquidaciones              | Listar liquidaciones de la empresa |
| GET    | /empresas/:empresaId/liquidaciones/nueva        | Generar nueva liquidación      |
| GET    | /empresas/:empresaId/liquidaciones/guardadas    | Liquidaciones guardadas        |
| GET    | /empresas/:empresaId/liquidaciones/reporte      | Reporte por período            |
| GET    | /empresas/:empresaId/liquidaciones/:id          | Liquidaciones de un empleado   |
| GET    | /empresas/:empresaId/liquidaciones/:id/recibo   | Ver/descargar recibo           |
| POST   | /empresas/:empresaId/liquidaciones/:id          | Guardar liquidación            |

### Administración (panel de usuarios)

| Método | Ruta                       | Descripción                  |
|--------|----------------------------|------------------------------|
| GET    | /admin/users               | Listar usuarios              |
| POST   | /admin/users/nuevo         | Crear usuario                |
| POST   | /admin/users/:id/role      | Cambiar rol                  |
| POST   | /admin/users/:id/aprobar   | Aprobar usuario pendiente    |
| POST   | /admin/users/:id/eliminar  | Eliminar usuario             |

### Notificaciones

| Método | Ruta                       | Descripción                  |
|--------|----------------------------|------------------------------|
| POST   | /notificaciones/:id/leer   | Marcar notificación como leída |

## Características

- **Autenticación dual:** Passport.js con sesión para el navegador y JWT para la API.
- **Roles y autorización:** roles `admin`, `empleado` y `auditor`, con middleware que restringe el acceso según el rol.
- **Aprobación de usuarios:** los registros nuevos quedan pendientes hasta que un administrador los aprueba.
- **Salvaguardas del panel admin:** el sistema impide que el único administrador se quite su propio rol y que un usuario elimine su propia cuenta.
- **Contraseñas protegidas:** hash con `crypto.scrypt` y salt, verificación con `timingSafeEqual` y compatibilidad con contraseñas antiguas (migración).
- **Protección CSRF:** tokens en formularios y acciones por POST.
- **Sesiones endurecidas:** cookies `httpOnly`, `sameSite=lax`, `secure` en producción, persistidas en MongoDB y con expiración por inactividad.
- **Liquidación de haberes:** cálculo de bruto, descuentos de ley (jubilación 11 %, obra social 3 %, sindicato 3 %, ART 3 %), descuentos extra, neto y aporte patronal (20 %), con número de recibo.
- **Validaciones de negocio:** no se liquida un período anterior a la fecha de ingreso, ni más de 2 meses adelante, ni duplicados por empleado y período.
- **Reportes consolidados:** por mes, bimestre, trimestre, cuatrimestre o año, agrupados por empleado.
- **Notificaciones en tiempo real:** vía Socket.io; los administradores reciben aviso al registrarse un usuario, con persistencia y estado leído/no leído.
- **Empleados con baja lógica:** estado activo/inactivo y fecha de ingreso, conservando el historial.
- **Relaciones:** vínculos entre empresas y empleados, con eliminación en cascada.
- **Manejo de errores centralizado:** middleware que traduce errores de Mongoose (validaciones y duplicados, código 11000) a mensajes claros.
- **API JSON:** soporte para requests JSON además de HTML.

## Validaciones

### Empresa

- **razonSocial:** obligatorio, no vacío
- **cuit:** obligatorio, formato `XX-XXXXXXXX-X`, único
- **contacto:** obligatorio, no vacío
- **email:** obligatorio, formato válido, único

### Empleado

- **nombre / apellido:** obligatorios, no vacíos
- **dni:** obligatorio, 7-8 dígitos numéricos, único
- **puesto:** obligatorio, no vacío
- **salarioBase:** obligatorio, número ≥ 0
- **fechaIngreso:** fecha de alta del empleado
- **activo:** estado activo/inactivo (baja lógica)

### Liquidación

- **periodo:** obligatorio, formato `YYYY-MM`
- Posterior a la fecha de ingreso del empleado, no más de 2 meses adelante y sin duplicados por empleado y período

## Integrantes del grupo

- Gastón Zampar
- Martín Juan
- Santiago Cuda
- Adrián Madroñal
- Nicolás Luciano Rolón Sironi
