// --- IMPORTS ---
const express = require("express");
const recruitersController = require("../controllers/recruiters-controller");
const checkAuth = require("../middleware/check-auth");

// --- ROUTES ---
const router = express.Router();

router.get("/", recruitersController.getAllRecruiters);

// --- EXPORTS ---
module.exports = router;
