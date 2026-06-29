const Notificacion = require('../models/Notificacion');
const Usuario = require('../models/Usuario');

const notificarAdmins = async (app, mensaje, link = null) => {
  const admins = await Usuario.find({ role: 'admin', aprobado: true }, '_id');
  const docs = await Notificacion.insertMany(
    admins.map((a) => ({ destinatarioId: a._id, mensaje, link }))
  );

  const io = app.get('io');
  if (io) {
    docs.forEach((doc) => {
      io.to('admins').emit('notificacion', {
        id: String(doc._id),
        mensaje: doc.mensaje,
        link: doc.link,
      });
    });
  }
};

module.exports = { notificarAdmins };
