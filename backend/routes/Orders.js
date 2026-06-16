const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// POST /api/orders  — place a new order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod, deliveryFee } = req.body;

    const totalAmount =
      items.reduce((sum, i) => sum + i.price * i.quantity, 0) + (deliveryFee || 0);

    const estimatedDelivery = new Date(Date.now() + 45 * 60 * 1000); // 45 min from now

    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurantId,
      items,
      totalAmount,
      deliveryFee: deliveryFee || 0,
      deliveryAddress,
      paymentMethod,
      estimatedDelivery,
    });

    // Clear cart
    await User.findByIdAndUpdate(req.user.id, { cart: [] });

    // Add notification
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        notifications: {
          message: `Order #${order._id.toString().slice(-6).toUpperCase()} placed successfully! Estimated delivery: 45 min`,
        },
      },
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders  — user's orders
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("restaurant", "name image")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id  — single order (with tracking)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("restaurant", "name image address")
      .populate("user", "name phone");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only the order owner or admin can view
    if (order.user._id.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/orders/:id/status  — update order status (admin only)
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === "delivered" ? { deliveredAt: new Date(), isPaid: true } : {}),
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Notify user
    const statusMessages = {
      confirmed: "Your order has been confirmed by the restaurant!",
      preparing: "Your order is being prepared.",
      out_for_delivery: "Your order is out for delivery!",
      delivered: "Your order has been delivered. Enjoy your meal!",
      cancelled: "Your order has been cancelled.",
    };

    if (statusMessages[status]) {
      await User.findByIdAndUpdate(order.user, {
        $push: {
          notifications: {
            message: `Order #${order._id.toString().slice(-6).toUpperCase()}: ${statusMessages[status]}`,
          },
        },
      });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/orders/:id  — cancel order
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    if (["out_for_delivery", "delivered"].includes(order.status))
      return res.status(400).json({ message: "Cannot cancel this order now" });

    order.status = "cancelled";
    await order.save();
    res.json({ message: "Order cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;