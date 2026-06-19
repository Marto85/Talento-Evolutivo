# Talento Evolutivo S.A. — Sistema de Gestión de Haberes

Aplicación web para la gestión de empresas y empleados, desarrollada con Node.js y Express. Este proyecto corresponde al segundo parcial de la materia Desarrollo Web Backend, integrando una arquitectura modular, persistencia en base de datos y un sistema de autenticación.

## Tecnologías

- **Entorno y Framework:** Node.js, Express 4
- **Base de Datos:** MongoDB con ODM Mongoose
- **Motor de Plantillas:** Pug
- **Autenticación:** Passport.js, Express-Session, cookies seguras, CSRF y passwords hasheados

## Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd talento-evolutivo
npm install
```

### 2. Configurar MongoDB

Lee el archivo `MONGODB_SETUP.md` para instrucciones detalladas sobre cómo:
- Usar MongoDB Atlas (cloud gratuito) ✅ Recomendado
- O configurar MongoDB localmente

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:
```
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/talento-evolutivo?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development
SESSION_SECRET=tu_secreto_seguro_para_sesiones
```

`SESSION_SECRET` debe ser un valor largo, privado y aleatorio. En producción es obligatorio porque se usa para firmar la cookie de sesión.

## Uso

```bash
# Producción
npm start

# Desarrollo (con recarga automática via nodemon)
npm run dev
```

El servidor inicia en `http://localhost:3000`.

## Estructura del proyecto
```
src/
├── app.js                  # Aplicación principal
├── config/
│   ├── database.js        # Conexión a MongoDB
│   └── passport.js        # Estrategias de autenticación
├── controllers/
│   ├── auth.controller.js
│   ├── empresa.controller.js
│   └── empleado.controller.js
├── middlewares/
│   ├── auth.middleware.js # Protección de rutas
│   └── errorHandler.js    # Manejo centralizado de errores
├── models/
│   ├── Usuario.js         # Schema de Mongoose para Login
│   ├── Empresa.js         # Schema de Mongoose
│   └── Empleado.js        # Schema de Mongoose
├── routes/
│   ├── auth.routes.js
│   ├── empresa.routes.js
│   └── empleado.routes.js
├── utils/
│   └── validar.js         # Validaciones
└── views/
    ├── layout.pug
    ├── 404.pug
    ├── auth/
    │   └── login.pug
    ├── empresas/
    │   ├── index.pug
    │   ├── form.pug
    │   └── detail.pug
    └── empleados/
        ├── index.pug
        ├── form.pug
        └── detail.pug
```

## Rutas disponibles

### Empresas

| Método | Ruta                   | Descripción           |
|--------|------------------------|-----------------------|
| GET    | /login                 | Listar todas          |
| POST   | /login                 | Formulario de alta    |
| POST   | /logout                | Crear empresa         |


| Método | Ruta                   | Descripción           |
|--------|------------------------|-----------------------|
| GET    | /empresas              | Listar todas          |
| GET    | /empresas/nueva        | Formulario de alta    |
| POST   | /empresas              | Crear empresa         |
| GET    | /empresas/:id          | Ver detalles empresa  |
| GET    | /empresas/:id/editar   | Formulario de edición |
| POST   | /empresas/:id/editar   | Actualizar empresa    |
| POST   | /empresas/:id/eliminar | Eliminar empresa      |

### Empleados (anidadas bajo empresa)

| Método | Ruta                                      | Descripción           |
|--------|-------------------------------------------|-----------------------|
| GET    | /empresas/:empresaId/empleados            | Listar todos          |
| GET    | /empresas/:empresaId/empleados/nuevo      | Formulario de alta    |
| POST   | /empresas/:empresaId/empleados            | Crear empleado        |
| GET    | /empresas/:empresaId/empleados/:id        | Ver detalles empleado |
| GET    | /empresas/:empresaId/empleados/:id/editar | Formulario de edición |
| POST   | /empresas/:empresaId/empleados/:id/editar | Actualizar empleado   |
| POST   | /empresas/:empresaId/empleados/:id/eliminar | Eliminar empleado    |

## Características

Características y Mejoras Implementadas
✅ **Autenticación**: Implementación de Passport.js con sesiones persistidas en MongoDB y protección de rutas.
✅ **Seguridad de sesiones**: Cookies `httpOnly`, `sameSite=lax`, `secure` en producción y `SESSION_SECRET` obligatorio en producción.
✅ **Passwords protegidos**: Hash de contraseñas con `crypto.scrypt` y migración automática de passwords viejos en texto plano al iniciar sesión.
✅ **Protección CSRF**: Tokens CSRF en formularios y acciones sensibles por POST.
✅ **Base de Datos MongoDB**: Migración de archivos JSON estáticos a MongoDB integrado con Mongoose.
✅ **Arquitectura Modular**: Separación clara de responsabilidades (Models, Controllers, Routes, Middlewares).
✅ **Programación Asincrónica**: Uso de async/await en toda la aplicación.
✅ **Manejo de Errores y Validaciones**: Middleware centralizado para captura de errores y validaciones de Schemas robustas (formatos de CUIT, DNI, Email).
✅ **Relaciones**: Vínculos entre Empresas y Empleados, incluyendo eliminación en cascada.
✅ **API JSON**: Soporte para requests JSON además de HTML  
✅ **Vistas Pug**: Motor de plantillas para renderizado server-side  
✅ **Testing TDD**: Suite de 21+ tests unitarios e integración con Jest (validaciones, seguridad, CRUD)

## Testing

Se han implementado pruebas siguiendo **Test Driven Development (TDD)** según la teoría D11:

### Test Unitarios (19 tests)
- ✅ Validación de Empresas (5 tests)
- ✅ Validación de Empleados (5 tests)
- ✅ Seguridad de Passwords (11 tests - crypto.scrypt)

### Tests de Integración (9 tests)
- ✅ CRUD Empresas con Mongoose
- ✅ Autenticación y sesiones

**Ejecutar tests**:
```bash
npm test                    # Todos
npm run test:watch         # Watch mode
npm run test:coverage      # Con cobertura
```

Ver [`TESTING.md`](TESTING.md) y [`RESUMEN_TESTS.md`](RESUMEN_TESTS.md) para detalles completos.

## Validaciones

### Empresa
- **razonSocial**: Obligatorio, no vacío
- **cuit**: Obligatorio, formato XX-XXXXXXXX-X, único
- **contacto**: Obligatorio, no vacío
- **email**: Obligatorio, formato válido, único

### Empleado
- **nombre**: Obligatorio, no vacío
- **apellido**: Obligatorio, no vacío
- **dni**: Obligatorio, 7-8 dígitos numéricos, único
- **puesto**: Obligatorio, no vacío
- **salarioBase**: Obligatorio, número >= 0

Integrantes del Grupo
Gaston Zampar
Martin Juan
Santiago Cuda
Adrián Madroñal
Nicolás Luciano Rolón Sironi
---
