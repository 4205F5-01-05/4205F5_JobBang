// --- IMPORTS ---
const express = require("express");
const candidatureController = require("../controllers/candidature-controller");
const checkAuth = require("../middleware/check-auth");
const upload = require("../middleware/file-upload");

// --- ROUTES ---
const router = express.Router();

router.get("/", candidatureController.getAllCandidature);
router.get("/:cId", candidatureController.getCandidatureById);
router.post("/:joId/postuler", upload.single("cvFile"), candidatureController.createCandidature);
router.delete("/:cId", candidatureController.deleteCandidature);
router.patch("/:cId", candidatureController.updateCandidature);

// Routes accessibles seulement si connecté
router.use(checkAuth);
router.get("/offer/:joId", candidatureController.getAllCandidatureFromOffer);

// --- EXPORTS ---
module.exports = router;
