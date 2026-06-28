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

    // Prevent the last admin from demoting themself
    const requestingUserId = req.user?.id || req.user?._id;
    if (requestingUserId) {
      // Count current admins
      const adminCount = await Usuario.countDocuments({ role: 'admin' });

      // If the requesting admin is trying to change their own role and they're the only admin, block it
      if (String(requestingUserId) === String(id) && adminCount <= 1 && role !== 'admin') {
        const usuarios = await Usuario.find({}, 'user role');
        return res.status(400).render('admin/users', {
          usuarios,
          error: 'No podés desactivar tu rol de administrador mientras seas el único admin.'
        });
      }
    }

    await Usuario.findByIdAndUpdate(id, { role });
    return res.redirect('/admin/users');
  } catch (error) {
    next(error);
  }
};

module.exports = { mostrarUsuarios, cambiarRole };
