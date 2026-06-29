const { Router } = require("express");
const ctrl = require("../controllers/liquidacion.controller");

const router = Router({ mergeParams: true });

router.get("/liquidaciones/nueva", ctrl.mostrarNuevaLiquidacion);
router.get("/liquidaciones/guardadas", ctrl.listarLiquidacionesGuardadasEmpresa);
router.get("/liquidaciones/reporte", ctrl.generarReporteEmpresa);
router.get("/liquidaciones", ctrl.listarLiquidacionesEmpresa);
router.get("/liquidaciones/:id/recibo", ctrl.generarReciboEmpleado);
router.get("/liquidaciones/:id", ctrl.listarLiquidacionesEmpleado);
router.post("/liquidaciones/:id", ctrl.guardarLiquidacion);

module.exports = router;
