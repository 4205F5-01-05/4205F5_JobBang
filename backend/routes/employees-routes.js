// --- IMPORTS ---
const express = require("express");
const employeesController = require("../controllers/employees-controller");
const checkAuth = require("../middleware/check-auth");

// --- ROUTES ---
const router = express.Router();

router.get("/", employeesController.getAllEmployees);

router.post("/register", employeesController.registerEmployee);
router.post("/login", employeesController.loginEmployee);

// Routes accessibles seulement si connecté
router.use(checkAuth);

router.get("/:eId", employeesController.getEmployeeById);
router.patch("/:eId", employeesController.updateEmployee);

// --- EXPORTS ---
module.exports = router;