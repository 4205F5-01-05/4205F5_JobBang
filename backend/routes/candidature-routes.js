// --- IMPORTS ---
const express = require("express");
const candidatureController = require("../controllers/candidature-controller");
const checkAuth = require("../middleware/check-auth");
const upload = require("../middleware/file-upload");

// --- ROUTES ---
const router = express.Router();

router.get("/", candidatureController.getAllCandidature);
router.post("/:joId/postuler", upload.single("cvFile"), candidatureController.createCandidature);

// Routes accessibles seulement si connecté
router.use(checkAuth);
router.get("/:joId", candidatureController.getAllCandidatureFromOffer);

// --- EXPORTS ---
module.exports = router;
