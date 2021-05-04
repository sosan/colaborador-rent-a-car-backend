const express = require('express');

// Controladores
const index = require("../controllers/showIndex");
const indexPost = require("../controllers/postFormIndex");
const indexGet = require("../controllers/getFormIndex");

const reservarPost = require("../controllers/postFormReservar");
const reservarGet = require("../controllers/getFormReservar");

// ---- admin
const controlPanelLogin = require("../controllers/controlPanelLogin");

const router = express.Router();

router.get("/", async (req, res) => await index.showIndex(req, res));
router.post("/api", async (req, res) => await indexPost.postFormIndex(req, res));
router.get("/api", async(req, res) => await indexGet.getFormIndex(req, res));

//reservar
router.post("/reservar", async (req, res) => await  reservarPost.postFormReservar(req, res));
router.get("/reservar", async (req, res) => await reservarGet.getFormReservar(req, res));


// admin
router.post("/controlpanel/login", async (req, res) => await controlPanelLogin.postContronPanelLogin(req, res) );

// generar html
router.post("/generar", async (req, res) => await controlPanelLogin.GenerateHMTLForGeneralConditions(req, res));

module.exports = router;