// --- IMPORTS ---
const express = require("express");
const candidatureController = require("../controllers/candidature-controller");
const checkAuth = require("../middleware/check-auth");

// --- ROUTES ---
const router = express.Router();

router.get("/", candidatureController.getAllCandidature);
router.post("/:joId/postuler", candidatureController.createCandidature);

// Routes accessibles seulement si connecté
router.use(checkAuth);
router.get("/:joId", candidatureController.getAllCandidatureFromOffer);

// --- EXPORTS ---
module.exports = router;