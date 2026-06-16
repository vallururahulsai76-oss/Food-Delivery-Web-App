import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/useApp";

export default function Login() {
  const { authLogin } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await authLogin(form);
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
          <div style={{ fontSize: 40, marginBottom: 8 }}>🍕</div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800 }}>
            Welcome back
          </h1>
          <p style={{ color: "#6B7280", marginTop: 4 }}>Sign in to your BiteRush account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: 13 }} disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in…</> : "Sign In"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 20, color: "#6B7280", fontSize: 14 }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#2ECC71", fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}