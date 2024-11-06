// --- IMPORTS ---
const CANDIDATURE = require ("../models/Candidatures");
const HttpError = require("../util/http-error");
const upload = require("../middleware/file-upload");

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

const createCandidature = async (req, res, next) => {
    const { nomEmploye, telEmploye, emailEmploye } = req.body;
    const joId = req.params.joId;
    const cvFile = req.file ? req.file.path : null;

    // Check if the user has already applied for the same job
    let existingCandidature;
    try {
        existingCandidature = await CANDIDATURE.findOne({ emailEmploye, joId });
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
exports.getAllCandidatureFromOffer = getAllCandidatureFromOffer;
exports.createCandidature = createCandidature;
exports.deleteCandidature = deleteCandidature;
exports.updateCandidature = updateCandidature;
exports.getCandidatureById = getCandidatureById;
