import { useState } from "react";
import { useApp } from "../context/useApp";
import { updateMe } from "../services/api";

export default function Profile() {
  const { user, notifications, unreadCount, markRead, loadNotifications } = useApp();
  const [tab, setTab] = useState("profile");
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMe(form);
      setMsg("Profile updated!");
      setTimeout(() => setMsg(""), 2500);
    } catch (e) { setMsg(e.message); }
    finally { setSaving(false); }
  };

  const handleMarkRead = async () => {
    await markRead();
    await loadNotifications();
  };

  const tabs = ["profile", "notifications"];

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      {msg && <div className="toast">{msg}</div>}
      <h1 className="page-title">👤 My Account</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "2px solid #E5E7EB" }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "10px 20px", border: "none", background: "none", cursor: "pointer",
            fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600,
            color: tab === t ? "#2ECC71" : "#6B7280",
            borderBottom: tab === t ? "2px solid #2ECC71" : "2px solid transparent",
            textTransform: "capitalize", position: "relative"
          }}>
            {t === "notifications" ? `🔔 Notifications${unreadCount > 0 ? ` (${unreadCount})` : ""}` : "Profile"}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, #2ECC71, #27AE60)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, color: "#fff", fontWeight: 700,
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: 20 }}>{user?.name}</h2>
              <p style={{ color: "#6B7280" }}>{user?.email}</p>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" value={form.phone} placeholder="+91 9876543210"
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" value={user?.email || ""} disabled
              style={{ opacity: 0.6, cursor: "not-allowed" }} />
          </div>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="spinner" /> Saving…</> : "Save Changes"}
          </button>
        </div>
      )}

      {/* Notifications tab */}
      {tab === "notifications" && (
        <div>
          {unreadCount > 0 && (
            <div style={{ textAlign: "right", marginBottom: 12 }}>
              <button className="btn btn-secondary btn-sm" onClick={handleMarkRead}>
                Mark all as read
              </button>
            </div>
          )}
          {notifications.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
              <h3>No notifications</h3>
              <p>Order updates will appear here.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {notifications.map((n, i) => (
                <div key={i} style={{
                  padding: 16, borderRadius: 10,
                  background: n.read ? "#F9FAFB" : "#F0FFF4",
                  border: `1px solid ${n.read ? "#E5E7EB" : "#FDBA74"}`,
                  display: "flex", gap: 12, alignItems: "flex-start"
                }}>
                  <span style={{ fontSize: 20 }}>{n.read ? "🔕" : "🔔"}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: n.read ? 400 : 600 }}>{n.message}</p>
                    <p style={{ color: "#9CA3AF", fontSize: 12, marginTop: 4 }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.read && (
                    <span style={{
                      width: 8, height: 8, borderRadius: "50%", background: "#2ECC71",
                      flexShrink: 0, marginTop: 6
                    }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}