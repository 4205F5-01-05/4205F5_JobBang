// --- IMPORTS ---
const express = require("express");
const recruitersController = require("../controllers/recruiters-controller");
const checkAuth = require("../middleware/check-auth");

// --- ROUTES ---
const router = express.Router();

router.post("/register", recruitersController.registerRecruiter);
router.post("/login", recruitersController.loginRecruiter);

router.get("/", recruitersController.getAllRecruiters);

// Routes accessibles seulement si connecté
router.use(checkAuth);
router.get("/:rId", recruitersController.getRecruiterById);

// --- EXPORTS ---
module.exports = router;
