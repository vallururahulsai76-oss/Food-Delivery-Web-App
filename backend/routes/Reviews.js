const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const { Restaurant } = require("../models/Restaurant");
const authMiddleware = require("../middleware/auth");

// GET /api/reviews/restaurant/:id
router.get("/restaurant/:id", async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.id })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reviews
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { restaurantId, orderId, rating, comment } = req.body;

    const review = await Review.create({
      user: req.user.id,
      restaurant: restaurantId,
      order: orderId,
      rating,
      comment,
    });

    // Update restaurant average rating
    const allReviews = await Review.find({ restaurant: restaurantId });
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: Math.round(avg * 10) / 10,
      totalReviews: allReviews.length,
    });

    const populated = await review.populate("user", "name");
    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "You have already reviewed this restaurant" });
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/reviews/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;