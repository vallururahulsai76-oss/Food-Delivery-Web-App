import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/useApp";
import { placeOrder } from "../services/api";

export default function Cart() {
  const { cart, cartTotal, updateQty, emptyCart, removeFromCart, user } = useApp();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.addresses?.[0] || {
    street: "", city: "", pincode: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = cartTotal >= 300 ? 0 : 40;
  const grandTotal = cartTotal + deliveryFee;

  const handleCheckout = async () => {
    if (!address.street || !address.city)
      return setError("Please enter delivery address");
    if (cart.length === 0) return setError("Your cart is empty");

    setPlacing(true); setError("");
    try {
      const restaurantId = cart[0]?.restaurantId || cart[0]?.restaurant;
      const order = await placeOrder({
        restaurantId,
        items: cart.map((i) => ({
          menuItem: i.menuItem?._id || i.menuItem,
          name: i.name, price: i.price, quantity: i.quantity,
        })),
        deliveryAddress: address,
        paymentMethod,
        deliveryFee,
      });
      await emptyCart();
      navigate(`/orders/${order._id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0)
    return (
      <div className="page">
        <div className="empty-state">
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add items from a restaurant to get started.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Browse Restaurants
          </button>
        </div>
      </div>
    );

  return (
    <div className="page">
      <h1 className="page-title">🛒 Your Cart</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>

        {/* Cart items */}
        <div>
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            {cart.map((item) => (
              <div key={item.menuItem?._id || item.menuItem} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 0", borderBottom: "1px solid #F3F4F6"
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ color: "#2ECC71", fontWeight: 700 }}>₹{item.price}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" style={{ width: 28, height: 28, padding: 0 }}
                    onClick={() => {
                      if (item.quantity === 1) removeFromCart(item.menuItem?._id || item.menuItem);
                      else updateQty(item.menuItem?._id || item.menuItem, item.quantity - 1, item.name, item.price, item.restaurantId);
                    }}>−</button>
                  <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                  <button className="btn btn-primary btn-sm" style={{ width: 28, height: 28, padding: 0 }}
                    onClick={() => updateQty(item.menuItem?._id || item.menuItem, item.quantity + 1, item.name, item.price, item.restaurantId)}>+</button>
                </div>
                <div style={{ minWidth: 60, textAlign: "right", fontWeight: 700 }}>
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Delivery address */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📍 Delivery Address</h3>
            <div className="form-group">
              <label className="form-label">Street</label>
              <input className="form-input" value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                placeholder="House no., Street name" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="City" />
              </div>
              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input className="form-input" value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  placeholder="560001" />
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6B7280" }}>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6B7280" }}>Delivery fee</span>
              <span style={{ color: deliveryFee === 0 ? "#15803D" : "inherit" }}>
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
              </span>
            </div>
            <div style={{ height: 1, background: "#E5E7EB", margin: "4px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 18 }}>
              <span>Total</span><span>₹{grandTotal}</span>
            </div>
            {cartTotal < 300 && (
              <p style={{ color: "#6B7280", fontSize: 12 }}>Add ₹{300 - cartTotal} more for free delivery</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Payment</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["cod", "online"].map((pm) => (
                <button key={pm} onClick={() => setPaymentMethod(pm)}
                  className={`btn btn-sm ${paymentMethod === pm ? "btn-primary" : "btn-secondary"}`}
                  style={{ flex: 1, textTransform: "uppercase" }}>
                  {pm === "cod" ? "💵 Cash" : "💳 Online"}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}

          <button className="btn btn-primary" style={{ width: "100%", padding: 14 }}
            onClick={handleCheckout} disabled={placing}>
            {placing ? <><span className="spinner" /> Placing…</> : `Place Order · ₹${grandTotal}`}
          </button>
        </div>
      </div>
    </div>
  );
}