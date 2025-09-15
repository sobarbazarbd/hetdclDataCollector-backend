const mongoose = require("mongoose");

const contractorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactNo: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  workCategory: { type: String, required: true },
  remarks: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Contractor", contractorSchema);
