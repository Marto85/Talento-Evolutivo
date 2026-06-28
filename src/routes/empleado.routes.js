const { Router } = require("express");
const ctrl = require("../controllers/empleado.controller");
const liquidacionCtrl = require("../controllers/liquidacion.controller");
const { requireRole } = require("../middlewares/requireRole");

const router = Router({ mergeParams: true });

router.get("/", ctrl.listar);
router.get("/nuevo", ctrl.formularioNuevo);
router.get("/:id", ctrl.ver);
router.get("/:id/editar", ctrl.formularioEditar);
router.get("/:id/liquidaciones", liquidacionCtrl.listarHistorialLiquidacionEmpleado);
router.post("/", ctrl.crear);
router.post("/:id/editar", ctrl.actualizar);
router.post("/:id/eliminar", requireRole(["admin"]), ctrl.eliminar);

module.exports = router;
