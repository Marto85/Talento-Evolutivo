const request = require('supertest');
const { connectDB, disconnectDB } = require('../src/config/database');
const Usuario = require('../src/models/Usuario');
const { hashPassword } = require('../src/utils/password');

// Importar app después de las dependencias para que dotenv ya esté cargado
let app;

describe('Autenticación - Integration Tests', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    app = require('../src/app');
    try {
      await connectDB();
      await Usuario.deleteMany({ user: /^testuser/ });
    } catch (error) {
      console.log('DB setup error:', error.message);
    }
  });

  afterAll(async () => {
    try {
      await Usuario.deleteMany({ user: /^testuser/ });
      await disconnectDB();
    } catch (error) {
      console.log('Cleanup error:', error.message);
    }
  });

  describe('GET /login', () => {
    test('debe mostrar formulario de login si no está autenticado', async () => {
      const response = await request(app).get('/login');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Iniciar sesión');
    });
  });

  describe('POST /login', () => {
    test('debe rechazar login de usuario no aprobado', async () => {
      // Crear usuario sin aprobar (aprobado: false por defecto)
      await Usuario.create({
        user: 'testuser_pendiente',
        password: await hashPassword('pass123'),
        role: 'empleado',
        aprobado: false,
      });

      const response = await request(app)
        .post('/login')
        .type('form')
        .send({ user: 'testuser_pendiente', password: 'pass123' });

      // Debe redirigir al login con error, no a /empresas
      expect(response.status).toBeLessThan(500);
      const location = response.headers['location'] || '';
      expect(location).not.toBe('/empresas');
    });

    test('debe rechazar login con credenciales incorrectas', async () => {
      const response = await request(app)
        .post('/login')
        .type('form')
        .send({ user: 'no_existe_este_usuario', password: 'wrongpass' });

      expect(response.status).toBeLessThan(500);
      const location = response.headers['location'] || '';
      expect(location).not.toBe('/empresas');
    });

    test('debe permitir login de usuario aprobado', async () => {
      await Usuario.create({
        user: 'testuser_aprobado',
        password: await hashPassword('pass123'),
        role: 'empleado',
        aprobado: true,
      });

      const response = await request(app)
        .post('/login')
        .type('form')
        .send({ user: 'testuser_aprobado', password: 'pass123' });

      expect(response.status).toBeLessThan(500);
      // Login exitoso redirige a /empresas
      const location = response.headers['location'] || '';
      expect(location).toBe('/empresas');
    });
  });

  describe('GET /pendiente', () => {
    test('debe mostrar pantalla de pendiente sin autenticación', async () => {
      const response = await request(app).get('/pendiente');
      expect(response.status).toBeLessThanOrEqual(302);
    });
  });
});
