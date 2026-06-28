const { Router } = require('express');
const { requireRole } = require('../middlewares/requireRole');
const { requireAuth } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/admin.controller');

const router = Router();

router.get('/users', requireAuth, requireRole(['admin']), ctrl.mostrarUsuarios);
router.post('/users/nuevo', requireAuth, requireRole(['admin']), ctrl.crearUsuario);
router.post('/users/:id/role', requireAuth, requireRole(['admin']), ctrl.cambiarRole);

module.exports = router;
