const { Router } = require('express');
const { requireAuth } = require('../middlewares/auth.middleware');
const Notificacion = require('../models/Notificacion');

const router = Router();

router.post('/:id/leer', requireAuth, async (req, res, next) => {
  try {
    await Notificacion.findOneAndUpdate(
      { _id: req.params.id, destinatarioId: req.user.id },
      { leido: true }
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
