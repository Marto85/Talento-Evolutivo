# Talento Evolutivo S.A. — Sistema de Gestión de Haberes

Aplicación web para la gestión de empresas y empleados, desarrollada con Node.js y Express. Permite registrar empresas, asociarles empleados y administrar la información básica de cada uno.

## Tecnologías

- Node.js
- Express 4
- Pug (motor de plantillas)
- Almacenamiento en archivos JSON

## Estructura del proyecto

src/
├── app.js                        
├── controllers/
│   ├── empresa.controller.js
│   └── empleado.controller.js
├── data/
│   ├── db.js                     
│   ├── empresas.json
│   └── empleados.json
├── middlewares/
│   ├── A IMPLEMENTAR

├── models/
│   ├── Empresa.js
│   └── Empleado.js
├── routes/
│   ├── empresa.routes.js
│   └── empleado.routes.js
└── views/
    ├── layout.pug
    ├── 404.pug
    ├── empresas/
    │   ├── index.pug
    │   └── form.pug
    └── empleados/
        ├── index.pug
        └── form.pug
```

## Instalación

```bash
git clone <url-del-repositorio>
cd backend_PFO1
npm install
```

## Uso

```bash
# Producción
npm start

# Desarrollo (con recarga automática via nodemon)
npm run dev
```

El servidor inicia en `http://localhost:3000`.

## Rutas disponibles

### Empresas

| Método | Ruta                   | Descripción           |
|--------|------------------------|-----------------------|
| GET    | /empresas              | Listar todas          |
| GET    | /empresas/nueva        | Formulario de alta    |
| POST   | /empresas              | Crear empresa         |
| GET    | /empresas/:id/editar   | Formulario de edición |
| POST   | /empresas/:id/editar   | Actualizar empresa    |
| POST   | /empresas/:id/eliminar | Eliminar empresa      |

### Empleados

| Método | Ruta                    | Descripción           |
|--------|-------------------------|-----------------------|
| GET    | /empleados              | Listar todos          |
| GET    | /empleados/nuevo        | Formulario de alta    |
| POST   | /empleados              | Crear empleado        |
| GET    | /empleados/:id/editar   | Formulario de edición |
| POST   | /empleados/:id/editar   | Actualizar empleado   |
| POST   | /empleados/:id/eliminar | Eliminar empleado     |

## Middlewares

A IMPLEMENTAR