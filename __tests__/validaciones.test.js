const { validarEmpresa, validarEmpleado } = require('../src/utils/validar');

describe('Validación de Empresa - Unit Tests', () => {
  describe('validarEmpresa', () => {
    test('debe aceptar empresa válida con todos los campos', () => {
      // Arrange
      const empresaValida = {
        razonSocial: 'Empresa Test',
        cuit: '30-12345678-9',
        contacto: 'Juan Pérez',
        email: 'test@empresa.com',
      };

      // Act
      const errores = validarEmpresa(empresaValida);

      // Assert
      expect(errores).toBeNull();
    });

    test('debe retornar error si razonSocial está vacío', () => {
      // Arrange
      const empresaInvalida = {
        razonSocial: '',
        cuit: '30-12345678-9',
        contacto: 'Juan Pérez',
        email: 'test@empresa.com',
      };

      // Act
      const errores = validarEmpresa(empresaInvalida);

      // Assert
      expect(errores).not.toBeNull();
      expect(Array.isArray(errores)).toBe(true);
      expect(errores).toContain('razonSocial es obligatorio');
    });

    test('debe retornar error si CUIT no tiene formato válido', () => {
      // Arrange
      const empresaInvalida = {
        razonSocial: 'Empresa Test',
        cuit: '12345678',
        contacto: 'Juan Pérez',
        email: 'test@empresa.com',
      };

      // Act
      const errores = validarEmpresa(empresaInvalida);

      // Assert
      expect(errores).not.toBeNull();
      expect(errores).toContain('cuit debe tener formato XX-XXXXXXXX-X (ej: 30-12345678-9)');
    });

    test('debe retornar error si email no tiene formato válido', () => {
      // Arrange
      const empresaInvalida = {
        razonSocial: 'Empresa Test',
        cuit: '30-12345678-9',
        contacto: 'Juan Pérez',
        email: 'email-sin-arroba',
      };

      // Act
      const errores = validarEmpresa(empresaInvalida);

      // Assert
      expect(errores).not.toBeNull();
      expect(errores).toContain('email no tiene un formato válido');
    });

    test('debe retornar múltiples errores si hay varios campos inválidos', () => {
      // Arrange
      const empresaInvalida = {
        razonSocial: '',
        cuit: 'invalido',
        contacto: '',
        email: 'invalido',
      };

      // Act
      const errores = validarEmpresa(empresaInvalida);

      // Assert
      expect(errores).not.toBeNull();
      expect(errores.length).toBeGreaterThan(2);
      expect(errores.length).toBeLessThanOrEqual(4);
    });
  });

  describe('validarEmpleado', () => {
    test('debe aceptar empleado válido con todos los campos', () => {
      // Arrange
      const empleadoValido = {
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '12345678',
        puesto: 'Desarrollador',
        salarioBase: 50000,
      };

      // Act
      const errores = validarEmpleado(empleadoValido);

      // Assert
      expect(errores).toBeNull();
    });

    test('debe retornar error si DNI tiene menos de 7 dígitos', () => {
      // Arrange
      const empleadoInvalido = {
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '123456',
        puesto: 'Desarrollador',
        salarioBase: 50000,
      };

      // Act
      const errores = validarEmpleado(empleadoInvalido);

      // Assert
      expect(errores).not.toBeNull();
      expect(errores).toContain('dni debe contener entre 7 y 8 dígitos numéricos');
    });

    test('debe retornar error si salarioBase es negativo', () => {
      // Arrange
      const empleadoInvalido = {
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '12345678',
        puesto: 'Desarrollador',
        salarioBase: -1000,
      };

      // Act
      const errores = validarEmpleado(empleadoInvalido);

      // Assert
      expect(errores).not.toBeNull();
      expect(errores).toContain('salarioBase debe ser un número mayor o igual a 0');
    });

    test('debe retornar error si salarioBase no es un número', () => {
      // Arrange
      const empleadoInvalido = {
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '12345678',
        puesto: 'Desarrollador',
        salarioBase: 'no-es-numero',
      };

      // Act
      const errores = validarEmpleado(empleadoInvalido);

      // Assert
      expect(errores).not.toBeNull();
      expect(errores).toContain('salarioBase debe ser un número mayor o igual a 0');
    });

    test('debe retornar error si nombre está vacío', () => {
      // Arrange
      const empleadoInvalido = {
        nombre: '',
        apellido: 'Pérez',
        dni: '12345678',
        puesto: 'Desarrollador',
        salarioBase: 50000,
      };

      // Act
      const errores = validarEmpleado(empleadoInvalido);

      // Assert
      expect(errores).not.toBeNull();
      expect(errores).toContain('nombre es obligatorio');
    });
  });
});
