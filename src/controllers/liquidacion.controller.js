const Empleado = require("../models/Empleado");
const Empresa = require("../models/Empresa");
const Liquidacion = require("../models/Liquidacion");
const {
  calcularLiquidacion,
  calcularLiquidacionesPorEmpresa,
  obtenerPeriodo,
  formatearMoneda,
} = require("../utils/liquidacion");

const listarLiquidacionesEmpleado = async (req, res, next) => {
  try {
    const { empresaId, id: empleadoId } = req.params;
    const periodo = obtenerPeriodo(req.query.periodo);

    const empresa = await Empresa.findById(empresaId);
    if (!empresa) return res.status(404).render("404", { mensaje: "Empresa no encontrada" });

    const empleado = await Empleado.findById(empleadoId);
    if (!empleado || empleado.empresaId.toString() !== empresaId) {
      return res.status(404).render("404", { mensaje: "Empleado no encontrado" });
    }

    const calculo = calcularLiquidacion({ salarioBase: empleado.salarioBase });
    const liquidacion = {
      empleado,
      empresa,
      periodo,
      ...calculo,
    };

    if (req.accepts("json") && !req.accepts("html")) return res.json(liquidacion);
    res.render("liquidaciones/empleado", { liquidacion, empleado, empresa, periodo });
  } catch (error) {
    next(error);
  }
};

const generarReciboEmpleado = async (req, res, next) => {
  try {
    const { empresaId, id: empleadoId } = req.params;
    const periodo = obtenerPeriodo(req.query.periodo);
    const fechaPago = new Date();

    const empresa = await Empresa.findById(empresaId);
    if (!empresa) return res.status(404).render("404", { mensaje: "Empresa no encontrada" });

    const empleado = await Empleado.findById(empleadoId);
    if (!empleado || empleado.empresaId.toString() !== empresaId) {
      return res.status(404).render("404", { mensaje: "Empleado no encontrado" });
    }

    const calculo = calcularLiquidacion({ salarioBase: empleado.salarioBase });
    const liquidacion = {
      empleado,
      empresa,
      periodo,
      ...calculo,
    };

    res.render("liquidaciones/recibo", { empresa, empleado, liquidacion, periodo, fechaPago });
  } catch (error) {
    next(error);
  }
};

const listarLiquidacionesEmpresa = async (req, res, next) => {
  try {
    const { empresaId } = req.params;
    const periodo = obtenerPeriodo(req.query.periodo);

    const empresa = await Empresa.findById(empresaId);
    if (!empresa) return res.status(404).render("404", { mensaje: "Empresa no encontrada" });

    const empleados = await Empleado.find({ empresaId });
    const resumen = calcularLiquidacionesPorEmpresa(empleados, periodo);

    if (req.accepts("json") && !req.accepts("html")) return res.json(resumen);
    res.render("liquidaciones/empresa", { empresa, resumen, periodo });
  } catch (error) {
    next(error);
  }
};

const listarLiquidacionesGuardadasEmpresa = async (req, res, next) => {
  try {
    const { empresaId } = req.params;

    const empresa = await Empresa.findById(empresaId);
    if (!empresa) return res.status(404).render("404", { mensaje: "Empresa no encontrada" });

    const liquidaciones = await Liquidacion.find({ empresaId }).populate("empleadoId").sort({ periodo: -1, createdAt: -1 });

    return res.render("liquidaciones/guardadas", { empresa, liquidaciones });
  } catch (error) {
    next(error);
  }
};

const generarReporteEmpresa = async (req, res, next) => {
  try {
    const { empresaId } = req.params;
    const periodo = obtenerPeriodo(req.query.periodo);

    const empresa = await Empresa.findById(empresaId);
    if (!empresa) return res.status(404).render("404", { mensaje: "Empresa no encontrada" });

    const empleados = await Empleado.find({ empresaId });
    const resumen = calcularLiquidacionesPorEmpresa(empleados, periodo);

    if (req.accepts("json") && !req.accepts("html")) return res.json(resumen);
    res.render("liquidaciones/reporte", { empresa, resumen, periodo });
  } catch (error) {
    next(error);
  }
};

const listarHistorialLiquidacionEmpleado = async (req, res, next) => {
  try {
    const { empresaId, id: empleadoId } = req.params;

    const empresa = await Empresa.findById(empresaId);
    if (!empresa) return res.status(404).render("404", { mensaje: "Empresa no encontrada" });

    const empleado = await Empleado.findById(empleadoId);
    if (!empleado || empleado.empresaId.toString() !== empresaId) {
      return res.status(404).render("404", { mensaje: "Empleado no encontrado" });
    }

    const liquidaciones = await Liquidacion.find({ empresaId, empleadoId }).sort({ periodo: -1, createdAt: -1 });

    return res.render("liquidaciones/historial", { empresa, empleado, liquidaciones });
  } catch (error) {
    next(error);
  }
};

const guardarLiquidacion = async (req, res, next) => {
  try {
    const { empresaId, id: empleadoId } = req.params;
    const { bonificaciones = 0, descuentosExtras = 0, periodo } = req.body;

    const empleado = await Empleado.findById(empleadoId);
    if (!empleado || empleado.empresaId.toString() !== empresaId) {
      return res.status(404).render("404", { mensaje: "Empleado no encontrado" });
    }

    const calculo = calcularLiquidacion({ salarioBase: empleado.salarioBase, bonificaciones, descuentosExtras });
    const periodoFinal = periodo || obtenerPeriodo();

    const liquidacion = new Liquidacion({
      empleadoId,
      empresaId,
      periodo: periodoFinal,
      salarioBase: empleado.salarioBase,
      bonificaciones: Number(bonificaciones),
      descuentosExtras: Number(descuentosExtras),
      bruto: calculo.bruto,
      descuentos: calculo.descuentos,
      descuentosTotales: calculo.descuentosTotales,
      neto: calculo.neto,
      aportePatronal: calculo.aportePatronal,
    });

    await liquidacion.save();
    res.redirect(`/empresas/${empresaId}/empleados/${empleadoId}`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarLiquidacionesEmpleado,
  generarReciboEmpleado,
  listarLiquidacionesEmpresa,
  listarLiquidacionesGuardadasEmpresa,
  listarHistorialLiquidacionEmpleado,
  generarReporteEmpresa,
  guardarLiquidacion,
};
