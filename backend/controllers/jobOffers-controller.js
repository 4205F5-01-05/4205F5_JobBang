const JOBOFFERS = require("../models/JobOffers"); // Import the JobOffers model
const HttpError = require("../util/http-error"); // Import the HttpError class
const mongoose = require("mongoose"); // Import mongoose

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

  if (!jobOffers || jobOffers.length == 0) {
    return next(new HttpError("Aucune offre d'emploi trouvée...", 404));
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
  const { region, description, titre, rid } = req.body;

  const createdJobOffer = new JOBOFFERS({
    region,
    description,
    titre,
    rid,
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
  const { region, titre, description } = req.body;

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

// --- EXPORTS ---
exports.getAllJobOffers = getAllJobOffers;
exports.getJobOfferById = getJobOfferById;
exports.createJobOffer = createJobOffer;
exports.updateJobOffer = updateJobOffer;
exports.deleteJobOffer = deleteJobOffer;
// Compare this snippet from backend/routes/jobOffers-routes.js:
