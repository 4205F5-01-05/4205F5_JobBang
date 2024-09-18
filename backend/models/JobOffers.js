const mongoose = require("mongoose");
const Recruiters = require("./Recruiters");

const jobOffersSchema = new mongoose.Schema({
  region: { type: String, default: "Quebec" },
  description: { type: String },
  rid: { type: mongoose.Types.ObjectId, required: true, ref: Recruiters },
});

module.exports = mongoose.model("JobOffers", jobOffersSchema);
