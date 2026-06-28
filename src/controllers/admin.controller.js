const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/passport');
const { hashPassword } = require('../utils/password');

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

const crearUsuario = async (req, res, next) => {
  try {
    const user = String(req.body.user || '').trim();
    const password = String(req.body.password || '').trim();
    const confirm = String(req.body.confirm || '').trim();
    const role = String(req.body.role || 'empleado').trim();

    const errores = [];
    if (!user) errores.push('Usuario es obligatorio');
    if (!password) errores.push('Password es obligatorio');
    if (password !== confirm) errores.push('Las contraseñas no coinciden');
    if (password && password.length < 4) errores.push('La contraseña debe tener al menos 4 caracteres');
    if (!['admin', 'empleado', 'auditor'].includes(role)) errores.push('Rol inválido');

    if (errores.length > 0) {
      const usuarios = await Usuario.find({}, 'user role');
      return res.status(400).render('admin/users', { usuarios, errores, lastUser: user, modalAbierto: 'modal-nuevo-usuario' });
    }

    const hashed = await hashPassword(password);
    const nuevo = await Usuario.create({ user, password: hashed, role });

    const token = jwt.sign({ id: nuevo.id, user: nuevo.user, role: nuevo.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    nuevo.token = token;
    await nuevo.save();

    return res.redirect('/admin/users');
  } catch (error) {
    next(error);
  }
};

const eliminarUsuario = async (req, res, next) => {
  try {
    const id = req.params.id;
    const requestingUserId = String(req.user?.id || req.user?._id || '');

    if (requestingUserId && requestingUserId === String(id)) {
      const usuarios = await Usuario.find({}, 'user role');
      return res.status(400).render('admin/users', {
        usuarios,
        error: 'No podés eliminar tu propio usuario.'
      });
    }

    await Usuario.findByIdAndDelete(id);
    return res.redirect('/admin/users');
  } catch (error) {
    next(error);
  }
};

module.exports = { mostrarUsuarios, cambiarRole, crearUsuario, eliminarUsuario };
