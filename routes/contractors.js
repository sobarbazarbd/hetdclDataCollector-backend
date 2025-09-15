const express = require("express");
const router = express.Router();
const Contractor = require("../models/Contractor");

// ➕ Create Contractor
router.post("/", async (req, res) => {
  try {
    const { name, contactNo, email, address, workCategory, remarks } = req.body;

    const contractor = new Contractor({
      name,
      contactNo,
      email,
      address,
      workCategory,
      remarks,
    });

    await contractor.save();

    res.json({
      id: contractor._id,
      name: contractor.name,
      contactNo: contractor.contactNo,
      email: contractor.email,
      address: contractor.address,
      workCategory: contractor.workCategory,
      remarks: contractor.remarks,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📖 Get All Contractors
router.get("/", async (req, res) => {
  try {
    const contractors = await Contractor.find();
    res.json(
      contractors.map((c, index) => ({
        id: c._id,
        sNo: index + 1, // Serial number
        name: c.name,
        contactNo: c.contactNo,
        email: c.email,
        address: c.address,
        workCategory: c.workCategory,
        remarks: c.remarks,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update Contractor
router.put("/:id", async (req, res) => {
  try {
    const { name, contactNo, email, address, workCategory, remarks } = req.body;

    const contractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      { name, contactNo, email, address, workCategory, remarks },
      { new: true }
    );

    if (!contractor) return res.status(404).json({ error: "Not found" });

    res.json({
      id: contractor._id,
      name: contractor.name,
      contactNo: contractor.contactNo,
      email: contractor.email,
      address: contractor.address,
      workCategory: contractor.workCategory,
      remarks: contractor.remarks,
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
