require('dotenv').config();

const express = require('express');

// Controladores
const { showIndex } = require("../controllers/showIndex");
const login = require("../controllers/login");
const confirmar = require("../controllers/confirmarReserva");
const dashboard = require("../controllers/dashboard");
const templates = require("../controllers/templates");

const router = express.Router();

// router.get("/", async (req, res) => await showIndex(req, res));
// router.get(process.env.ENDPOINT_FRONTEND_PANEL_CONTROL, async(req, res) => await login.getLogin(req, res));
// router.post(process.env.ENDPOINT_FRONTEND_PANEL_CONTROL, async (req, res) => await login.checkRegisterLogin(req, res));

router.get("/dashboard", async (req, res) => await dashboard.GetDashboard(req, res));

router.post("/enviocorreo", async (req, res) => await confirmar.EnvioCorreo(req, res));
router.get("/enviocorreo", async (req, res) => await confirmar.RedirigirEnvioCorreo(req, res)  );

router.get("/reservasenviadas", async (req, res) => await confirmar.MostrarReservasEnviadas(req, res));
router.get("/reservasnoenviadas", async (req, res) => await confirmar.MostrarReservasNoEnviadas(req, res));

router.post("/busquedareservasporfecha", async (req, res) => await confirmar.MostrarReservasPorFecha(req, res));
router.get("/confirmaciones", async (req, res) => await confirmar.MostrarConfirmaciones(req, res));
router.get("/confirmar", async (req, res) => await confirmar.MostrarReservas(req, res) );

router.get("/templates", async (req, res) => await templates.GetMainTemplates(req, res));
router.post("/mostrartemplate", async (req, res) => await templates.MostrarTemplate(req, res));

router.get("/xxxxx", async (req, res) => await dashboard.RedirectGetDashboard(req, res));

module.exports = router;


