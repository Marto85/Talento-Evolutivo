const { validarEmpresa, validarEmpleado } = require('../src/utils/validar');

describe('Validación de Empresa - Unit Tests', () => {
  describe('validarEmpresa', () => {
    test('debe aceptar empresa válida con todos los campos', () => {
      const empresaValida = {
        razonSocial: 'Empresa Test',
        cuit: '30-12345678-9',
        contacto: 'Juan Pérez',
        email: 'test@empresa.com',
      };
      const errores = validarEmpresa(empresaValida);
      expect(errores).toBeNull();
    });

    test('debe retornar error si razonSocial está vacío', () => {
      const empresaInvalida = {
        razonSocial: '',
        cuit: '30-12345678-9',
        contacto: 'Juan Pérez',
        email: 'test@empresa.com',
      };
      const errores = validarEmpresa(empresaInvalida);
      expect(errores).not.toBeNull();
      expect(Array.isArray(errores)).toBe(true);
      expect(errores).toContain('razonSocial es obligatorio');
    });

    test('debe retornar error si CUIT no tiene formato válido', () => {
      const empresaInvalida = {
        razonSocial: 'Empresa Test',
        cuit: '12345678',
        contacto: 'Juan Pérez',
        email: 'test@empresa.com',
      };
      const errores = validarEmpresa(empresaInvalida);
      expect(errores).not.toBeNull();
      expect(errores).toContain('cuit debe tener formato XX-XXXXXXXX-X (ej: 30-12345678-9)');
    });

    test('debe retornar error si email no tiene formato válido', () => {
      const empresaInvalida = {
        razonSocial: 'Empresa Test',
        cuit: '30-12345678-9',
        contacto: 'Juan Pérez',
        email: 'email-sin-arroba',
      };
      const errores = validarEmpresa(empresaInvalida);
      expect(errores).not.toBeNull();
      expect(errores).toContain('email no tiene un formato válido');
    });

    test('debe retornar múltiples errores si hay varios campos inválidos', () => {
      const empresaInvalida = {
        razonSocial: '',
        cuit: 'invalido',
        contacto: '',
        email: 'invalido',
      };
      const errores = validarEmpresa(empresaInvalida);
      expect(errores).not.toBeNull();
      expect(errores.length).toBeGreaterThan(2);
      expect(errores.length).toBeLessThanOrEqual(4);
    });
  });

  describe('validarEmpleado', () => {
    test('debe aceptar empleado válido con todos los campos', () => {
      const empleadoValido = {
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '12345678',
        puesto: 'Desarrollador',
        salarioBase: 50000,
      };
      const errores = validarEmpleado(empleadoValido);
      expect(errores).toBeNull();
    });

    test('debe retornar error si DNI tiene menos de 7 dígitos', () => {
      const empleadoInvalido = {
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '123456',
        puesto: 'Desarrollador',
        salarioBase: 50000,
      };
      const errores = validarEmpleado(empleadoInvalido);
      expect(errores).not.toBeNull();
      expect(errores).toContain('dni debe contener entre 7 y 8 dígitos numéricos');
    });

    test('debe retornar error si salarioBase es negativo', () => {
      const empleadoInvalido = {
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '12345678',
        puesto: 'Desarrollador',
        salarioBase: -1000,
      };
      const errores = validarEmpleado(empleadoInvalido);
      expect(errores).not.toBeNull();
      expect(errores).toContain('salarioBase debe ser un número mayor o igual a 0');
    });

    test('debe retornar error si salarioBase no es un número', () => {
      const empleadoInvalido = {
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '12345678',
        puesto: 'Desarrollador',
        salarioBase: 'no-es-numero',
      };
      const errores = validarEmpleado(empleadoInvalido);
      expect(errores).not.toBeNull();
      expect(errores).toContain('salarioBase debe ser un número mayor o igual a 0');
    });

    test('debe retornar error si nombre está vacío', () => {
      const empleadoInvalido = {
        nombre: '',
        apellido: 'Pérez',
        dni: '12345678',
        puesto: 'Desarrollador',
        salarioBase: 50000,
      };
      const errores = validarEmpleado(empleadoInvalido);
      expect(errores).not.toBeNull();
      expect(errores).toContain('nombre es obligatorio');
    });

    test('debe retornar error si apellido está vacío', () => {
      const empleadoInvalido = {
        nombre: 'Juan',
        apellido: '',
        dni: '12345678',
        puesto: 'Desarrollador',
        salarioBase: 50000,
      };
      const errores = validarEmpleado(empleadoInvalido);
      expect(errores).not.toBeNull();
      expect(errores).toContain('apellido es obligatorio');
    });
  });
});
