const { Router } = require('express');
const { requireRole } = require('../middlewares/requireRole');
const { requireAuth } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/admin.controller');

const router = Router();

// List users
router.get('/users', requireAuth, requireRole(['admin']), ctrl.mostrarUsuarios);
// Update role
router.post('/users/:id/role', requireAuth, requireRole(['admin']), ctrl.cambiarRole);

module.exports = router;
