const PORCENTAJES = {
  jubilacion: 0.11,
  obraSocial: 0.03,
  sindicato: 0.03,
  art: 0.03,
};

const formatearMoneda = (valor) => {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return "$0,00";
  return numero.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
};

const obtenerPeriodo = (periodoQuery) => {
  if (typeof periodoQuery === "string" && /^\d{4}-\d{2}$/.test(periodoQuery)) {
    const [anio, mes] = periodoQuery.split("-");
    return `${anio}-${mes}`;
  }

  const now = new Date();
  const anio = now.getFullYear();
  const mes = String(now.getMonth() + 1).padStart(2, "0");
  return `${anio}-${mes}`;
};

const calcularLiquidacion = ({ salarioBase, bonificaciones = 0, descuentosExtras = 0 }) => {
  const bruto = Number(salarioBase) + Number(bonificaciones || 0);
  const jubilacion = bruto * PORCENTAJES.jubilacion;
  const obraSocial = bruto * PORCENTAJES.obraSocial;
  const sindicato = bruto * PORCENTAJES.sindicato;
  const art = bruto * PORCENTAJES.art;
  const descuentosObligatorios = jubilacion + obraSocial + sindicato + art;
  const descuentosTotales = descuentosObligatorios + Number(descuentosExtras || 0);
  const neto = bruto - descuentosTotales;
  const aportePatronal = bruto * 0.20;

  return {
    bruto,
    descuentos: {
      jubilacion,
      obraSocial,
      sindicato,
      art,
      extras: Number(descuentosExtras || 0),
    },
    descuentosTotales,
    neto,
    aportePatronal,
    periodos: {
      actual: obtenerPeriodo(),
    },
    format: {
      salarioBase: formatearMoneda(salarioBase),
      bonificaciones: formatearMoneda(bonificaciones),
      bruto: formatearMoneda(bruto),
      jubilacion: formatearMoneda(jubilacion),
      obraSocial: formatearMoneda(obraSocial),
      sindicato: formatearMoneda(sindicato),
      art: formatearMoneda(art),
      descuentosExtras: formatearMoneda(descuentosExtras),
      descuentosTotales: formatearMoneda(descuentosTotales),
      neto: formatearMoneda(neto),
      aportePatronal: formatearMoneda(aportePatronal),
    },
  };
};

const calcularLiquidacionesPorEmpresa = (empleados, periodo) => {
  const liquidaciones = empleados.map((empleado) => {
    const calculo = calcularLiquidacion({ salarioBase: empleado.salarioBase });
    return {
      empleado: {
        id: empleado.id || empleado._id,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        dni: empleado.dni,
        puesto: empleado.puesto,
      },
      periodo,
      ...calculo,
    };
  });

  const totales = liquidaciones.reduce(
    (acum, item) => {
      acum.empleados += 1;
      acum.bruto += item.bruto;
      acum.descuentos += item.descuentosTotales;
      acum.neto += item.neto;
      return acum;
    },
    { empleados: 0, bruto: 0, descuentos: 0, neto: 0 }
  );

  return {
    liquidaciones,
    totales: {
      empleados: totales.empleados,
      bruto: formatearMoneda(totales.bruto),
      descuentos: formatearMoneda(totales.descuentos),
      neto: formatearMoneda(totales.neto),
    },
  };
};

module.exports = {
  calcularLiquidacion,
  calcularLiquidacionesPorEmpresa,
  formatearMoneda,
  obtenerPeriodo,
};
