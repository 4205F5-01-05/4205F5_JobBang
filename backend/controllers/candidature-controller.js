// --- IMPORTS ---
const CANDIDATURE = require ("../models/Candidatures");
const HttpError = require("../util/http-error");

// --- GET ALL CANDIDATURES ---
const getAllCandidature = async (req, res, next) => {
    let candidatures;

    try {
        candidatures = await CANDIDATURE.find();
    } catch (e) {
        console.log(e);
        return next(new HttpError("Échec lors de la récupération des candidatures", 500));
    }

    if (!candidatures || candidatures.length === 0) {
        return res.status(200).json({ message: "Aucune candidature pour le moment." });
    }

    res.json({ candidatures: candidatures.map((c) => c.toObject({ getters: true })), });
};

// GET CANDIDATURE BY ID
const getCandidatureById = async (req, res, next) => {
    const cId = req.params.cId;

    let candidature;
    try {
        candidature = await CANDIDATURE.findById(cId);
    } catch (e) {
        console.log(e);
        return next(new HttpError("Échec lors de la récupération de la candidature.", 500));
    }

    if (!candidature) {
        return next(new HttpError(`"Candidature ${cId} introuvable."`, 404));
    }

    res.json({ candidature: candidature.toObject({ getters: true }) });
};

// --- GET ALL CANDIDATURES FROM OFFER ---
const getAllCandidatureFromOffer = async (req, res, next) => {
    const joId = req.params.joId;

    let candidatures;
    try {
        candidatures = await CANDIDATURE.find({ joId: joId });
    } catch (e) {
        console.log(e);
        return next(new HttpError("Échec lors de la récupération des candidatures", 500));
    }

    if (candidatures.length === 0) {
        return res.status(200).json({ message: "Aucune candidature pour le moment." });
    }
    else if (!candidatures) {
        return next(new HttpError(`L'offre d'emploi d'id ${joId} n'a pas été trouvé.`, 404));
    }

    res.json({ candidatures: candidatures.map((c) => c.toObject({ getters: true })) });
};

// --- GET ALL CANDIDATURES FROM EMPLOYEE ---
const getAllCandidatureFromEmployee = async (req, res, next) => {
    const eId = req.params.eId;

    let candidatures;
    try {
        candidatures = await CANDIDATURE.find({ eId: eId });
    } catch (e) {
        console.log(e);
        return next(new HttpError("Échec lors de la récupération des candidatures", 500));
    }

    if (candidatures.length === 0) {
        return res.status(200).json({ message: "Aucune candidature pour le moment." });
    }
    else if (!candidatures) {
        return next(new HttpError(`L'employé d'id ${eId} n'a pas été trouvé.`, 404));
    }

    res.json({ candidatures: candidatures.map((c) => c.toObject({ getters: true })) });
};

// --- CREATE CANDIDATURE ---
const createCandidature = async (req, res, next) => {
    const { eId, nomEmploye, telEmploye, emailEmploye } = req.body;
    const joId = req.params.joId;
    const cvFile = req.file ? req.file.path : null;

    // Validate file type and size
    if (req.file) {
        const fileType = req.file.mimetype;
        const fileSize = req.file.size;

        if (fileType !== "application/pdf") {
            return next(new HttpError("Le CV doit être au format PDF.", 400));
        }
        if (fileSize > 10 * 1024 * 1024) { // 10 Mo
            return next(new HttpError("La taille du CV ne doit pas dépasser 10 Mo.", 400));
        }
    } else {
        return next(new HttpError("Veuillez soumettre un fichier CV.", 400));
    }

    // Check if the user has already applied for the same job
    let existingCandidature;
    try {
        existingCandidature = await CANDIDATURE.findOne({ eId, joId });
    } catch (e) {
        console.log(e);
        return next(new HttpError("Erreur lors de la vérification de la candidature.", 500));
    }

    if (existingCandidature) {
        return res.status(409).json({ message: "Vous avez déjà postulé pour cet emploi." });
    }

    const createdCandidature = new CANDIDATURE({
        nomEmploye,
        telEmploye,
        emailEmploye,
        cvFile,
        joId,
        eId,
    });

    try {
        await createdCandidature.save();
    } catch (e) {
        console.log(e);
        return next(new HttpError("Échec lors de la postulation.", 500));
    }

    res.status(201).json({ candidature: createdCandidature });
};

// --- DELETE CANDIDATURE ---
const deleteCandidature = async (req, res, next) => {
    const cId = req.params.cId;

    let candidature;
    try {
        candidature = await CANDIDATURE.findById(cId);
    } catch (e) {
        console.log(e);
        return next(new HttpError("Échec lors de la suppression de la candidature.", 500));
    }

    if (!candidature) {
        return next(new HttpError("Candidature introuvable.", 404));
    }

    try {
        await candidature.deleteOne({ _id: cId });
    } catch (e) {
        console.log(e);
        return next(new HttpError("Échec lors de la suppression de la candidature.", 500));
    }

    res.status(200).json({ message: "Candidature supprimée." });
};

// --- UPDATE CANDIDATURE ---
const updateCandidature = async (req, res, next) => {
    const cId = req.params.cId;
    const { nomEmploye, telEmploye, emailEmploye } = req.body;

    let candidature;
    try {
        candidature = await CANDIDATURE.findById(cId);
    } catch (e) {
        console.log(e);
        return next(new HttpError("Échec lors de la mise à jour de la candidature.", 500));
    }

    if (!candidature) {
        return next(new HttpError("Candidature introuvable.", 404));
    }

    candidature.nomEmploye = nomEmploye;
    candidature.telEmploye = telEmploye;
    candidature.emailEmploye = emailEmploye;

    try {
        await candidature.save();
    } catch (e) {
        console.log(e);
        return next(new HttpError("Échec lors de la mise à jour de la candidature.", 500));
    }

    res.status(200).json({ candidature: candidature.toObject({ getters: true }) });
};



// --- EXPORTS ---
exports.getAllCandidature = getAllCandidature;
exports.getCandidatureById = getCandidatureById;
exports.getAllCandidatureFromOffer = getAllCandidatureFromOffer;
exports.getAllCandidatureFromEmployee = getAllCandidatureFromEmployee;

exports.createCandidature = createCandidature;
exports.deleteCandidature = deleteCandidature;
exports.updateCandidature = updateCandidature;
