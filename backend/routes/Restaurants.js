const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const protect = require("../middleware/auth");

// GET /api/restaurants
router.get("/", async (req, res) => {
  try {
    const { search, cuisine, city } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (cuisine) query.cuisine = { $in: [cuisine] };
    if (city) query["address.city"] = { $regex: city, $options: "i" };

    const restaurants = await Restaurant.find(query).sort({ rating: -1 });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/restaurants/:id
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/restaurants/:id/menu
router.get("/:id/menu", async (req, res) => {
  try {
    const items = await MenuItem.find({
      restaurant: req.params.id,
      isAvailable: true,
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/restaurants (admin only)
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });
    const restaurant = await Restaurant.create({ ...req.body, owner: req.user.id });
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/restaurants/:id (admin only)
router.patch("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;