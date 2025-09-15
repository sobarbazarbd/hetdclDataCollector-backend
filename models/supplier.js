const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactNo: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  category: { type: String, required: true },
  suppliedItems: { type: String, required: true },
  remarks: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Supplier", supplierSchema);
