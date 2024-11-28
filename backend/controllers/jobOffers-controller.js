// --- IMPORTS ---
const JOBOFFERS = require("../models/JobOffers");
const HttpError = require("../util/http-error");
const mongoose = require("mongoose");

// --- GET ALL JOB OFFERS ---
const getAllJobOffers = async (req, res, next) => {
  let jobOffers;

  try {
    jobOffers = await JOBOFFERS.find();
  } catch (e) {
    console.log(e);
    return next(
      new HttpError("Échec lors de la récupération des offres d'emploi", 500)
    );
  }

  if (!jobOffers || jobOffers.length === 0) {
    return res.status(200).json({ message: "No job offer found." });
  }

  res.json({
    jobOffers: jobOffers.map((j) => j.toObject({ getters: true })),
  });
};

// --- GET SPECIFIC JOB OFFER ---
const getJobOfferById = async (req, res, next) => {
  const jId = req.params.jId;

  let jobOffer;
  try {
    jobOffer = await JOBOFFERS.findById(jId);
  } catch (e) {
    console.log(e);
    return next(
      new HttpError("Échec lors de la récupération de l'offre d'emploi", 500)
    );
  }

  if (!jobOffer) {
    return next(
      new HttpError(`L'offre d'emploi d'id ${jId} n'a pas été trouvée.`, 404)
    );
  }

  res.json({ jobOffer: jobOffer.toObject({ getters: true }) });
};

// --- CREATE JOB OFFER ---
const createJobOffer = async (req, res, next) => {
  const { region, description, titre, rid, show } = req.body; // Ajout de `show` avec une valeur par défaut à `true`

  const createdJobOffer = new JOBOFFERS({
    region,
    description,
    titre,
    rid,
    show, // Ajoutez `show` à l'objet créé
  });

  try {
    await createdJobOffer.save();
  } catch (e) {
    console.log(e);
    return next(
      new HttpError("Échec lors de la création de l'offre d'emploi", 500)
    );
  }

  res.status(201).json({ jobOffer: createdJobOffer });
};

// --- UPDATE JOB OFFER ---
const updateJobOffer = async (req, res, next) => {
  const jId = req.params.jId;
  const { region, titre, description, show } = req.body;

  let jobOffer;
  try {
    jobOffer = await JOBOFFERS.findById(jId);
  } catch (e) {
    console.log(e);
    return next(
      new HttpError("Échec lors de la récupération de l'offre d'emploi", 500)
    );
  }

  if (!jobOffer) {
    return next(
      new HttpError(`L'offre d'emploi d'id ${jId} n'a pas été trouvée.`, 404)
    );
  }

  jobOffer.region = region;
  jobOffer.description = description;
  jobOffer.titre = titre;
  jobOffer.show = show;

  try {
    await jobOffer.save();
  } catch (e) {
    console.log(e);
    return next(
      new HttpError("Échec lors de la mise à jour de l'offre d'emploi", 500)
    );
  }

  res.json({ jobOffer: jobOffer.toObject({ getters: true }) });
};

// --- DELETE JOB OFFER ---
const deleteJobOffer = async (req, res, next) => {
  const jId = req.params.jId;

  let jobOffer;
  try {
    jobOffer = await JOBOFFERS.findById(jId);
  } catch (e) {
    console.log(e);
    return next(
      new HttpError("Échec lors de la récupération de l'offre d'emploi", 500)
    );
  }

  if (!jobOffer) {
    return next(
      new HttpError(`L'offre d'emploi d'id ${jId} n'a pas été trouvée.`, 404)
    );
  }

  try {
    await jobOffer.deleteOne({ _id: jId });
  } catch (e) {
    console.log(e);
    return next(
      new HttpError("Échec lors de la suppression de l'offre d'emploi", 500)
    );
  }

  res.json({ message: "Offre d'emploi supprimée." });
};

// --- GET ONLY VISIBLE JOB OFFERS ---
const getVisibleJobOffers = async (req, res, next) => {
  let jobOffers;

  try {
    // Filtrer les offres avec show === true
    jobOffers = await JOBOFFERS.find({ show: true });
  } catch (e) {
    console.log(e);
    return next(
      new HttpError(
        "Échec lors de la récupération des offres d'emploi visibles",
        500
      )
    );
  }

  if (!jobOffers || jobOffers.length === 0) {
    return res
      .status(200)
      .json({ message: "Aucune offre d'emploi visible trouvée." });
  }

  res.json({
    jobOffers: jobOffers.map((j) => j.toObject({ getters: true })),
  });
};

// --- EXPORTS ---
exports.getAllJobOffers = getAllJobOffers;
exports.getJobOfferById = getJobOfferById;
exports.createJobOffer = createJobOffer;
exports.updateJobOffer = updateJobOffer;
exports.deleteJobOffer = deleteJobOffer;
exports.getVisibleJobOffers = getVisibleJobOffers;
// Compare this snippet from backend/routes/jobOffers-routes.js:
