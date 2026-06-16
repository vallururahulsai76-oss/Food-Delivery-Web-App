const BASE = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const headers = (extra = {}) => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const req = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// Auth
export const register = (body) => req("POST", "/auth/register", body);
export const login = (body) => req("POST", "/auth/login", body);

// Restaurants
export const getRestaurants = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return req("GET", `/restaurants${qs ? "?" + qs : ""}`);
};
export const getRestaurant = (id) => req("GET", `/restaurants/${id}`);
export const getMenu = (id) => req("GET", `/restaurants/${id}/menu`);

// Orders
export const placeOrder = (body) => req("POST", "/orders", body);
export const getOrders = () => req("GET", "/orders");
export const getOrder = (id) => req("GET", `/orders/${id}`);
export const cancelOrder = (id) => req("DELETE", `/orders/${id}`);

// Reviews
export const getReviews = (restaurantId) =>
  req("GET", `/reviews/restaurant/${restaurantId}`);
export const postReview = (body) => req("POST", "/reviews", body);

// User
export const getMe = () => req("GET", "/users/me");
export const updateMe = (body) => req("PATCH", "/users/me", body);
export const getCart = () => req("GET", "/users/me/cart");
export const updateCart = (body) => req("POST", "/users/me/cart", body);
export const clearCart = () => req("DELETE", "/users/me/cart");
export const getNotifications = () => req("GET", "/users/me/notifications");
export const markNotificationsRead = () => req("PATCH", "/users/me/notifications/read");