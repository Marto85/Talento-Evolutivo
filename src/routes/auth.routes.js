const { Router } = require("express");
const ctrl = require("../controllers/auth.controller");

const router = Router();

router.get("/login", ctrl.mostrarLogin);
router.post("/login", ctrl.login);
router.post("/logout", ctrl.logout);

module.exports = router;