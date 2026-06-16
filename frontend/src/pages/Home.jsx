import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRestaurants } from "../services/api";

function StarRating({ rating }) {
  const stars = Math.round(rating);
  return (
    <span className="stars">
      {"★".repeat(stars)}{"☆".repeat(5 - stars)}
    </span>
  );
}

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (q = "") => {
    setLoading(true);
    try {
      const params = q ? { search: q } : {};
      const data = await getRestaurants(params);
      setRestaurants(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => { await load(); };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(search);
  };

  return (
    <div className="page">
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)",
        borderRadius: 16, padding: "40px 32px", marginBottom: 32, color: "#fff"
      }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, marginBottom: 8 }}>
          Hungry? We've got you. 🍔
        </h1>
        <p style={{ fontSize: 17, opacity: 0.9, marginBottom: 24 }}>
          Order from your favourite restaurants, delivered fast.
        </p>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 12, maxWidth: 500 }}>
          <input
            className="form-input"
            style={{ flex: 1 }}
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ background: "#fff", color: "#2ECC71" }}>
            Search
          </button>
        </form>
      </div>

      <h2 className="page-title">All Restaurants</h2>

      {loading && <div className="loading-screen">Loading restaurants…</div>}
      {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

      {!loading && restaurants.length === 0 && (
        <div className="empty-state">
          <h3>No restaurants found</h3>
          <p>Try a different search term.</p>
          <button className="btn btn-primary" onClick={() => { setSearch(""); load(); }}>
            View All
          </button>
        </div>
      )}

      <div className="grid-3">
        {restaurants.map((r) => (
          <Link to={`/restaurant/${r._id}`} key={r._id} style={{ textDecoration: "none" }}>
            <div className="card">
              <div style={{ height: 180, overflow: 'hidden', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
                {r.image ? (
                  <img
                    src={encodeURI(r.image)}
                    alt={r.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                  />
                ) : (
                  '🍽️'
                )}
              </div>
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{r.name}</h3>
                  <span style={{
                    background: r.isOpen ? "#F0FDF4" : "#FEF2F2",
                    color: r.isOpen ? "#15803D" : "#DC2626",
                    fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999
                  }}>
                    {r.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
                <p style={{ color: "#6B7280", fontSize: 13, marginBottom: 8 }}>
                  {r.cuisine?.join(", ") || "Mixed"}
                </p>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <span><StarRating rating={r.rating} /> {r.rating.toFixed(1)}</span>
                  <span style={{ color: "#6B7280", fontSize: 13 }}>⏱ {r.deliveryTime}</span>
                  <span style={{ color: "#6B7280", fontSize: 13 }}>
                    {r.deliveryFee === 0 ? "🆓 Free delivery" : `🚚 ₹${r.deliveryFee}`}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}