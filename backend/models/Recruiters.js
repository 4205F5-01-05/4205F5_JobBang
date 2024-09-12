const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const recruitersSchema = new Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v); // validation strucutre numero téléphone
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
        return /^\S+@\S+\.\S+$/.test(v); // validation de la structure du email
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  mdp: { type: String, required: true },
  companyAddress: { type: String, default: "" },
});

// Hash le mot de passe avant de sauvegarder l'employeur
recruitersSchema.pre("save", async function (next) {
  if (this.isModified("mdp") || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.mdp = await bcrypt.hash(this.mdp, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    return next();
  }
});

// Méthode pour comparé les deux mot de passe
recruitersSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.mdp);
  } catch (err) {
    throw new Error("Password comparison failed");
  }
};

module.exports = mongoose.model("Recruiters", recruitersSchema);
