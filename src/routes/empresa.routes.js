const { Router } = require("express");
const ctrl = require("../controllers/empresa.controller");
const empleadoRoutes = require("./empleado.routes");

const router = Router();

router.get("/", ctrl.listar);
router.post("/", ctrl.crear);
router.post("/:id/editar", ctrl.actualizar);
router.post("/:id/eliminar", ctrl.eliminar);

router.use("/:empresaId/empleados", empleadoRoutes);

module.exports = router;
