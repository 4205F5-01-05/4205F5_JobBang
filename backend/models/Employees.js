const mongoose = require("mongoose");

const employeesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v); 
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\S+@\S+\.\S+$/.test(v); 
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  mdp: { type: String, required: true },
  homeAddress: { type: String, default: "" },
});

module.exports = mongoose.model("Employees", employeesSchema);
