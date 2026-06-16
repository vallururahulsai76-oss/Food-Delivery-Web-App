import { useState, useEffect, useCallback } from "react";
import * as api from "../services/api";
import { AppContext } from "./context";

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [cart, setCart] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCart([]);
    setNotifications([]);
  };

  const loadUser = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const me = await api.getMe();
      setUser(me);
      setCart(me.cart || []);
    } catch (error) {
      console.error(error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    const fetchUser = async () => { await loadUser(); };
    fetchUser();
  }, [loadUser]);

  useEffect(() => {
    const fetchNotifications = async () => { await loadNotifications(); };
    fetchNotifications();
  }, [loadNotifications]);

  const authLogin = async (body) => {
    const data = await api.login(body);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const authRegister = async (body) => {
    const data = await api.register(body);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };


  const addToCart = async (item) => {
    const existing = cart.find((i) => i.menuItem === item.menuItemId);
    const newQty = existing ? existing.quantity + 1 : 1;
    const updated = await api.updateCart({ ...item, quantity: newQty });
    setCart(updated);
  };

  const removeFromCart = async (menuItemId) => {
    const updated = await api.updateCart({ menuItemId, quantity: 0 });
    setCart(updated);
  };

  const updateQty = async (menuItemId, quantity, name, price, restaurantId) => {
    const updated = await api.updateCart({ menuItemId, quantity, name, price, restaurantId });
    setCart(updated);
  };

  const emptyCart = async () => {
    await api.clearCart();
    setCart([]);
  };

  const markRead = async () => {
    await api.markNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        user, token, loading,
        authLogin, authRegister, logout,
        cart, cartTotal, cartCount, addToCart, removeFromCart, updateQty, emptyCart, setCart,
        notifications, unreadCount, markRead, loadNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

