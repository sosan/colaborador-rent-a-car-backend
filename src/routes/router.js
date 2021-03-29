const express = require('express');

// Controladores
const { showIndex } = require("../controllers/showIndex");
const { postLogin } = require("../controllers/postLogin");
const { getLogin } = require("../controllers/getLogin");

const router = express.Router();

router.get("/", async (req, res) => await showIndex(req, res));
router.get("/login", async(req, res) => await getLogin(req, res));
router.post("/login", async (req, res) => await postLogin(req, res));

module.exports = router;