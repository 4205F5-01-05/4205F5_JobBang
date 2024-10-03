const mongoose = require("mongoose");
const JobOffers = require("./JobOffers");

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
        unique: true,
        lowercase: true,
        validate: {
          validator: function (v) {
            return /^\S+@\S+\.\S+$/.test(v); // validation de la structure du email
          },
          message: (props) => `${props.value} is not a valid email!`,
        },
      },
    joId: { type: mongoose.Types.ObjectId, required: true, ref: JobOffers },
});

module.exports = mongoose.model("Candidatures", candidatureSchema);