const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// GET /api/users/me  — profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/users/me  — update profile
router.patch("/me", authMiddleware, async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, addresses },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/me/cart
router.get("/me/cart", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.menuItem");
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/me/cart  — add or update item in cart
router.post("/me/cart", authMiddleware, async (req, res) => {
  try {
    const { menuItemId, name, price, quantity, restaurantId } = req.body;
    const user = await User.findById(req.user.id);

    const existing = user.cart.find(
      (i) => i.menuItem?.toString() === menuItemId
    );

    if (existing) {
      existing.quantity = quantity;
      if (quantity <= 0)
        user.cart = user.cart.filter((i) => i.menuItem?.toString() !== menuItemId);
    } else {
      user.cart.push({ menuItem: menuItemId, name, price, quantity, restaurantId });
    }

    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/me/cart  — clear cart
router.delete("/me/cart", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { cart: [] });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/me/notifications
router.get("/me/notifications", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("notifications");
    res.json(user.notifications.sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/users/me/notifications/read  — mark all as read
router.patch("/me/notifications/read", authMiddleware, async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user.id },
      { $set: { "notifications.$[].read": true } }
    );
    res.json({ message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;