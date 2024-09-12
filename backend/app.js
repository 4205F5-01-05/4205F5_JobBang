// --- IMPORTS ---
const express = require("express");
const mongoose = require("mongoose");
const errorHandler = require("./handler/error-handler");

const recruitersRoutes = require("./routes/recruiters-routes");

// --- CRÉATION DE L'APP ---
const app = express();
app.use(express.json);

// --- ROUTES ---
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use("/api/recruiters", recruitersRoutes);

// --- GESTION ERREURS ---
app.use((req, res, next) => {
  const error = new Error("Page introuvable");
  error.code = 404;
  next(error);
});
app.use(errorHandler);

// --- DÉMARRAGE SERVEUR ---
const port = 5000;
const uri_melia = "mongodb://localhost:27017/JobBangLocal";

const uri = uri_melia;

mongoose
  .connect(uri)
  .then(() => {
    app.listen(port);
    console.log(`Connexion à la BD [${uri}] sur le port ${port} réussie.`);
  })
  .catch((e) => {
    console.log(`Connexion à la BD [${uri} sur le port ${port} échouée.]`);
    console.log(e);
  });