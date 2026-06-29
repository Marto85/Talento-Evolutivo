const Empleado = require("../models/Empleado");
const Empresa = require("../models/Empresa");
const Liquidacion = require("../models/Liquidacion");
const {
  calcularLiquidacion,
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
    const liquidacion = { empleado, empresa, periodo, ...calculo };

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

    // Buscar liquidación guardada para ese período primero
    const guardada = await Liquidacion.findOne({ empresaId, empleadoId, periodo });
    let liquidacion;
    if (guardada) {
      const calculo = calcularLiquidacion({
        salarioBase: guardada.salarioBase,
        bonificaciones: guardada.bonificaciones,
        descuentosExtras: guardada.descuentosExtras,
      });
      liquidacion = { ...calculo, empleado, empresa, periodo };
    } else {
      const calculo = calcularLiquidacion({ salarioBase: empleado.salarioBase });
      liquidacion = { ...calculo, empleado, empresa, periodo };
    }

    res.render("liquidaciones/recibo", { empresa, empleado, liquidacion, periodo, fechaPago });
  } catch (error) {
    next(error);
  }
};

// Historial de liquidaciones guardadas de la empresa
const listarLiquidacionesEmpresa = async (req, res, next) => {
  try {
    const { empresaId } = req.params;

    const empresa = await Empresa.findById(empresaId);
    if (!empresa) return res.status(404).render("404", { mensaje: "Empresa no encontrada" });

    const liquidaciones = await Liquidacion.find({ empresaId })
      .populate("empleadoId")
      .sort({ periodo: -1, createdAt: -1 });

    if (req.accepts("json") && !req.accepts("html")) return res.json(liquidaciones);
    res.render("liquidaciones/empresa", { empresa, liquidaciones });
  } catch (error) {
    next(error);
  }
};

const mostrarNuevaLiquidacion = async (req, res, next) => {
  try {
    const { empresaId } = req.params;

    const empresa = await Empresa.findById(empresaId);
    if (!empresa) return res.status(404).render("404", { mensaje: "Empresa no encontrada" });

    const empleados = await Empleado.find({ empresaId, activo: true }).sort({ apellido: 1 });

    res.render("liquidaciones/nueva", { empresa, empleados });
  } catch (error) {
    next(error);
  }
};

// Redirige guardadas → historial de empresa
const listarLiquidacionesGuardadasEmpresa = async (req, res, next) => {
  res.redirect(`/empresas/${req.params.empresaId}/liquidaciones`);
};

const generarReporteEmpresa = async (req, res, next) => {
  try {
    const { empresaId } = req.params;
    const { tipo = "mes", mes, anio } = req.query;

    const empresa = await Empresa.findById(empresaId);
    if (!empresa) return res.status(404).render("404", { mensaje: "Empresa no encontrada" });

    const ahora = new Date();
    const anioFinal = parseInt(anio) || ahora.getFullYear();
    const mesFinal = mes || String(ahora.getMonth() + 1).padStart(2, "0");

    // Calcular rango de períodos según el tipo
    const periodos = [];
    const cantMeses = { mes: 1, bimestre: 2, trimestre: 3, cuatrimestre: 4, anio: 12 }[tipo] || 1;

    if (tipo === "anio") {
      for (let m = 1; m <= 12; m++) {
        periodos.push(`${anioFinal}-${String(m).padStart(2, "0")}`);
      }
    } else {
      const mesInicio = parseInt(mesFinal);
      for (let i = 0; i < cantMeses; i++) {
        const m = mesInicio + i;
        if (m > 12) break;
        periodos.push(`${anioFinal}-${String(m).padStart(2, "0")}`);
      }
    }

    const liquidaciones = await Liquidacion.find({ empresaId, periodo: { $in: periodos } })
      .populate("empleadoId")
      .sort({ periodo: 1 });

    // Agrupar por empleado sumando períodos
    const porEmpleado = {};
    for (const liq of liquidaciones) {
      const key = String(liq.empleadoId?._id || liq.empleadoId);
      if (!porEmpleado[key]) {
        porEmpleado[key] = {
          nombre: liq.empleadoId?.nombre || "—",
          apellido: liq.empleadoId?.apellido || "",
          puesto: liq.empleadoId?.puesto || "—",
          bruto: 0,
          descuentosTotales: 0,
          neto: 0,
        };
      }
      porEmpleado[key].bruto += liq.bruto;
      porEmpleado[key].descuentosTotales += liq.descuentosTotales;
      porEmpleado[key].neto += liq.neto;
    }

    const filas = Object.values(porEmpleado);
    const totalBruto = filas.reduce((s, f) => s + f.bruto, 0);
    const totalDescuentos = filas.reduce((s, f) => s + f.descuentosTotales, 0);
    const totalNeto = filas.reduce((s, f) => s + f.neto, 0);

    const labels = { mes: "Mes", bimestre: "Bimestre", trimestre: "Trimestre", cuatrimestre: "Cuatrimestre", anio: "Año" };
    const label = tipo === "anio"
      ? `Año ${anioFinal}`
      : `${labels[tipo]} — desde ${periodos[0]} hasta ${periodos[periodos.length - 1]}`;

    const resumen = { liquidaciones: filas, cantidad: liquidaciones.length, totalBruto, totalDescuentos, totalNeto, label };

    if (req.accepts("json") && !req.accepts("html")) return res.json(resumen);
    res.render("liquidaciones/reporte", { empresa, resumen, tipo, mes: mesFinal, anio: String(anioFinal) });
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
    const { bonificaciones = 0, descuentosExtras = 0, mes, anio } = req.body;

    const empleado = await Empleado.findById(empleadoId);
    if (!empleado || empleado.empresaId.toString() !== empresaId) {
      return res.status(404).render("404", { mensaje: "Empleado no encontrado" });
    }

    const calculo = calcularLiquidacion({ salarioBase: empleado.salarioBase, bonificaciones, descuentosExtras });
    const periodoFinal = (mes && anio) ? `${anio}-${mes}` : obtenerPeriodo();

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
  mostrarNuevaLiquidacion,
  listarLiquidacionesGuardadasEmpresa,
  listarHistorialLiquidacionEmpleado,
  generarReporteEmpresa,
  guardarLiquidacion,
};
