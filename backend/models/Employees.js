const mongoose = require("mongoose");

const employeesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mdp: { type: String, required: true },
  homeAddress: { type: String },
});

module.exports = mongoose.model("Employees", employeesSchema);
