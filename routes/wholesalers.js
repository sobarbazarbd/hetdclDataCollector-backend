const express = require("express");
const router = express.Router();
const Wholesaler = require("../models/wholesaler");

// Create Wholesaler
router.post("/", async (req, res) => {
  try {
    const { name, phoneNumber, email, address, product, remark } = req.body;

    const wholesaler = new Wholesaler({
      name,
      phoneNumber,
      email,
      address,
      product,
      remark,
    });

    await wholesaler.save();

    res.json({
      id: wholesaler._id,
      name: wholesaler.name,
      phoneNumber: wholesaler.phoneNumber,
      email: wholesaler.email,
      address: wholesaler.address,
      product: wholesaler.product,
      remark: wholesaler.remark,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Wholesalers
router.get("/", async (req, res) => {
  try {
    const wholesalers = await Wholesaler.find();
    res.json(
      wholesalers.map((w, index) => ({
        id: w._id,
        sNo: index + 1,
        name: w.name,
        phoneNumber: w.phoneNumber,
        email: w.email,
        address: w.address,
        product: w.product,
        remark: w.remark,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Wholesaler
router.put("/:id", async (req, res) => {
  try {
    const { name, phoneNumber, email, address, product, remark } = req.body;

    const wholesaler = await Wholesaler.findByIdAndUpdate(
      req.params.id,
      { name, phoneNumber, email, address, product, remark },
      { new: true }
    );

    if (!wholesaler) return res.status(404).json({ error: "Not found" });

    res.json({
      id: wholesaler._id,
      name: wholesaler.name,
      phoneNumber: wholesaler.phoneNumber,
      email: wholesaler.email,
      address: wholesaler.address,
      product: wholesaler.product,
      remark: wholesaler.remark,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Wholesaler
router.delete("/:id", async (req, res) => {
  try {
    const wholesaler = await Wholesaler.findByIdAndDelete(req.params.id);
    if (!wholesaler) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Wholesaler deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
