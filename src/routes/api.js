const express = require('express');

// Controladores
const { showIndex } = require("../controllers/showIndex");
const { postFormIndex } = require("../controllers/postFormIndex");
const { getFormIndex } = require("../controllers/getFormIndex");


// ---- admin
const controlPanelLogin = require("../controllers/controlPanelLogin");

const router = express.Router();

router.get("/", async (req, res) => await showIndex(req, res));
router.post("/api", async (req, res) => await postFormIndex(req, res));
router.get("/api", async(req, res) => await getFormIndex(req, res));


// admin
router.post("/controlpanel/login", async (req, res) => await controlPanelLogin.postContronPanelLogin(req, res) );

// generar html
router.post("/generar", async () =>
{



});

module.exports = router;