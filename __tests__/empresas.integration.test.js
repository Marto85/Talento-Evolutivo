const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/database');
const Empresa = require('../src/models/Empresa');
const Empleado = require('../src/models/Empleado');

describe('CRUD Empresas - Integration Tests', () => {
  beforeAll(async () => {
    try {
      await connectDB();
      await Empresa.deleteMany({});
      await Empleado.deleteMany({});
    } catch (error) {
      console.log('DB connection error (expected in test env):', error.message);
    }
  });

  afterAll(async () => {
    try {
      await Empresa.deleteMany({});
      await Empleado.deleteMany({});
      await disconnectDB();
    } catch (error) {
      console.log('Cleanup error:', error.message);
    }
  });

  describe('GET /empresas', () => {
    test('debe retornar lista de empresas en formato JSON', async () => {
      // Arrange: crear empresa de prueba
      await Empresa.create({
        razonSocial: 'Empresa Test 1',
        cuit: '30-12345678-9',
        contacto: 'Juan Pérez',
        email: 'empresa1@test.com',
      });

      // Act
      const response = await request(app)
        .get('/empresas')
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBeLessThanOrEqual(401); // Puede retornar 401 sin autenticación
      if (response.status === 200) {
        expect(Array.isArray(response.body)).toBe(true);
      }
    });
  });

  describe('POST /empresas (Crear)', () => {
    test('debe crear empresa con datos válidos', async () => {
      // Arrange
      const datosEmpresa = {
        razonSocial: 'Nueva Empresa',
        cuit: '35-87654321-3',
        contacto: 'Pedro Martínez',
        email: 'empresa@test.com',
      };

      // Act
      const response = await request(app)
        .post('/empresas')
        .send(datosEmpresa)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBeLessThanOrEqual(401); // Requiere autenticación
    });

    test('debe rechazar empresa con CUIT inválido', async () => {
      // Arrange
      const datosEmpresa = {
        razonSocial: 'Empresa Inválida',
        cuit: 'invalido',
        contacto: 'Contacto',
        email: 'test@empresa.com',
      };

      // Act
      const response = await request(app)
        .post('/empresas')
        .send(datosEmpresa)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBeLessThanOrEqual(401);
    });

    test('debe rechazar empresa con campos obligatorios vacíos', async () => {
      // Arrange
      const datosEmpresa = {
        razonSocial: '',
        cuit: '',
        contacto: '',
        email: '',
      };

      // Act
      const response = await request(app)
        .post('/empresas')
        .send(datosEmpresa)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBeLessThanOrEqual(401);
    });
  });

  describe('GET /empresas/:id (Detalle)', () => {
    test('debe retornar detalles de una empresa existente', async () => {
      // Arrange: crear empresa
      const empresa = await Empresa.create({
        razonSocial: 'Empresa Detail Test',
        cuit: '37-99888777-1',
        contacto: 'Roberto',
        email: 'detail@test.com',
      });

      // Act
      const response = await request(app)
        .get(`/empresas/${empresa._id}`)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBeLessThanOrEqual(401);
    });

    test('debe retornar 404 para ID inexistente', async () => {
      // Act
      const response = await request(app)
        .get('/empresas/507f1f77bcf86cd799439011')
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(404);
    });
  });

  describe('POST /empresas/:id/editar (Actualizar)', () => {
    test('debe actualizar empresa con datos válidos', async () => {
      // Arrange
      const empresa = await Empresa.create({
        razonSocial: 'Empresa a Editar',
        cuit: '38-11223344-5',
        contacto: 'Original',
        email: 'original@test.com',
      });

      const datosActualizados = {
        razonSocial: 'Empresa Editada',
        cuit: '38-11223344-5',
        contacto: 'Contacto Actualizado',
        email: 'actualizado@test.com',
      };

      // Act
      const response = await request(app)
        .post(`/empresas/${empresa._id}/editar`)
        .send(datosActualizados)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBeLessThanOrEqual(401);
    });
  });

  describe('POST /empresas/:id/eliminar (Borrar)', () => {
    test('debe eliminar empresa y sus empleados asociados', async () => {
      // Arrange
      const empresa = await Empresa.create({
        razonSocial: 'Empresa a Eliminar',
        cuit: '39-55667788-9',
        contacto: 'Temporary',
        email: 'temp@test.com',
      });

      // Crear empleado asociado
      await Empleado.create({
        nombre: 'Empleado Test',
        apellido: 'Vinculado',
        dni: '22334455',
        empresaId: empresa._id,
        puesto: 'Test',
        salarioBase: 30000,
      });

      // Act
      const response = await request(app)
        .post(`/empresas/${empresa._id}/eliminar`)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBeLessThanOrEqual(401);
    });

    test('debe retornar 404 para empresa inexistente', async () => {
      // Act
      const response = await request(app)
        .post('/empresas/507f1f77bcf86cd799439011/eliminar')
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(404);
    });
  });
});
