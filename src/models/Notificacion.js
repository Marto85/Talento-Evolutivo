const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema(
  {
    destinatarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    mensaje: { type: String, required: true },
    link: { type: String, default: null },
    leido: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notificacion', notificacionSchema);
