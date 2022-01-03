require('dotenv').config();

const express = require('express');

// Controladores
const { showIndex } = require("../controllers/showIndex");
const login = require("../controllers/login");
const confirmar = require("../controllers/confirmarReserva");
const dashboard = require("../controllers/dashboard");
const templates = require("../controllers/templates");
const traducciones = require("../controllers/traducciones");
const logs = require("../controllers/logs");
const live = require("../controllers/live");


const router = express.Router();

// router.get("/", async (req, res) => await showIndex(req, res));
router.get(process.env.ENDPOINT_FRONTEND_PANEL_CONTROL, async(req, res) => await login.getLogin(req, res));
router.post(process.env.ENDPOINT_FRONTEND_PANEL_CONTROL, async (req, res) => await login.checkRegisterLogin(req, res));

// router.get("/dashboard", async (req, res) => await dashboard.GetDashboard(req, res));
router.get(`${process.env.ENDPOINT_FRONTEND_PANEL_CONTROL}/dashboard`, async (req, res) => await dashboard.GetDashboard(req, res));

router.post(`${process.env.ENDPOINT_FRONTEND_PANEL_CONTROL}/dashboard/enviocorreo`, async (req, res) => await confirmar.EnvioCorreo(req, res));
router.get(`${process.env.ENDPOINT_FRONTEND_PANEL_CONTROL}/dashboard/enviocorreo`, async (req, res) => await confirmar.RedirigirEnvioCorreo(req, res)  );

router.get(`${process.env.ENDPOINT_FRONTEND_PANEL_CONTROL}/dashboard/reservasenviadas`, async (req, res) => await confirmar.MostrarReservasEnviadas(req, res));
router.get(`${process.env.ENDPOINT_FRONTEND_PANEL_CONTROL}/dashboard/reservasnoenviadas`, async (req, res) => await confirmar.MostrarReservasNoEnviadas(req, res));
router.post(`${process.env.ENDPOINT_FRONTEND_PANEL_CONTROL}/dashboard/borrarreserva`, async (req, res) => await confirmar.BorrarReserva(req, res));


router.post(`${process.env.ENDPOINT_FRONTEND_PANEL_CONTROL}/dashboard/busquedareservasporfecha`, async (req, res) => await confirmar.MostrarReservasPorFecha(req, res));
router.get(`${process.env.ENDPOINT_FRONTEND_PANEL_CONTROL}/dashboard/confirmaciones`, async (req, res) => await confirmar.MostrarConfirmaciones(req, res));
router.get(`${process.env.ENDPOINT_FRONTEND_PANEL_CONTROL}/dashboard/confirmar`, async (req, res) => await confirmar.MostrarReservas(req, res) );

router.get(`${process.env.ENDPOINT_FRONTEND_PANEL_CONTROL}/dashboard/templates`, async (req, res) => await templates.GetMainTemplates(req, res));
router.post(`${process.env.ENDPOINT_FRONTEND_PANEL_CONTROL}/dashboard/mostrartemplate`, async (req, res) => await templates.MostrarTemplate(req, res));
router.post(`${process.env.ENDPOINT_FRONTEND_PANEL_CONTROL}/dashboard/mostrardetalletemplate`, async (req, res) => await templates.DetalleTemplate(req, res));

router.get(`${process.env.ENDPOINT_FRONTEND_PANEL_CONTROL}/dashboard/traducciones`, async (req, res) => await traducciones.GetTraducciones(req, res));
router.post(`${process.env.ENDPOINT_FRONTEND_PANEL_CONTROL}/dashboard/guardartraducciones`, async (req, res) => await traducciones.GuardarTraducciones(req, res));



router.get(`${process.env.ENDPOINT_FRONTEND_PANEL_CONTROL}/islive_0_QJFs_a_IiW_mFtZS2_f_A_BQ_NTib_Y3O6Ik_D0WNH9I`, async (req, res) => await live.IsLive(req, res));

router.get(`${process.env.ENDPOINT_FRONTEND_PANEL_CONTROL}/dashboard/xxxxx`, async (req, res) => await dashboard.RedirectGetDashboard(req, res));

router.get(`${process.env.ENDPOINT_FRONTEND_PANEL_CONTROL}/dashboard/logs`, async (req, res) => await logs.GetMainLogs(req, res));

module.exports = router;


