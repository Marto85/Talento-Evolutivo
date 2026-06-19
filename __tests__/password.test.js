const { hashPassword, verifyPassword, isPasswordHash } = require('../src/utils/password');

describe('Password Security - Unit Tests', () => {
  describe('hashPassword', () => {
    test('debe generar hash válido para una contraseña', async () => {
      // Arrange
      const password = 'mySecurePassword123';

      // Act
      const hash = await hashPassword(password);

      // Assert
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).toContain('scrypt$');
    });

    test('debe generar diferentes hashes para misma contraseña (por salt aleatorio)', async () => {
      // Arrange
      const password = 'testPassword';

      // Act
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      // Assert
      expect(hash1).not.toBe(hash2);
      expect(hash1).toContain('scrypt$');
      expect(hash2).toContain('scrypt$');
    });
  });

  describe('isPasswordHash', () => {
    test('debe retornar true para un string que comienza con "scrypt$"', () => {
      // Arrange
      const hash = 'scrypt$abc123$def456';

      // Act
      const result = isPasswordHash(hash);

      // Assert
      expect(result).toBe(true);
    });

    test('debe retornar false para contraseña en texto plano', () => {
      // Arrange
      const plainPassword = 'myPassword123';

      // Act
      const result = isPasswordHash(plainPassword);

      // Assert
      expect(result).toBe(false);
    });

    test('debe retornar false para valores no string', () => {
      // Assert
      expect(isPasswordHash(null)).toBe(false);
      expect(isPasswordHash(undefined)).toBe(false);
      expect(isPasswordHash(123)).toBe(false);
      expect(isPasswordHash({})).toBe(false);
    });
  });

  describe('verifyPassword', () => {
    test('debe verificar correctamente una contraseña con su hash', async () => {
      // Arrange
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      // Act
      const isValid = await verifyPassword(password, hash);

      // Assert
      expect(isValid).toBe(true);
    });

    test('debe rechazar contraseña incorrecta contra hash válido', async () => {
      // Arrange
      const correctPassword = 'testPassword123';
      const wrongPassword = 'wrongPassword123';
      const hash = await hashPassword(correctPassword);

      // Act
      const isValid = await verifyPassword(wrongPassword, hash);

      // Assert
      expect(isValid).toBe(false);
    });

    test('debe permitir retrocompatibilidad con contraseñas en texto plano', async () => {
      // Arrange
      const plainPassword = 'plainTextPassword';

      // Act
      const isValid = await verifyPassword(plainPassword, plainPassword);

      // Assert
      expect(isValid).toBe(true);
    });

    test('debe rechazar contraseña en texto plano incorrecta', async () => {
      // Arrange
      const password1 = 'password1';
      const password2 = 'password2';

      // Act
      const isValid = await verifyPassword(password1, password2);

      // Assert
      expect(isValid).toBe(false);
    });

    test('debe rechazar hash corrupto', async () => {
      // Arrange
      const password = 'testPassword';
      const corruptedHash = 'scrypt$invalid$corrupt';

      // Act
      const isValid = await verifyPassword(password, corruptedHash);

      // Assert
      expect(isValid).toBe(false);
    });
  });

  describe('Migración automática de passwords', () => {
    test('debe poder migrar de texto plano a hash', async () => {
      // Arrange
      const plainPassword = 'oldPlainPassword';

      // Act
      // Step 1: Verificar con texto plano
      const step1Valid = await verifyPassword(plainPassword, plainPassword);

      // Step 2: Crear hash
      const newHash = await hashPassword(plainPassword);

      // Step 3: Verificar con nuevo hash
      const step2Valid = await verifyPassword(plainPassword, newHash);

      // Step 4: Verificar que el hash es diferente al texto plano
      const isDifferent = plainPassword !== newHash;
      const hasHashPrefix = isPasswordHash(newHash);

      // Assert
      expect(step1Valid).toBe(true);
      expect(step2Valid).toBe(true);
      expect(isDifferent).toBe(true);
      expect(hasHashPrefix).toBe(true);
    });
  });
});
