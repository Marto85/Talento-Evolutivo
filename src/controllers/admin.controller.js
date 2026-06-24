const Usuario = require('../models/Usuario');

const mostrarUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.find({}, 'user role');
    return res.render('admin/users', { usuarios });
  } catch (error) {
    next(error);
  }
};

const cambiarRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    const role = String(req.body.role || '').trim();
    if (!['admin', 'empleado', 'auditor'].includes(role)) {
      return res.status(400).render('404', { mensaje: 'Rol inválido' });
    }

    await Usuario.findByIdAndUpdate(id, { role });
    return res.redirect('/admin/users');
  } catch (error) {
    next(error);
  }
};

module.exports = { mostrarUsuarios, cambiarRole };
