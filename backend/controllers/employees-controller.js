// --- IMPORTS ---
const EMPLOYEES = require("../models/Employees");
const HttpError = require("../util/http-error");
const jwt = require("jsonwebtoken");

// --- GET ALL EMPLOYEES ---
const getAllEmployees = async (req, res, next) => {
    let employees;

    try {
        employees = await EMPLOYEES.find();

        if (!employees || employees.length == 0) {
            return next(new HttpError("Aucun candidat trouvé...", 404));
        }
    } catch (e) {
        console.log(e);
        return next(new HttpError("Échec lors de la récupération des candidats", 500));
    }

    res.json({
        employees: employees.map(e => e.toObject({ getters: true })),
    });
};

// --- INSCRIPTION ---
const registerEmployee = async (req, res, next) => {
    const { name, phone, email, mdp, homeAddress } = req.body;

    let existingEmployee;
    try {
        // Vérifier si l'email est déjà utilisé
        existingEmployee = await EMPLOYEES.findOne({ email: email });
    } catch (e) {
        console.log(e);
        return next(new HttpError("Erreur lors de la validation du courriel.", 500));
    }

    if (existingEmployee) {
        return next(new HttpError(`L'adresse courriel ${email} est déjà utilisée.`, 422));
    }

    // Si email valide
    const homeAddressValide = homeAddress || "Aucune adresse enregistrée";

    const createdEmployee = new EMPLOYEES({
        name,
        phone,
        email,
        mdp,
        homeAddress: homeAddressValide,
    });
    console.log(`Employé inscrit: ${createdEmployee}`);

    // Enregistrer dans la BD
    try {
        await createdEmployee.save();
    } catch(e) {
        console.log(e);
        return next(new HttpError("Échec lors de l'inscription du candidat.", 500));
    }

    // TODO: Connexion
}

// --- EXPORTS ---
exports.getAllEmployees = getAllEmployees;

exports.registerEmployee = registerEmployee;