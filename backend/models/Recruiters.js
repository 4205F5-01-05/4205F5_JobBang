const mongoose = require("mongoose");

const recruitersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mdp: { type: String, required: true },
  companyAddress: { type: String },
});

module.exports = mongoose.model("Recruiters", recruitersSchema);
