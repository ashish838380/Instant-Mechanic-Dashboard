const express = require("express");

const { getMechanics } = require("../controllers/mechanicController");

const router = express.Router();

router.get("/", getMechanics);

module.exports = router;