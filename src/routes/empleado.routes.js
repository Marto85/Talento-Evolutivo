const { Router } = require("express");
const ctrl = require("../controllers/empleado.controller");

const router = Router();

router.get("/", ctrl.listar);
router.get("/nuevo", ctrl.formularioNuevo);
router.post("/", ctrl.crear);
router.get("/:id/editar", ctrl.formularioEditar);
router.post("/:id/editar", ctrl.actualizar);
router.post("/:id/eliminar", ctrl.eliminar);

module.exports = router;
