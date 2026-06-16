const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, default: "" },
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    cuisine: [String],
    address: {
      street: String,
      city: String,
      pincode: String,
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    image: { type: String, default: "" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    deliveryTime: { type: String, default: "30-45 min" },
    deliveryFee: { type: Number, default: 0 },
    minOrder: { type: Number, default: 0 },
    isOpen: { type: Boolean, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
