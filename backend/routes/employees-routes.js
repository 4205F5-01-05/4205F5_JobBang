// --- IMPORTS ---
const express = require("express");
const employeesController = require("../controllers/employees-controller");
const checkAuth = require("../middleware/check-auth");

// --- ROUTES ---
const router = express.Router();

// Middleware to restrict access to employees only
const restrictToEmployees = (req, res, next) => {
    if (req.userData && req.userData.isEmployer) {
      return res.status(403).json({ message: "Access forbidden: Recruiter access not allowed on this route." });
    }
    next();
  };

router.get("/", employeesController.getAllEmployees);

router.post("/register", employeesController.registerEmployee);
router.post("/login", employeesController.loginEmployee);

// Routes accessibles seulement si connecté
router.use(checkAuth);
router.get("/:eId", employeesController.getEmployeeById);

// --- EXPORTS ---
module.exports = router;