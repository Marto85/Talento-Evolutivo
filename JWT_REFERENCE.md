// CÓMO USAR JWT EN EL PROYECTO

// 1. IMPORTAR EL MIDDLEWARE DE VALIDACIÓN JWT
const { validateToken } = require("../middlewares/validateToken");

// 2. PROTEGER RUTAS CON JWT (para APIs REST)
router.get("/empleados", validateToken, ctrl.listar);
router.post("/empleados", validateToken, ctrl.crear);
router.delete("/empleados/:id", validateToken, ctrl.eliminar);

// 3. EL TOKEN SE ENVÍA EN EL HEADER DE LA SOLICITUD
// Option A: Con "Bearer" prefix (recomendado)
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Option B: Solo el token
// Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// 4. EXAMPLE CON FETCH JAVASCRIPT
/*
const token = localStorage.getItem('token'); // Obtener token después del login

fetch('/api/empleados', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));
*/

// 5. EXAMPLE CON CURL
/*
curl -H "Authorization: Bearer tu_token_aqui" \
     http://localhost:3000/empleados
*/

// 6. EL TOKEN CONTIENE
/*
{
  id: "usuario_id",
  user: "nombre_usuario",
  iat: 1234567890,           // Cuando se creó
  exp: 1234569690            // Cuándo expira (30 min después)
}
*/

// 7. EN CASO DE TOKEN EXPIRADO, EL SERVIDOR RESPONDE
/*
Status: 401 Unauthorized
Body: { error: "Token expirado" }
*/

// 8. EN CASO DE TOKEN INVÁLIDO, EL SERVIDOR RESPONDE
/*
Status: 401 Unauthorized
Body: { error: "Token inválido" }
*/

// 9. EN CASO DE SIN TOKEN, EL SERVIDOR RESPONDE
/*
Status: 401 Unauthorized
Body: { error: "Token requerido" }
*/
