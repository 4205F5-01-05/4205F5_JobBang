const mongoose = require("mongoose");
const JobOffers = require("./JobOffers");
const Employees = require("./Employees");

const candidatureSchema = new mongoose.Schema({
  nomEmploye: { type: String, required: true },
  telEmploye: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v); // validation strucutre numero téléphone
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  emailEmploye: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\S+@\S+\.\S+$/.test(v); // validation de la structure du email
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  cvFile: { type: String },
  joId: { type: mongoose.Types.ObjectId, required: true, ref: JobOffers },
  eId: { type: mongoose.Types.ObjectId, required: true, ref: Employees },
  show: { type: Boolean, default: true }, // Champ booléen pour la visibilité de l'offre
});

module.exports = mongoose.model("Candidatures", candidatureSchema);
