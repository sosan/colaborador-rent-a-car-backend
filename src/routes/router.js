require('dotenv').config();

const express = require('express');

// Controladores
const { showIndex } = require("../controllers/showIndex");
const login = require("../controllers/login");

const router = express.Router();

router.get("/", async (req, res) => await showIndex(req, res));
router.get(process.env.ENDPOINT_FRONTEND_PANEL_CONTROL, async(req, res) => await login.getLogin(req, res));
router.post(process.env.ENDPOINT_FRONTEND_PANEL_CONTROL, async (req, res) => await login.checkRegisterLogin(req, res));
module.exports = router;