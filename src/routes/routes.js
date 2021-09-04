require('dotenv').config();

const express = require('express');

// Controladores
const index = require("../controllers/showIndex");
const indexPost = require("../controllers/postFormIndex");
const indexGet = require("../controllers/getFormIndex");
const statsPost = require("../controllers/postStats");
const reservarPost = require("../controllers/postFormReservar");
const newsletter = require("../controllers/newsletter");
const location = require("../controllers/location");
const porcentajeTipoVehiculo = require("../controllers/porcentajeTipoVehiculo");
const logicVars = require("../logicinterface/logicGetVars");
const logicGetReservas = require("../logicinterface/logicGetReservas");
const logicTemplates = require("../logicinterface/logicGetTemplate");
const logicTraducciones = require("../logicinterface/logicTraducciones");
const logicStats = require("../logicinterface/logicStats");
const live = require("../controllers/live");

// ---- admin
const controlPanelLogin = require("../controllers/controlPanelLogin");
const router = express.Router();


// 
router.get("/", async (req, res) => await index.showIndex(req, res));
router.post(process.env.ENDPOINT_API_BACKEND, async (req, res) => await indexPost.postFormIndex(req, res));
router.get(process.env.ENDPOINT_API_BACKEND, async(req, res) => await indexGet.getFormIndex(req, res));

// obtener todos los vehiculos
router.post(process.env.ENDPOINT_GETALL_BACKEND, async (req, res) => await indexPost.GetAllVehicles(req, res));

router.post(process.env.ENDPOINT_GETCAR_FROM_CARD_BACKEND, async (req, res) => await indexPost.GetCarsFromCard(req, res));

//reservar de frontend a backend
router.post(process.env.ENDPOINT_REALIZAR_RESERVA_BACKEND, async (req, res) => await reservarPost.postRealizarReserva(req, res));
router.post(process.env.ENDPOINT_DESCODIFICACION_MERCHANTPARAMETERS, async (req, res) => await reservarPost.ProcesarMerchantParameters(req, res));
// no usado REST
router.post(process.env.ENDPOINT_REALIZAR_PAGO_BACKEND, async (req, res) => reservarPost.PeticionPago(req, res));

router.post(process.env.ENDPOINT_NEWSLETTER_BACKEND, async (req, res) => await newsletter.ProcesarEmail(req, res));

//inicio stat
router.post(process.env.ENDPOINT_STATS_BACKEND, async (req, res) => await statsPost.PostInitStats(req, res) );
router.post("/0LQm12kz57Lmqa_f_aMBQ", async (req, res) => await statsPost.ActualizarStats(req, res));


    
// generar html
router.post("/generar", async (req, res) => await controlPanelLogin.GenerateHMTLForGeneralConditions(req, res));
router.get("/actualizar-traduccion", async (req, res) => await controlPanelLogin.ActualizarTraducciones(req, res));

//location
// TODO: deberia ser post, cambiarlo al realizar el backoffice
router.get(process.env.ENDPOINT_LOCATION, async (req, res) => await location.GetLocations(req, res));
router.post(process.env.ENDPOINT_LOCATION, async (req, res) => await location.GetLocations(req, res));

//porcentaje
router.get(process.env.ENDPOINT_PORCENTAJE_VEHICULO, async (req, res) => await porcentajeTipoVehiculo.GetPorcentajeTipoVehiculo(req, res));


// obtener los vars para frontend
router.get(process.env.ENDPOINT_VARIABLES_FRONTEND, async (req, res) => await logicVars.GetFrontendVars(req, res));


//backoffice
// admin
router.post(
    process.env.ENDPOINT_BACKEND_PANEL_CONTROL_LOGIN_REGISTER, async (req, res) => await controlPanelLogin.PanelLoginRegister(req, res));

router.get(process.env.ENDPOINT_GET_GENERAL_STATS, async (req, res) => await logicStats.GetStats(req, res));

router.get("/reservas_noenviadas", async (req, res) => await logicGetReservas.GetReservasNotSended(req, res) );
router.get("/reservas_enviadas", async (req, res) => await logicGetReservas.GetReservasSended(req, res));
router.post("/envioCorreoConfirmacionReserva", async (req, res) => await logicGetReservas.ConfirmarReserva(req, res) );

router.post("/busquedareservasfecha", async (req, res) => await logicGetReservas.MostrarReservasPorFecha(req, res));
router.post(process.env.ENDPOINT_TEMPLATE_FRONTEND, async (req, res) => await logicTemplates.MostrarTemplate(req, res));
router.post(process.env.ENDPOINT_DETALLE_TEMPLATE_FRONTEND, async (req, res) => await logicTemplates.DetalleTemplate(req, res));

router.get(process.env.ENDPOINT_TRADUCCIONES_BACKEND, async (req, res) => await logicTraducciones.MostrarTraducciones(req, res) );
router.post(process.env.ENDPOINT_TRADUCCIONES_GUARDAR, async (req, res) => await logicTraducciones.GuardarTraducciones(req, res));
router.get(process.env.ENDPOINT_TRADUCCIONES_ACTUALIZAR, async (req, res) => await logicTraducciones.ActualizarTraducciones(req, res));


router.get(`/islive_0_QJFs_a_IiW_mFtZS2_f_A_BQ_NTib_Y3O6Ik_D0WNH9I`, async (req, res) => await live.IsLive(req, res));

module.exports = router;