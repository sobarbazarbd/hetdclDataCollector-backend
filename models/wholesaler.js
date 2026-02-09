const mongoose = require("mongoose");

const wholesalerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  product: { type: String, required: true },
  remark: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Wholesaler", wholesalerSchema);
