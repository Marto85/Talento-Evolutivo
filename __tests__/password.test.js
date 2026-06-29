const { hashPassword, verifyPassword, isPasswordHash } = require('../src/utils/password');

describe('Password Security - Unit Tests', () => {
  describe('hashPassword', () => {
    test('debe generar hash válido para una contraseña', async () => {
      const password = 'mySecurePassword123';
      const hash = await hashPassword(password);
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).toContain('scrypt$');
    });

    test('debe generar diferentes hashes para misma contraseña (salt aleatorio)', async () => {
      const password = 'testPassword';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      expect(hash1).not.toBe(hash2);
      expect(hash1).toContain('scrypt$');
      expect(hash2).toContain('scrypt$');
    });
  });

  describe('isPasswordHash', () => {
    test('debe retornar true para un string que comienza con "scrypt$"', () => {
      const hash = 'scrypt$abc123$def456';
      expect(isPasswordHash(hash)).toBe(true);
    });

    test('debe retornar false para contraseña en texto plano', () => {
      expect(isPasswordHash('myPassword123')).toBe(false);
    });

    test('debe retornar false para valores no string', () => {
      expect(isPasswordHash(null)).toBe(false);
      expect(isPasswordHash(undefined)).toBe(false);
      expect(isPasswordHash(123)).toBe(false);
      expect(isPasswordHash({})).toBe(false);
    });
  });

  describe('verifyPassword', () => {
    test('debe verificar correctamente una contraseña con su hash', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    test('debe rechazar contraseña incorrecta contra hash válido', async () => {
      const hash = await hashPassword('testPassword123');
      const isValid = await verifyPassword('wrongPassword123', hash);
      expect(isValid).toBe(false);
    });

    test('debe permitir retrocompatibilidad con contraseñas en texto plano', async () => {
      const plainPassword = 'plainTextPassword';
      const isValid = await verifyPassword(plainPassword, plainPassword);
      expect(isValid).toBe(true);
    });

    test('debe rechazar contraseña en texto plano incorrecta', async () => {
      const isValid = await verifyPassword('password1', 'password2');
      expect(isValid).toBe(false);
    });

    test('debe rechazar hash corrupto sin lanzar excepción', async () => {
      const isValid = await verifyPassword('testPassword', 'scrypt$invalid$corrupt');
      expect(isValid).toBe(false);
    });
  });

  describe('Migración de passwords (texto plano → hash)', () => {
    test('debe poder migrar de texto plano a hash y verificar ambos', async () => {
      const plainPassword = 'oldPlainPassword';

      const step1Valid = await verifyPassword(plainPassword, plainPassword);
      const newHash = await hashPassword(plainPassword);
      const step2Valid = await verifyPassword(plainPassword, newHash);

      expect(step1Valid).toBe(true);
      expect(step2Valid).toBe(true);
      expect(plainPassword !== newHash).toBe(true);
      expect(isPasswordHash(newHash)).toBe(true);
    });
  });
});
