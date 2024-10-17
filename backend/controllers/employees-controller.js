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

// --- GET SPECIFIC EMPLOYEE ---
const getEmployeeById = async (req, res, next) => {
    const eId = req.params.eId;

    let employee;
    try {
        employee = await EMPLOYEES.findById(eId);
    } catch (e) {
        console.log(e);
        return next(new HttpError("Échec lors de la récupération de l'utilisateur", 500));
    }

    if (!employee) {
        return next(new HttpError(`Le candidat d'id ${eId} n'a pas été trouvé.`, 404));
    }

    res.json({ employee: employee.toObject({ getters: true }) });
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

    // Connexion
    let token;
    try {
        token = jwt.sign(
            {
                _id: existingEmployee.id,
                email: existingEmployee.email
            },
            "JaiFes,Cqcl!",
            {expiresIn: "24h" }
        );
    } catch (e) {
        console.log(e);
        console.log("La connexion a échoué.");
    }

    res.status(201).json({
        employee: createdEmployee.toObject({ getters: true }),
        token: token,
    });
};

// --- CONNEXION ---
const loginEmployee = async (req, res, next) => {
    const { email, mdp } = req.body;

    let existingEmployee;
    try {
        existingEmployee = await EMPLOYEES.findOne({ email: email });
    } catch (e) {
        console.log(e);
        return next(new HttpError("Erreur lors de la validation du courriel.", 500));
    }

    // Vérification des credentials
    if (!existingEmployee || existingEmployee.mdp !== mdp) {
        return res.status(401).json({ message: "Connexion échouée. Vérifiez vos identifiants."});
    } else {
        // Bon credentials
        let token;
        try {
            token = jwt.sign(
                {
                    _id: existingEmployee.id,
                    email: existingEmployee.email
                },
                "JaiFes,Cqcl!",
                { expiresIn: "24h" },
            );
        } catch (e) {
            console.log(e);
            return next(new HttpError("La connexion a échoué.", 500));
        }

        res.status(201).json({
            _id: existingEmployee.id,
            email: existingEmployee.email,
            token: token,
        });
    }
};

// --- EXPORTS ---
exports.getAllEmployees = getAllEmployees;
exports.getEmployeeById = getEmployeeById;

exports.registerEmployee = registerEmployee;
exports.loginEmployee = loginEmployee;