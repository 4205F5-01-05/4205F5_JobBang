// --- IMPORTS ---
const express = require("express");
const employeesController = require("../controllers/employees-controller");
const checkAuth = require("../middleware/check-auth");

// --- ROUTES ---
const router = express.Router();

router.get("/", employeesController.getAllEmployees);

router.post("/register", employeesController.registerEmployee);

// --- EXPORTS ---
module.exports = router;