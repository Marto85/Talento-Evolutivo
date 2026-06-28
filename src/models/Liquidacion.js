const mongoose = require("mongoose");

const liquidacionSchema = new mongoose.Schema(
  {
    empleadoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
      required: [true, "empleadoId es obligatorio"],
    },
    empresaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empresa",
      required: [true, "empresaId es obligatorio"],
    },
    periodo: {
      type: String,
      required: [true, "periodo es obligatorio"],
      match: [/^\d{4}-\d{2}$/, "periodo debe tener formato YYYY-MM"],
    },
    salarioBase: {
      type: Number,
      required: [true, "salarioBase es obligatorio"],
      min: [0, "salarioBase debe ser mayor o igual a 0"],
    },
    bonificaciones: {
      type: Number,
      default: 0,
      min: [0, "bonificaciones debe ser mayor o igual a 0"],
    },
    descuentosExtras: {
      type: Number,
      default: 0,
      min: [0, "descuentosExtras debe ser mayor o igual a 0"],
    },
    bruto: { type: Number, required: true, min: [0, "bruto debe ser mayor o igual a 0"] },
    descuentos: {
      jubilacion: { type: Number, required: true, min: 0 },
      obraSocial: { type: Number, required: true, min: 0 },
      sindicato: { type: Number, required: true, min: 0 },
      art: { type: Number, required: true, min: 0 },
      extras: { type: Number, required: true, min: 0 },
    },
    descuentosTotales: { type: Number, required: true, min: 0 },
    neto: { type: Number, required: true, min: 0 },
    aportePatronal: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Liquidacion", liquidacionSchema);
