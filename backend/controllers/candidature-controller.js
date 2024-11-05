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
}

const createCandidature = async (req, res, next) => {
    const { nomEmploye, telEmploye, emailEmploye } = req.body;
    const joId = req.params.joId;

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

// --- EXPORTS ---
exports.getAllCandidature = getAllCandidature;
exports.getAllCandidatureFromOffer = getAllCandidatureFromOffer;
exports.createCandidature = createCandidature;