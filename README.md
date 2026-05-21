# Talento Evolutivo S.A. — Sistema de Gestión de Haberes

Aplicación web para la gestión de empresas y empleados, desarrollada con Node.js y Express. Permite registrar empresas, asociarles empleados y administrar la información básica de cada uno.

## Tecnologías

- Node.js
- Express 4
- MongoDB con Mongoose
- Pug (motor de plantillas)

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
```

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
│   └── database.js        # Conexión a MongoDB
├── controllers/
│   ├── empresa.controller.js
│   └── empleado.controller.js
├── middlewares/
│   └── errorHandler.js    # Manejo centralizado de errores
├── models/
│   ├── Empresa.js         # Schema de Mongoose
│   └── Empleado.js        # Schema de Mongoose
├── routes/
│   ├── empresa.routes.js
│   └── empleado.routes.js
├── utils/
│   └── validar.js         # Validaciones
└── views/
    ├── layout.pug
    ├── 404.pug
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

✅ **Arquitectura Modular**: Separación clara de responsabilidades (Models, Controllers, Routes)  
✅ **Base de Datos MongoDB**: Integración con Mongoose para esquemas validados  
✅ **Validaciones**: Validaciones tanto en cliente como en servidor  
✅ **Programación Asincrónica**: Uso de async/await en toda la aplicación  
✅ **Manejo de Errores**: Middleware centralizado para gestión de errores  
✅ **API JSON**: Soporte para requests JSON además de HTML  
✅ **Vistas Pug**: Motor de plantillas para renderizado server-side  

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

## Mejoras Implementadas

- ✅ Migración de JSON a MongoDB con Mongoose
- ✅ Implementación de async/await en controladores
- ✅ Manejo centralizado de errores con middleware
- ✅ Validaciones a nivel de schema
- ✅ Relaciones entre Empresas y Empleados
- ✅ Eliminación en cascada (empresas → empleados)
- ✅ Soporte para respuestas JSON

## Desarrolladores

Para contribuir al proyecto, asegúrate de:
1. Mantener la estructura modular
2. Usar async/await en operaciones asincrónicas
3. Validar inputs antes de guardar a BD
4. Agregar errores al middleware de error

---

Para más detalles sobre la configuración de MongoDB, ver `MONGODB_SETUP.md`.