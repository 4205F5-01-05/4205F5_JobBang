// --- IMPORTS ---
const express = require("express");
const mongoose = require("mongoose");
const errorHandler = require("./handler/error-handler");
const path = require("path");

const recruitersRoutes = require("./routes/recruiters-routes");
const employeesRoutes = require("./routes/employees-routes");
const jobOffersRoutes = require("./routes/jobOffers-routes");
const candidatureRoutes = require("./routes/candidature-routes");

const cors = require("cors");

// --- CRÉATION DE L'APP ---
const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads/cvs", express.static(path.join(__dirname, "uploads/cvs")));

// --- ROUTES ---
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/recruiters", recruitersRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/jobOffers", jobOffersRoutes);
app.use("/api/candidatures", candidatureRoutes);

// --- GESTION ERREURS ---
app.use((req, res, next) => {
  const error = new Error("Page introuvable");
  error.code = 404;
  next(error);
});
app.use(errorHandler);

// --- DÉMARRAGE SERVEUR ---
const port = 5000;
const uri = "mongodb+srv://admin:Jaiepabs,Cvnac...@jobbang.yb0ee.mongodb.net/?retryWrites=true&w=majority&appName=JobBang";
const uri_local = "mongodb://localhost:27017/JobBangLocal";

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
