import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrder, postReview, cancelOrder } from "../services/api";
const STEPS = ["placed", "confirmed", "preparing", "out_for_delivery", "delivered"];

function TrackBar({ status }) {
  const idx = STEPS.indexOf(status);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "24px 0" }}>
      {STEPS.map((step, i) => (
        <div key={step} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700,
            background: i <= idx ? "#2ECC71" : "#E5E7EB",
            color: i <= idx ? "#fff" : "#9CA3AF",
          }}>
            {i < idx ? "✓" : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              flex: 1, height: 3, background: i < idx ? "#2ECC71" : "#E5E7EB", margin: "0 2px"
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [reviewed, setReviewed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getOrder(id)
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const submitReview = async () => {
    setSubmitting(true);
    try {
      await postReview({
        restaurantId: order.restaurant._id,
        orderId: id,
        rating: review.rating,
        comment: review.comment,
      });
      setReviewed(true);
      setMsg("Review submitted! Thank you.");
    } catch (e) { setMsg(e.message); }
    finally { setSubmitting(false); }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order?")) return;
    setCancelling(true);
    try {
      await cancelOrder(id);
      setOrder((o) => ({ ...o, status: "cancelled" }));
    } catch (e) { setMsg(e.message); }
    finally { setCancelling(false); }
  };

  if (loading) return <div className="loading-screen">Loading order…</div>;
  if (!order) return <div className="loading-screen">Order not found</div>;

  const canCancel = !["out_for_delivery", "delivered", "cancelled"].includes(order.status);
  const isDelivered = order.status === "delivered";

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      {msg && <div className="toast">{msg}</div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>
          Order #{id.slice(-6).toUpperCase()}
        </h1>
        <span className={`status-badge status-${order.status}`} style={{ fontSize: 14 }}>
          {order.status.replace(/_/g, " ")}
        </span>
      </div>
      <p style={{ color: "#6B7280", marginBottom: 24 }}>
        Placed on {new Date(order.createdAt).toLocaleString()}
      </p>

      {/* Tracking bar */}
      {order.status !== "cancelled" && <TrackBar status={order.status} />}
      {order.status !== "cancelled" && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, fontSize: 11, color: "#9CA3AF" }}>
          {STEPS.map((s) => <span key={s} style={{ textAlign: "center", flex: 1 }}>{s.replace(/_/g, " ")}</span>)}
        </div>
      )}

      {/* Restaurant */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 4 }}>🍽️ {order.restaurant?.name}</h3>
        <p style={{ color: "#6B7280", fontSize: 14 }}>
          📍 {order.restaurant?.address?.street}, {order.restaurant?.address?.city}
        </p>
      </div>

      {/* Items */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Order Items</h3>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
            <span>{item.name} × {item.quantity}</span>
            <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 8, borderTop: "2px solid #E5E7EB", fontWeight: 700, fontSize: 16 }}>
          <span>Total</span><span style={{ color: "#2ECC71" }}>₹{order.totalAmount}</span>
        </div>
      </div>

      {/* Delivery address */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 8 }}>📍 Delivery Address</h3>
        <p style={{ color: "#374151" }}>
          {order.deliveryAddress?.street}, {order.deliveryAddress?.city} — {order.deliveryAddress?.pincode}
        </p>
        <p style={{ color: "#6B7280", fontSize: 14, marginTop: 4 }}>
          Payment: {order.paymentMethod?.toUpperCase()} {order.isPaid ? "✅ Paid" : ""}
        </p>
      </div>

      {/* Cancel button */}
      {canCancel && (
        <button className="btn btn-secondary" style={{ marginBottom: 16, borderColor: "#DC2626", color: "#DC2626" }}
          onClick={handleCancel} disabled={cancelling}>
          {cancelling ? "Cancelling…" : "❌ Cancel Order"}
        </button>
      )}

      {/* Review form */}
      {isDelivered && !reviewed && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>⭐ Leave a Review</h3>
          <div className="form-group">
            <label className="form-label">Rating</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setReview({ ...review, rating: s })}
                  style={{
                    fontSize: 24, background: "none", border: "none", cursor: "pointer",
                    color: s <= review.rating ? "#F59E0B" : "#E5E7EB",
                  }}>★</button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Comment (optional)</label>
            <textarea className="form-input" rows={3}
              style={{ resize: "vertical" }}
              placeholder="How was your experience?"
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })} />
          </div>
          <button className="btn btn-primary" onClick={submitReview} disabled={submitting}>
            {submitting ? <><span className="spinner" /> Submitting…</> : "Submit Review"}
          </button>
        </div>
      )}
      {isDelivered && reviewed && (
        <div style={{ textAlign: "center", padding: 20, color: "#15803D", fontWeight: 600 }}>
          ✅ Review submitted. Thank you!
        </div>
      )}
    </div>
  );
}