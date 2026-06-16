import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/useApp";

export default function Register() {
  const { authRegister } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await authRegister(form);
      navigate("/");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 70px)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24
    }}>
      <div className="card" style={{ width: "100%", maxWidth: 420, padding: 36 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🚀</div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800 }}>
            Create account
          </h1>
          <p style={{ color: "#6B7280", marginTop: 4 }}>Join BiteRush today</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Your Name"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Min 6 characters"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone (optional)</label>
            <input className="form-input" placeholder="+91 9876543210"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: 13 }} disabled={loading}>
            {loading ? <><span className="spinner" /> Creating…</> : "Create Account"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 20, color: "#6B7280", fontSize: 14 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#2ECC71", fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}