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

// ---- admin
const controlPanelLogin = require("../controllers/controlPanelLogin");
const router = express.Router();


// 
router.get("/", async (req, res) => await index.showIndex(req, res));
router.post("/api", async (req, res) => await indexPost.postFormIndex(req, res));
router.get("/api", async(req, res) => await indexGet.getFormIndex(req, res));

// obtener todos los vehiculos
router.post(process.env.ENDPOINT_GETALL_BACKEND, async (req, res) => await indexPost.GetAllVehicles(req, res));

//reservar de frontend a backend
router.post(process.env.ENDPOINT_REALIZAR_RESERVA_BACKEND, async (req, res) => await reservarPost.postRealizarReserva(req, res));

router.post(process.env.ENDPOINT_NEWSLETTER_BACKEND, async (req, res) => await newsletter.ProcesarEmail(req, res));

//inicio stat
router.post(process.env.ENDPOINT_STATS_BACKEND, async (req, res) => await statsPost.PostInitStats(req, res) );
router.post("/0LQm12kz57Lmqa_f_aMBQ", async (req, res) => await statsPost.ActualizarStats(req, res));



// admin
router.post(
    process.env.ENDPOINT_BACKEND_PANEL_CONTROL_LOGIN_REGISTER, async (req, res) => await controlPanelLogin.PanelLoginRegister(req, res) );
    
    
// generar html
router.post("/generar", async (req, res) => await controlPanelLogin.GenerateHMTLForGeneralConditions(req, res));

//location
// TODO: deberia ser post, cambiarlo al realizar el backoffice
router.get(process.env.ENDPOINT_LOCATION, async (req, res) => await location.GetLocations(req, res));
router.post(process.env.ENDPOINT_LOCATION, async (req, res) => await location.GetLocations(req, res));

//porcentaje
router.get(process.env.ENDPOINT_PORCENTAJE_VEHICULO, async (req, res) => await porcentajeTipoVehiculo.GetPorcentajeTipoVehiculo(req, res));


// obtener los vars para frontend
router.post(process.env.ENDPOINT_VARIABLES_FRONTEND, async (req, res) => await logicVars.GetFrontendVars(req, res));


module.exports = router;