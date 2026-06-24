const { Router } = require("express");
const ctrl = require("../controllers/empresa.controller");
const empleadoRoutes = require("./empleado.routes");
const liquidacionRoutes = require("./liquidacion.routes");
const { requireRole } = require("../middlewares/requireRole");

const router = Router();

router.get("/", ctrl.listar);
router.get("/liquidaciones", ctrl.listarEmpresasParaLiquidaciones);
router.get("/nueva", ctrl.formularioNueva);
router.get("/:id", ctrl.ver);
router.get("/:id/editar", ctrl.formularioEditar);
router.post("/", ctrl.crear);
router.post("/:id/editar", ctrl.actualizar);
router.post("/:id/eliminar", requireRole(["admin"]), ctrl.eliminar);

router.use("/:empresaId/empleados", empleadoRoutes);
router.use("/:empresaId", liquidacionRoutes);

module.exports = router;
