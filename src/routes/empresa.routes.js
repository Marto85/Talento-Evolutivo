const { Router } = require("express");
const ctrl = require("../controllers/empresa.controller");

const router = Router();

router.get("/", ctrl.listar);
router.get("/nueva", ctrl.formularioNueva);
router.post("/", ctrl.crear);
router.get("/:id/editar", ctrl.formularioEditar);
router.post("/:id/editar", ctrl.actualizar);
router.post("/:id/eliminar", ctrl.eliminar);

module.exports = router;
