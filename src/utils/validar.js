const REGEX_CUIT = /^\d{2}-\d{7,8}-\d{1}$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_DNI = /^\d{7,8}$/;

const validarEmpresa = (body) => {
  const errores = [];
  const { razonSocial, cuit, contacto, email } = body;

  if (!razonSocial || !razonSocial.trim())
    errores.push("razonSocial es obligatorio");

  if (!cuit || !cuit.trim())
    errores.push("cuit es obligatorio");
  else if (!REGEX_CUIT.test(cuit.trim()))
    errores.push("cuit debe tener formato XX-XXXXXXXX-X (ej: 30-12345678-9)");

  if (!contacto || !contacto.trim())
    errores.push("contacto es obligatorio");

  if (!email || !email.trim())
    errores.push("email es obligatorio");
  else if (!REGEX_EMAIL.test(email.trim()))
    errores.push("email no tiene un formato válido");

  return errores.length ? errores : null;
};

const validarEmpleado = (body) => {
  const errores = [];
  const { nombre, apellido, dni, puesto, salarioBase } = body;

  if (!nombre || !nombre.trim())
    errores.push("nombre es obligatorio");

  if (!apellido || !apellido.trim())
    errores.push("apellido es obligatorio");

  if (!dni || !dni.trim())
    errores.push("dni es obligatorio");
  else if (!REGEX_DNI.test(dni.trim()))
    errores.push("dni debe contener entre 7 y 8 dígitos numéricos");

  if (!puesto || !puesto.trim())
    errores.push("puesto es obligatorio");

  if (salarioBase === undefined || salarioBase === "")
    errores.push("salarioBase es obligatorio");
  else if (isNaN(Number(salarioBase)) || Number(salarioBase) < 0)
    errores.push("salarioBase debe ser un número mayor o igual a 0");

  return errores.length ? errores : null;
};

module.exports = { validarEmpresa, validarEmpleado };
