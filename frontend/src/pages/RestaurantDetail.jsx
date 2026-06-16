import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRestaurant, getMenu, getReviews } from "../services/api";
import { useApp } from "../context/useApp";

function Toast({ msg }) {
  return msg ? <div className="toast">{msg}</div> : null;
}

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, token } = useApp();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("menu");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [r, m, rv] = await Promise.all([
          getRestaurant(id), getMenu(id), getReviews(id)
        ]);
        setRestaurant(r); setMenu(m); setReviews(rv);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleAdd = async (item) => {
    if (!token) { navigate("/login"); return; }
    try {
      await addToCart({
        menuItemId: item._id, name: item.name,
        price: item.price, restaurantId: id,
      });
      setToast(`${item.name} added to cart!`);
      setTimeout(() => setToast(""), 2000);
    } catch (e) { setToast(e.message); setTimeout(() => setToast(""), 2500); }
  };

  const getQty = (itemId) =>
    cart.find((c) => c.menuItem === itemId || c.menuItem?._id === itemId)?.quantity || 0;

  const categories = [...new Set(menu.map((i) => i.category))];

  if (loading) return <div className="loading-screen">Loading restaurant…</div>;
  if (!restaurant) return <div className="loading-screen">Not found</div>;

  return (
    <div className="page">
      <Toast msg={toast} />

      {/* Restaurant header */}
      <div className="card" style={{ marginBottom: 24, overflow: 'hidden' }}>
        <div style={{ height: 220, width: '100%', backgroundColor: restaurant.image ? undefined : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {restaurant.image ? (
            <img
              src={encodeURI(restaurant.image)}
              alt={restaurant.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              onError={e => { e.target.onerror = null; e.target.style.objectFit = 'contain'; }}
            />
          ) : (
            <span style={{ fontSize: 64 }}>🍽️</span>
          )}
        </div>
        <div className="card-body">
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800 }}>
                {restaurant.name}
              </h1>
              <p style={{ color: "#6B7280", margin: "4px 0" }}>{restaurant.cuisine?.join(", ")}</p>
              <p style={{ color: "#6B7280", fontSize: 14 }}>
                📍 {restaurant.address?.street}, {restaurant.address?.city}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>
                ⭐ {restaurant.rating.toFixed(1)}
                <span style={{ color: "#6B7280", fontSize: 14 }}> ({restaurant.totalReviews} reviews)</span>
              </div>
              <div style={{ color: "#6B7280", fontSize: 14 }}>⏱ {restaurant.deliveryTime}</div>
              <div style={{ color: "#6B7280", fontSize: 14 }}>
                {restaurant.deliveryFee === 0 ? "🆓 Free delivery" : `🚚 ₹${restaurant.deliveryFee} delivery`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "2px solid #E5E7EB", paddingBottom: 0 }}>
        {["menu", "reviews"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "10px 20px", border: "none", background: "none", cursor: "pointer",
            fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600,
            color: activeTab === tab ? "#2ECC71" : "#6B7280",
            borderBottom: activeTab === tab ? "2px solid #2ECC71" : "2px solid transparent",
            textTransform: "capitalize"
          }}>
            {tab === "menu" ? `🍽️ Menu (${menu.length})` : `⭐ Reviews (${reviews.length})`}
          </button>
        ))}
      </div>

      {/* Menu tab */}
      {activeTab === "menu" && (
        <div>
          {categories.map((cat) => (
            <div key={cat} style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #E5E7EB" }}>
                {cat}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {menu.filter((i) => i.category === cat).map((item) => {
                  const qty = getQty(item._id);
                  return (
                    <div key={item._id} className="card" style={{ display: "flex", gap: 16, padding: 16 }}>
                      <div style={{ width: 80, height: 80, borderRadius: 8, flexShrink: 0, overflow: 'hidden', backgroundColor: item.image ? undefined : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.image ? (
                          <img
                            src={encodeURI(item.image)}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                          />
                        ) : (
                          (item.isVeg ? "🥗" : "🍗")
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <span style={{
                              display: "inline-block", width: 12, height: 12, borderRadius: 2, marginRight: 6,
                              border: `2px solid ${item.isVeg ? "#15803D" : "#DC2626"}`,
                              background: item.isVeg ? "#15803D" : "#DC2626"
                            }} />
                            <strong style={{ fontSize: 15 }}>{item.name}</strong>
                          </div>
                          <strong style={{ color: "#2ECC71", fontSize: 16 }}>₹{item.price}</strong>
                        </div>
                        {item.description && (
                          <p style={{ color: "#6B7280", fontSize: 13, margin: "4px 0 8px" }}>{item.description}</p>
                        )}
                                      {qty === 0 ? (
                                        <button className="btn btn-primary btn-sm" onClick={() => handleAdd(item)}>
                                          + Add
                                        </button>
                                      ) : (
                                        <span style={{ fontSize: 13, color: "#15803D", fontWeight: 600 }}>
                                          ✓ {qty} in cart
                                        </span>
                                      )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {menu.length === 0 && (
            <div className="empty-state"><p>No menu items available.</p></div>
          )}
        </div>
      )}

      {/* Reviews tab */}
      {activeTab === "reviews" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {reviews.length === 0 ? (
            <div className="empty-state"><h3>No reviews yet</h3><p>Be the first to review!</p></div>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="card" style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <strong>{r.user?.name || "User"}</strong>
                  <span className="stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                </div>
                {r.comment && <p style={{ color: "#374151" }}>{r.comment}</p>}
                <p style={{ color: "#9CA3AF", fontSize: 12, marginTop: 8 }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}