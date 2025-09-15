const express = require("express");
const router = express.Router();
const Contractor = require("../models/Contractor");

// ➕ Create Contractor
router.post("/", async (req, res) => {
  try {
    const contractor = new Contractor(req.body);
    await contractor.save();
    res.json({
      id: contractor._id,
      name: contractor.name,
      contact: contractor.contact,
      email: contractor.email,
      address: contractor.address
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📖 Get All Contractors
router.get("/", async (req, res) => {
  try {
    const contractors = await Contractor.find();
    res.json(contractors.map(c => ({
      id: c._id,
      name: c.name,
      contact: c.contact,
      email: c.email,
      address: c.address
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update Contractor
router.put("/:id", async (req, res) => {
  try {
    const contractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!contractor) return res.status(404).json({ error: "Not found" });
    res.json({
      id: contractor._id,
      name: contractor.name,
      contact: contractor.contact,
      email: contractor.email,
      address: contractor.address
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete Contractor
router.delete("/:id", async (req, res) => {
  try {
    const contractor = await Contractor.findByIdAndDelete(req.params.id);
    if (!contractor) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Contractor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
