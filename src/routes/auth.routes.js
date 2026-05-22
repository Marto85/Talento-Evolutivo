const { Router } = require("express");
const ctrl = require("../controllers/auth.controller");

const router = Router();

router.get("/login", ctrl.mostrarLogin);
router.post("/login", ctrl.login);

module.exports = router;