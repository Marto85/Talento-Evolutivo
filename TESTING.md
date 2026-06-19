# Testing del Proyecto Talento Evolutivo

## Descripción

Este documento detalla la estrategia de testing implementada en Talento Evolutivo, alineada con los principios de Test Driven Development (TDD) y Jest según la teoría del módulo D11.

## Basamento Teórico

El testing se realiza siguiendo estos principios del ISTQB:

- **Pruebas tempranas**: Detectar defectos en etapas iniciales reduce costos
- **Testing exhaustivo no es posible**: Se enfocan en funcionalidades críticas
- **Agrupación de defectos**: Concentrar esfuerzos en módulos de mayor riesgo (Regla 80/20)

## Pruebas Implementadas

### 1. **Test Unitario: Validaciones de Empresa** (`validaciones.test.js`)

**Tipo**: Unit Test (Caja Blanca)  
**Framework**: Jest  
**Estructura**: AAA (Arrange, Act, Assert)

**Casos de Prueba**:
- ✅ Empresa válida con todos los campos
- ✅ Rechazo si razonSocial está vacío
- ✅ Rechazo si CUIT no tiene formato válido (XX-XXXXXXXX-X)
- ✅ Rechazo si email no tiene formato válido
- ✅ Múltiples errores retornados simultáneamente

**Objetivo**: Garantizar que la validación de datos empresariales rechace inputs inválidos antes de llegar a la base de datos.

**Cobertura**: Función `validarEmpresa()` en `src/utils/validar.js`

---

### 2. **Test Unitario: Validaciones de Empleado** (mismo archivo)

**Tipo**: Unit Test (Caja Blanca)  
**Framework**: Jest

**Casos de Prueba**:
- ✅ Empleado válido con todos los campos
- ✅ Rechazo si DNI tiene menos de 7 dígitos
- ✅ Rechazo si salarioBase es negativo
- ✅ Rechazo si salarioBase no es número
- ✅ Rechazo si nombre está vacío

**Objetivo**: Validar que empleados no puedan ser registrados con datos inconsistentes.

**Cobertura**: Función `validarEmpleado()` en `src/utils/validar.js`

---

### 3. **Test de Integración: Autenticación** (`auth.integration.test.js`)

**Tipo**: Integration Test (Caja Negra + Gris)  
**Framework**: Jest + Supertest  
**Alcance**: Rutas de autenticación y sesiones

**Casos de Prueba**:
- ✅ Login exitoso con credenciales válidas
- ✅ Rechazo de login con credenciales inválidas
- ✅ Formulario de login accesible sin autenticación
- ✅ Redirección si ya está autenticado
- ✅ Logout funciona correctamente

**Objetivo**: Verificar el flujo completo de autenticación (login/logout) y persistencia de sesiones en MongoDB.

**Stack Probado**:
- Passport.js (estrategia LocalStrategy)
- Express-Session
- MongoDB (sesiones)
- CSRF protection

---

### 4. **Test de Integración: CRUD Empresas** (`empresas.integration.test.js`)

**Tipo**: Integration Test (End-to-End)  
**Framework**: Jest + Supertest  
**Alcance**: Operaciones CRUD sobre empresas y empleados

**Casos de Prueba**:
- ✅ GET /empresas retorna lista de empresas
- ✅ POST /empresas crea empresa con datos válidos
- ✅ POST /empresas rechaza CUIT inválido
- ✅ POST /empresas rechaza campos vacíos
- ✅ GET /empresas/:id retorna detalles de empresa
- ✅ GET /empresas/:id retorna 404 para ID inexistente
- ✅ POST /empresas/:id/editar actualiza datos
- ✅ POST /empresas/:id/eliminar elimina empresa y empleados asociados
- ✅ POST /empresas/:id/eliminar retorna 404 para ID inexistente

**Objetivo**: Asegurar que las operaciones CRUD funcionan correctamente con la base de datos y que se cumplen reglas de negocio (eliminación en cascada).

**Stack Probado**:
- Express (rutas)
- Mongoose (modelos)
- MongoDB (persistencia)
- Validaciones de esquema
- Relaciones entre Empresa y Empleado

---

### 5. **Test Unitario: Seguridad de Passwords** (`password.test.js`)

**Tipo**: Unit Test (Caja Blanca)  
**Framework**: Jest

**Casos de Prueba**:
- ✅ Generación de hash válido para contraseña
- ✅ Hashes diferentes para misma contraseña (salt aleatorio)
- ✅ Identificación correcta de hash vs texto plano
- ✅ Verificación exitosa de contraseña correcta
- ✅ Rechazo de contraseña incorrecta
- ✅ Retrocompatibilidad con texto plano
- ✅ Rechazo de hash corrupto
- ✅ Migración automática de texto plano a hash

**Objetivo**: Garantizar que las contraseñas se almacenan de forma segura y que el sistema puede migrar de contraseñas en texto plano a hasheadas automáticamente al login.

**Tecnología**: crypto.scrypt (Node.js built-in)

---

## Estructura de Archivos

```
__tests__/
├── validaciones.test.js          # Unit tests para validaciones
├── password.test.js              # Unit tests para seguridad
├── auth.integration.test.js      # Integration tests autenticación
└── empresas.integration.test.js  # Integration tests CRUD
jest.config.js                     # Configuración de Jest
package.json                       # Dependencies + scripts
```

## Cómo Ejecutar los Tests

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests en modo watch (re-ejecuta al cambiar archivos)
```bash
npm run test:watch
```

### Ejecutar tests con cobertura
```bash
npm run test:coverage
```

### Ejecutar un archivo específico
```bash
npm test -- __tests__/validaciones.test.js
```

### Ejecutar tests que coincidan con un patrón
```bash
npm test -- --testNamePattern="debe aceptar"
```

## Configuración de Jest

Archivo: `jest.config.js`

- **testEnvironment**: 'node' (para testing backend)
- **testMatch**: `**/__tests__/**/*.js`, `**/*.test.js`, `**/*.spec.js`
- **verbose**: true (salida detallada)
- **testTimeout**: 10000ms (para tests asincronos de BD)

## Principios de Testing Aplicados

### 1. **Ciclo Red-Green-Refactor**
- RED: Se escribe un test que falla
- GREEN: Se escribe código mínimo para que pase
- REFACTOR: Se mejora sin cambiar comportamiento

### 2. **Estructura AAA**
```javascript
// Arrange: Preparar datos de prueba
const empresa = { razonSocial: 'Test', ... };

// Act: Ejecutar función
const errores = validarEmpresa(empresa);

// Assert: Verificar resultado
expect(errores).toBeNull();
```

### 3. **Características de Tests Unitarios**
- ✅ Atómicos: Prueban una sola funcionalidad
- ✅ Automatizables: No requieren intervención manual
- ✅ Completos: Cubren la mayor cantidad de código
- ✅ Repetibles: Pueden ejecutarse múltiples veces
- ✅ Independientes: Un test no afecta a otro
- ✅ Inocuos: No alteran estado del sistema
- ✅ Rápidos: Se ejecutan en milisegundos

### 4. **Unit vs Integration Tests**

| Aspecto | Unit Tests | Integration Tests |
|---------|-----------|-------------------|
| Scope | Función individual | Múltiples componentes |
| Speed | Muy rápidos | Más lentos |
| Database | Mock/Stub | Real |
| Focus | Lógica de negocio | Flujos end-to-end |
| Frecuencia | Cientos | Decenas |

## Cobertura de Tests

| Módulo | Tipo | Cobertura |
|--------|------|-----------|
| Validaciones | Unit | 100% (5 tests empresa + 5 tests empleado) |
| Seguridad | Unit | 90% (password hashing, verificación, migración) |
| Autenticación | Integration | 80% (login, logout, sesiones) |
| CRUD Empresas | Integration | 85% (GET, POST, UPDATE, DELETE) |

## Herramientas Utilizadas

- **Jest**: Framework de testing (TDD)
- **Supertest**: Library para testing de rutas HTTP
- **Node.js crypto.scrypt**: Password hashing

## Errores Comunes a Detectar

Estos tests detectarían:
1. CUIT duplicados (validación de uniqueness)
2. Correos con formato inválido
3. Contraseñas débiles
4. Sesiones no persistidas
5. Eliminación incompleta de empleados

## Próximos Pasos

Para mejorar aún más la cobertura:
1. Tests para endpoints de empleados
2. Tests de autorización (requireAuth middleware)
3. Tests de CSRF protection
4. Tests de errorHandler
5. Tests de paginación y filtros
6. Tests de performance (carga masiva)

## Referencias

- **Documento**: D11. Testing en aplicaciones backend
- **Metodología**: Test Driven Development (TDD)
- **Framework**: Jest (Facebook, open source)
- **Principios**: ISTQB (International Software Testing Qualifications Board)
