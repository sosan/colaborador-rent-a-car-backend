require('dotenv').config();

const express = require('express');

// Controladores
const { showIndex } = require("../controllers/showIndex");
const login = require("../controllers/login");
const confirmar = require("../controllers/confirmarReserva");

const router = express.Router();

// router.get("/", async (req, res) => await showIndex(req, res));
// router.get(process.env.ENDPOINT_FRONTEND_PANEL_CONTROL, async(req, res) => await login.getLogin(req, res));
// router.post(process.env.ENDPOINT_FRONTEND_PANEL_CONTROL, async (req, res) => await login.checkRegisterLogin(req, res));

router.get("/confirmar", async (req, res) => await confirmar.MostrarReservas(req, res) );
router.post("/enviocorreo", async (req, res) => await confirmar.EnvioCorreo(req, res));
router.get("/enviocorreo", async (req, res) => await confirmar.RedirigirEnvioCorreo(req, res)  )

module.exports = router;