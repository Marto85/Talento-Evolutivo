const mongoose = require("mongoose");

const empresaSchema = new mongoose.Schema(
  {
    razonSocial: {
      type: String,
      required: [true, "razonSocial es obligatorio"],
      trim: true,
      minlength: [1, "razonSocial no puede estar vacío"],
    },
    cuit: {
      type: String,
      required: [true, "cuit es obligatorio"],
      trim: true,
      match: [/^\d{2}-\d{7,8}-\d{1}$/, "cuit debe tener formato XX-XXXXXXXX-X (ej: 30-12345678-9)"],
      unique: true,
    },
    contacto: {
      type: String,
      required: [true, "contacto es obligatorio"],
      trim: true,
      minlength: [1, "contacto no puede estar vacío"],
    },
    email: {
      type: String,
      required: [true, "email es obligatorio"],
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "email no tiene un formato válido"],
      unique: true,
    },
    activa: {
      type: Boolean,
      default: true,
    },
    fechaAlta: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Empresa", empresaSchema);
