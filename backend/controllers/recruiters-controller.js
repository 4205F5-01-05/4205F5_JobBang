// --- IMPORTS ---
const RECRUITERS = require("../models/Recruiters");
const HttpError = require("../util/http-error");
const mongoose = require("mongoose");

// test
const getAllRecruiters = async (req, res, next) => {
  let recruiters;

  try {
    recruiters = await RECRUITERS.find();

    if (!recruiters || recruiters.length == 0) {
      return next(new HttpError("Aucun employeur trouvé...", 404));
    }
  } catch (e) {
    console.log(e);
    return next(
      new HttpError("Échec lors de la récupération des recruteurs", 500)
    );
  }

  res.json({
    recruiters: recruiters.map((r) => r.toObject({ getters: true })),
  });
};

// --- EXPORTS ---
exports.getAllRecruiters = getAllRecruiters;
