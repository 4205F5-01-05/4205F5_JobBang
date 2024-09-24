// --- IMPORTS ---
const express = require("express");
const jobOffersController = require("../controllers/jobOffers-controller");
const checkAuth = require("../middleware/check-auth");

// Router
const router = express.Router();

// Routes
router.get("/", jobOffersController.getAllJobOffers);
router.get("/:jId", jobOffersController.getJobOfferById);

// Routes accessibles seulement si connecté
router.use(checkAuth);
router.post("/create", jobOffersController.createJobOffer);
router.patch("/:jId", jobOffersController.updateJobOffer);
router.delete("/:jId", jobOffersController.deleteJobOffer);

// --- EXPORTS ---
module.exports = router;
