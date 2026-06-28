const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "user es obligatorio"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password es obligatorio"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "empleado", "auditor"],
      default: "empleado",
      required: true,
      trim: true,
    },
    token: {
      type: String,
      trim: true,
      default: null,
    },
    aprobado: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Usuario", usuarioSchema);