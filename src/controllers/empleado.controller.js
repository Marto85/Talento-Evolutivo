const Empleado = require("../models/Empleado");
const Empresa = require("../models/Empresa");
const Liquidacion = require("../models/Liquidacion");
const { validarEmpleado } = require("../utils/validar");

const parseFechaIngreso = (body) => {
  const { fechaDia, fechaMes, fechaAnio } = body;
  if (fechaDia && fechaMes && fechaAnio) {
    return new Date(Date.UTC(Number(fechaAnio), Number(fechaMes) - 1, Number(fechaDia)));
  }
  return undefined;
};

const crear = async (req, res, next) => {
  try {
    const errores = validarEmpleado(req.body);
    if (errores) {
      if (req.accepts("json") && !req.accepts("html")) return res.status(400).json({ errores });
      const { empresaId } = req.params;
      const empresa = await Empresa.findById(empresaId);
      const empleados = await Empleado.find({ empresaId });
      return res.status(400).render("empleados/index", { empleados, empresa, empresaId, errores, modalAbierto: "modal-nuevo" });
    }

    const { empresaId } = req.params;
    const fechaIngreso = parseFechaIngreso(req.body);
    const empleado = new Empleado({ ...req.body, empresaId, ...(fechaIngreso && { fechaIngreso }) });
    await empleado.save();
    res.redirect(`/empresas/${empresaId}/empleados`);
  } catch (error) {
    next(error);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const errores = validarEmpleado(req.body);
    if (errores) {
      if (req.accepts("json") && !req.accepts("html")) return res.status(400).json({ errores });
      const { empresaId } = req.params;
      const empleado = await Empleado.findById(req.params.id);
      const empresa = await Empresa.findById(empresaId);
      const liquidaciones = await Liquidacion.find({ empleadoId: req.params.id, empresaId }).sort({ periodo: -1, createdAt: -1 });
      return res.status(400).render("empleados/detail", {
        empleado,
        empresa,
        empresaId,
        liquidaciones,
        errores,
        modalAbierto: "modal-editar",
      });
    }

    const { empresaId } = req.params;
    const activo = req.body.activo === "on";
    const fechaIngreso = parseFechaIngreso(req.body);
    const empleado = await Empleado.findByIdAndUpdate(
      req.params.id,
      { ...req.body, activo, ...(fechaIngreso && { fechaIngreso }) },
      { new: true, runValidators: true }
    );

    if (!empleado) {
      if (req.accepts("json") && !req.accepts("html")) return res.status(404).json({ error: "Empleado no encontrado" });
      return res.status(404).render("404", { mensaje: "Empleado no encontrado" });
    }

    res.redirect(`/empresas/${empresaId}/empleados/${req.params.id}`);
  } catch (error) {
    next(error);
  }
};

const eliminar = async (req, res, next) => {
  try {
    const { empresaId } = req.params;
    const empleado = await Empleado.findByIdAndDelete(req.params.id);

    if (!empleado) {
      if (req.accepts("json") && !req.accepts("html")) return res.status(404).json({ error: "Empleado no encontrado" });
      return res.status(404).render("404", { mensaje: "Empleado no encontrado" });
    }

    res.redirect(`/empresas/${empresaId}/empleados`);
  } catch (error) {
    next(error);
  }
};

const listar = async (req, res, next) => {
  try {
    const { empresaId } = req.params;
    const empresa = await Empresa.findById(empresaId);

    if (!empresa) {
      if (req.accepts("json") && !req.accepts("html")) return res.status(404).json({ error: "Empresa no encontrada" });
      return res.status(404).render("404", { mensaje: "Empresa no encontrada" });
    }

    const empleados = await Empleado.find({ empresaId });
    if (req.accepts("json") && !req.accepts("html")) return res.json(empleados);
    res.render("empleados/index", { empleados, empresa, empresaId });
  } catch (error) {
    next(error);
  }
};

const formularioNuevo = async (req, res, next) => {
  try {
    const { empresaId } = req.params;
    const empresa = await Empresa.findById(empresaId);

    if (!empresa) return res.status(404).render("404", { mensaje: "Empresa no encontrada" });
    res.render("empleados/form", {
      empleado: null,
      empresa,
      empresaId,
      titulo: "Nuevo Empleado",
      accion: `/empresas/${empresaId}/empleados`,
    });
  } catch (error) {
    next(error);
  }
};

const formularioEditar = async (req, res, next) => {
  try {
    const { empresaId } = req.params;
    const empleado = await Empleado.findById(req.params.id);

    if (!empleado) return res.status(404).render("404", { mensaje: "Empleado no encontrado" });

    const empresa = await Empresa.findById(empresaId);
    res.render("empleados/form", {
      empleado,
      empresa,
      empresaId,
      titulo: "Editar Empleado",
      accion: `/empresas/${empresaId}/empleados/${empleado._id}/editar`,
    });
  } catch (error) {
    next(error);
  }
};

const ver = async (req, res, next) => {
  try {
    const { empresaId } = req.params;
    const empleado = await Empleado.findById(req.params.id);

    if (!empleado) {
      if (req.accepts("json") && !req.accepts("html")) return res.status(404).json({ error: "Empleado no encontrado" });
      return res.status(404).render("404", { mensaje: "Empleado no encontrado" });
    }

    const [empresa, liquidaciones] = await Promise.all([
      Empresa.findById(empresaId),
      Liquidacion.find({ empleadoId: empleado._id, empresaId }).sort({ periodo: -1, createdAt: -1 }),
    ]);
    if (req.accepts("json") && !req.accepts("html")) return res.json(empleado);
    res.render("empleados/detail", { empleado, empresa, empresaId, liquidaciones });
  } catch (error) {
    next(error);
  }
};

module.exports = { crear, actualizar, eliminar, listar, ver, formularioNuevo, formularioEditar };
