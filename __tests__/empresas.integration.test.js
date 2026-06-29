const request = require('supertest');
const { connectDB, disconnectDB } = require('../src/config/database');
const Empresa = require('../src/models/Empresa');
const Empleado = require('../src/models/Empleado');

let app;

describe('CRUD Empresas - Integration Tests', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    app = require('../src/app');
    try {
      await connectDB();
      await Empresa.deleteMany({ razonSocial: /^Test/ });
      await Empleado.deleteMany({ nombre: /^EmpleadoTest/ });
    } catch (error) {
      console.log('DB setup error:', error.message);
    }
  });

  afterAll(async () => {
    try {
      await Empresa.deleteMany({ razonSocial: /^Test/ });
      await Empleado.deleteMany({ nombre: /^EmpleadoTest/ });
      await disconnectDB();
    } catch (error) {
      console.log('Cleanup error:', error.message);
    }
  });

  describe('GET /empresas', () => {
    test('debe redirigir a login si no está autenticado', async () => {
      const response = await request(app)
        .get('/empresas')
        .set('Accept', 'application/json');
      // Sin autenticación debe redirigir (302) o rechazar (401)
      expect([302, 401]).toContain(response.status);
    });
  });

  describe('GET /empresas/:id', () => {
    test('debe retornar 404 para ID de empresa inexistente', async () => {
      const response = await request(app)
        .get('/empresas/507f1f77bcf86cd799439011')
        .set('Accept', 'application/json');
      expect(response.status).toBe(404);
    });

    test('debe retornar 302 redirect a login para empresa existente sin auth', async () => {
      const empresa = await Empresa.create({
        razonSocial: 'Test Empresa Detail',
        cuit: '37-99888777-1',
        contacto: 'Roberto',
        email: 'detail@test.com',
      });
      const response = await request(app)
        .get(`/empresas/${empresa._id}`)
        .set('Accept', 'application/json');
      expect([302, 401]).toContain(response.status);
    });
  });

  describe('POST /empresas (Crear)', () => {
    test('debe redirigir a login si no está autenticado', async () => {
      const response = await request(app)
        .post('/empresas')
        .type('form')
        .send({
          razonSocial: 'Test Nueva Empresa',
          cuit: '35-87654321-3',
          contacto: 'Pedro Martínez',
          email: 'empresa@test.com',
        });
      expect([302, 401, 403]).toContain(response.status);
    });
  });

  describe('POST /empresas/:id/eliminar', () => {
    test('debe retornar 404 para empresa inexistente', async () => {
      const response = await request(app)
        .post('/empresas/507f1f77bcf86cd799439011/eliminar')
        .set('Accept', 'application/json');
      expect(response.status).toBe(404);
    });
  });

  describe('Modelo Empresa - validaciones directas', () => {
    test('debe crear empresa válida en la BD', async () => {
      const empresa = await Empresa.create({
        razonSocial: 'Test Creación Directa',
        cuit: '30-11223344-5',
        contacto: 'Contacto Test',
        email: 'directo@test.com',
      });
      expect(empresa._id).toBeDefined();
      expect(empresa.razonSocial).toBe('Test Creación Directa');
    });

    test('debe rechazar empresa sin razonSocial', async () => {
      await expect(
        Empresa.create({ cuit: '30-11223344-5', contacto: 'c', email: 'e@e.com' })
      ).rejects.toThrow();
    });

    test('debe asociar empleados a empresa correctamente', async () => {
      const empresa = await Empresa.create({
        razonSocial: 'Test Empresa Empleados',
        cuit: '30-99887766-5',
        contacto: 'Contacto',
        email: 'emptest@test.com',
      });
      const empleado = await Empleado.create({
        nombre: 'EmpleadoTest',
        apellido: 'Vinculado',
        dni: '22334455',
        empresaId: empresa._id,
        puesto: 'Tester',
        salarioBase: 30000,
      });
      expect(String(empleado.empresaId)).toBe(String(empresa._id));
    });
  });
});
