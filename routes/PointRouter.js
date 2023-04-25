const express = require('express');
const router = express.Router();

const PointController = require("../controllers/PointController")

router.get("/", PointController.listarPontos)
router.get("/sincronizar", PointController.sincronizar)
router.post("/", PointController.salvarPonto)

module.exports = router;