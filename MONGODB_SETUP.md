# 🚀 Instrucciones: Configurar MongoDB Atlas

## Opción 1: MongoDB Atlas (Recomendado - Cloud Gratuito)

### Paso 1: Crear cuenta en MongoDB Atlas
1. Ve a https://www.mongodb.com/cloud/atlas
2. Haz clic en "Sign Up" (o "Try Free")
3. Completa el formulario con tu email y contraseña
4. Verifica tu email

### Paso 2: Crear un Cluster
1. Después de iniciar sesión, ve a "Database"
2. Haz clic en "Build a Database"
3. Elige el tier "FREE" (M0)
4. Selecciona tu región (recomendado: cerca de ti)
5. Haz clic en "Create Cluster" y espera a que se cree (2-3 minutos)

### Paso 3: Crear Usuario de Base de Datos
1. En el dashboard del cluster, ve a "Database Access" (en el menú izquierdo)
2. Haz clic en "Add New Database User"
3. Ingresa un usuario (ej: `talento-dev`) y contraseña
4. Dale el rol "Atlas admin"
5. Haz clic en "Add User"

### Paso 4: Obtener Connection String
1. Ve a "Database" en el menú izquierdo
2. Haz clic en "Connect" en tu cluster
3. Selecciona "Connect your application"
4. Elige "Node.js" como driver
5. Copia la connection string (se ve así):
   ```
   mongodb+srv://talento-dev:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Paso 5: Configurar el archivo .env

Abre el archivo `.env` en la raíz del proyecto y reemplaza:
```
MONGODB_URI=mongodb+srv://tu_usuario:tu_contraseña@cluster0.xxxxx.mongodb.net/talento-evolutivo?retryWrites=true&w=majority
```

**Asegúrate de:**
- Reemplazar `tu_usuario` con tu usuario (ej: `talento-dev`)
- Reemplazar `tu_contraseña` con tu contraseña
- Reemplazar `cluster0.xxxxx` con tu cluster URL
- Agregar `/talento-evolutivo?` al final para especificar la base de datos

---

## Opción 2: MongoDB Local (Si tienes MongoDB instalado)

Si tienes MongoDB corriendo localmente:

```env
MONGODB_URI=mongodb://localhost:27017/talento-evolutivo
```

---

## Probar la Conexión

Después de configurar `.env`, ejecuta:

```bash
npm run dev
```

Deberías ver en la consola:
```
✓ Conectado a MongoDB
Servidor corriendo en http://localhost:3000
```

---

## Próximos Pasos

Una vez que MongoDB esté configurado:

1. Inicia el servidor: `npm run dev`
2. Ve a http://localhost:3000
3. Prueba crear, editar y eliminar empresas y empleados
4. Las bases de datos y colecciones se crearán automáticamente

¡Todo listo! 🎉
