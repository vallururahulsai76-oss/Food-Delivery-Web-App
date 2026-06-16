import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen">Loading orders…</div>;

  return (
    <div className="page">
      <h1 className="page-title">📦 My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
          <h3>No orders yet</h3>
          <p>Your order history will appear here.</p>
          <Link to="/" className="btn btn-primary">Order Now</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map((order) => (
            <Link to={`/orders/${order._id}`} key={order._id} style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 36 }}>
                  {order.status === "delivered" ? "✅" : order.status === "cancelled" ? "❌" : "🚗"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <strong style={{ fontSize: 16 }}>
                      {order.restaurant?.name || "Restaurant"}
                    </strong>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 4 }}>
                    {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#6B7280", fontSize: 13 }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </span>
                    <strong style={{ color: "#2ECC71" }}>₹{order.totalAmount}</strong>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}