// --- IMPORTS ---
const RECRUITERS = require("../models/Recruiters");
const HttpError = require("../util/http-error");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// --- GET ALL RECRUITERS ---
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

// --- GET SPECIFIC RECRUITER ---
const getRecruiterById = async (req, res, next) => {
  const rId = req.params.rId;
  let recruiter;
  try {
    recruiter = await RECRUITERS.findById(rId);
  } catch (e) {
    console.log(e);
    return next(
      new HttpError("Échec lors de la récupération de l'utilisateur", 500)
    );
  }

  if (!recruiter) {
    return next(
      new HttpError(`Le recruteur d'id ${rId} n'a pas été trouvé.`, 404)
    );
  }

  res.json({ recruiter: recruiter.toObject({ getters: true }) });
};

// --- INSCRIPTION ---
const registerRecruiter = async (req, res, next) => {
  const { name, company, phone, email, mdp, companyAddress } = req.body;

  let existingRecruiter;
  try {
    // Vérifier si l'email est déjà utilisé
    existingRecruiter = await RECRUITERS.findOne({ email: email });
  } catch (e) {
    console.log(e);
    return next(
      new HttpError("Erreur lors de la validation du courriel.", 500)
    );
  }

  if (existingRecruiter) {
    return next(new HttpError("L'adresse courriel est déjà utilisée.", 422));
  }

  // Si email valide
  const companyAddressValide = companyAddress || "Aucune adresse enregistrée";

  const createdRecruiter = new RECRUITERS({
    name,
    company,
    phone,
    email,
    mdp,
    companyAddress: companyAddressValide,
  });
  console.log(`Recruteur inscrit: ${createdRecruiter}`);

  try {
    await createdRecruiter.save();
  } catch (e) {
    console.log(e);
    return next(
      new HttpError("Échec lors de l'inscription du recruteur.", 500)
    );
  }

  // Connexion
  let token;
  try {
    token = jwt.sign(
      {
        _id: createdRecruiter.id,
        email: createdRecruiter.email,
        company: createdRecruiter.company,
      },
      "JaiFes,Cqcl!",
      { expiresIn: "24h" }
    );
  } catch (e) {
    console.log("Connexion échouée suite à l'inscription.");
    console.log(e);
  }

  res.status(201).json({
    recruiter: createdRecruiter.toObject({ getters: true }),
    token: token,
  });
};

// --- CONNEXION ---
const loginRecruiter = async (req, res, next) => {
  const { email, company, mdp } = req.body;

  let existingRecruiter;
  try {
    existingRecruiter = await RECRUITERS.findOne({ email: email });
  } catch (e) {
    console.log(e);
    return next(
      new HttpError("Erreur lors de la validation du courriel.", 500)
    );
  }

  // Vérification des credentials
  if (
    !existingRecruiter ||
    existingRecruiter.mdp !== mdp ||
    existingRecruiter.company !== company
  ) {
    return next(
      new HttpError(
        "Connexion échouée, veuillez vérifier vos identifiants.",
        401
      )
    );
  } else {
    // Bons credentials
    let token;
    try {
      token = jwt.sign(
        {
          _id: existingRecruiter.id,
          email: existingRecruiter.email,
          company: existingRecruiter.company,
        },
        "JaiFes,Cqcl!",
        { expiresIn: "24h" }
      );
    } catch (e) {
      console.log(e);
      return next(new HttpError("La connexion a échoué.", 500));
    }

    res.status(201).json({
      _id: existingRecruiter.id,
      email: existingRecruiter.email,
      company: existingRecruiter.company,
      token: token,
    });
  }
};

// --- MODIFICATION ---
const updateRecruiter = async (req, res, next) => {
  const rId = req.params.rId;
  const { name, company, phone, email, mdp, companyAddress } = req.body;

  let recruiter;

  try {
    recruiter = await RECRUITERS.findById(rId);
  } catch (e) {
    console.log(e);
    return next(
      new HttpError("Échec lors de la récupération du recruteur", 500)
    );
  }

  if (!recruiter) {
    return next(
      new HttpError(`Le recruteur d'id ${rId} n'a pas été trouvé.`, 404)
    );
  }

  recruiter.name = name;
  recruiter.company = company;
  recruiter.phone = phone;
  recruiter.email = email;
  recruiter.mdp = mdp;
  recruiter.companyAddress = companyAddress;

  try {
    await recruiter.save();
  } catch (e) {
    console.log(e);
    return next(
      new HttpError("Échec lors de la mise à jour du recruteur", 500)
    );
  }

  res.json({ recruiter: recruiter.toObject({ getters: true }) });
};

// --- SUPPRESSION ---
const deleteRecruiter = async (req, res, next) => {
  const rId = req.params.rId;

  let recruiter;

  try {
    recruiter = await RECRUITERS.findById(rId);
  } catch (e) {
    console.log(e);
    return next(
      new HttpError("Échec lors de la récupération du recruteur", 500)
    );
  }

  if (!recruiter) {
    return next(
      new HttpError(`Le recruteur d'id ${rId} n'a pas été trouvé.`, 404)
    );
  }

  try {
    await recruiter.remove();
  } catch (e) {
    console.log(e);
    return next(
      new HttpError("Échec lors de la suppression du recruteur", 500)
    );
  }

  res.json({ message: "Recruteur supprimé." });
};

// --- EXPORTS ---
exports.getAllRecruiters = getAllRecruiters;
exports.getRecruiterById = getRecruiterById;

exports.registerRecruiter = registerRecruiter;
exports.loginRecruiter = loginRecruiter;
exports.updateRecruiter = updateRecruiter;
exports.deleteRecruiter = deleteRecruiter;
