import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/useApp";

export default function Navbar() {
  const { user, token, logout, cartCount, unreadCount } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">�Feast<span>Flow</span></Link>

      <Link to="/" className="nav-link">Restaurants</Link>

      {token ? (
        <>
          <Link to="/cart" className="nav-link" style={{ position: "relative" }}>
            🛒 Cart
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
          <Link to="/orders" className="nav-link">My Orders</Link>
          <Link to="/profile" className="nav-link" style={{ position: "relative" }}>
            👤 {user?.name?.split(" ")[0]}
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </Link>
          <button className="nav-btn outline" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" className="nav-btn outline">Login</Link>
          <Link to="/register" className="nav-btn">Sign Up</Link>
        </>
      )}
    </nav>
  );
}