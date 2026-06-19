const mongoose = require("mongoose");

const empleadoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "nombre es obligatorio"],
      trim: true,
      minlength: [1, "nombre no puede estar vacío"],
    },
    apellido: {
      type: String,
      required: [true, "apellido es obligatorio"],
      trim: true,
      minlength: [1, "apellido no puede estar vacío"],
    },
    dni: {
      type: String,
      required: [true, "dni es obligatorio"],
      trim: true,
      match: [/^\d{7,8}$/, "dni debe contener entre 7 y 8 dígitos numéricos"],
      unique: true,
    },
    empresaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empresa",
      required: [true, "empresaId es obligatorio"],
    },
    puesto: {
      type: String,
      required: [true, "puesto es obligatorio"],
      trim: true,
      minlength: [1, "puesto no puede estar vacío"],
    },
    salarioBase: {
      type: Number,
      required: [true, "salarioBase es obligatorio"],
      min: [0, "salarioBase debe ser mayor o igual a 0"],
    },
    activo: {
      type: Boolean,
      default: true,
    },
    fechaIngreso: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Empleado", empleadoSchema);