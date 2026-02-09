const express = require("express");
const router = express.Router();
const RetailSeller = require("../models/retailSeller");

// Create Retail Seller
router.post("/", async (req, res) => {
  try {
    const { name, phoneNumber, email, address, product, remark } = req.body;

    const retailSeller = new RetailSeller({
      name,
      phoneNumber,
      email,
      address,
      product,
      remark,
    });

    await retailSeller.save();

    res.json({
      id: retailSeller._id,
      name: retailSeller.name,
      phoneNumber: retailSeller.phoneNumber,
      email: retailSeller.email,
      address: retailSeller.address,
      product: retailSeller.product,
      remark: retailSeller.remark,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Retail Sellers
router.get("/", async (req, res) => {
  try {
    const retailers = await RetailSeller.find();
    res.json(
      retailers.map((r, index) => ({
        id: r._id,
        sNo: index + 1,
        name: r.name,
        phoneNumber: r.phoneNumber,
        email: r.email,
        address: r.address,
        product: r.product,
        remark: r.remark,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Retail Seller
router.put("/:id", async (req, res) => {
  try {
    const { name, phoneNumber, email, address, product, remark } = req.body;

    const retailSeller = await RetailSeller.findByIdAndUpdate(
      req.params.id,
      { name, phoneNumber, email, address, product, remark },
      { new: true }
    );

    if (!retailSeller) return res.status(404).json({ error: "Not found" });

    res.json({
      id: retailSeller._id,
      name: retailSeller.name,
      phoneNumber: retailSeller.phoneNumber,
      email: retailSeller.email,
      address: retailSeller.address,
      product: retailSeller.product,
      remark: retailSeller.remark,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Retail Seller
router.delete("/:id", async (req, res) => {
  try {
    const retailSeller = await RetailSeller.findByIdAndDelete(req.params.id);
    if (!retailSeller) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Retail Seller deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
