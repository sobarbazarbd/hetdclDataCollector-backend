const express = require("express");
const router = express.Router();
const Supplier = require("../models/Supplier");

// ➕ Create Supplier
router.post("/", async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.json({
      id: supplier._id,
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      address: supplier.address
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📖 Get All Suppliers
router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers.map(s => ({
      id: s._id,
      name: s.name,
      contact: s.contact,
      email: s.email,
      address: s.address
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update Supplier
router.put("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!supplier) return res.status(404).json({ error: "Not found" });
    res.json({
      id: supplier._id,
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      address: supplier.address
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete Supplier
router.delete("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Supplier deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
