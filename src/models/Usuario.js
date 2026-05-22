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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Usuario", usuarioSchema);