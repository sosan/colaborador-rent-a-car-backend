const express = require('express');

// Controladores
const { showIndex } = require("../controllers/showIndex");
const { postFormIndex } = require("../controllers/postFormIndex");
const { getFormIndex } = require("../controllers/getFormIndex");

const router = express.Router();

router.get("/", async (req, res) => await showIndex(req, res));
router.post("/api", async (req, res) => await postFormIndex(req, res));
router.get("/api", async(req, res) => await getFormIndex(req, res));

module.exports = router;