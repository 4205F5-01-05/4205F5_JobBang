// --- IMPORTS ---
const express = require("express");
const mongoose = require("mongoose");
const errorHandler = require("./handler/error-handler");

const recruitersRoutes = require("./routes/recruiters-routes");
const employeesRoutes = require("./routes/employees-routes");
const jobOffersRoutes = require("./routes/jobOffers-routes");
const candidatureRoutes = require("./routes/candidature-routes");

const cors = require("cors");

// --- CRÉATION DE L'APP ---
const app = express();
app.use(express.json());
pp.use(
  cors({
    origin: "http://localhost:3000", // Remplacez par votre origine en production
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

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
const uri_melia = "mongodb://localhost:27017/JobBangLocal";
const uri_cloud =
  "mongodb+srv://admin:Jaiepabs,Cvnac...@jobbang.yb0ee.mongodb.net/?retryWrites=true&w=majority&appName=JobBang";

const uri = uri_melia;
//const uri = uri_cloud;  // Uncomment this line to use the cloud database

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
