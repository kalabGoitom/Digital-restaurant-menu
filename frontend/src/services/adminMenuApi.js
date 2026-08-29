const API_URL = "http://localhost:5000/api/admin/menu-items";

async function request(url, options = {}) {
  const response = await fetch(url, { credentials: "include", ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || "The request could not be completed.");
  return data;
}

export const getMenuItems = async () => (await request(API_URL)).menuItems;
export const createMenuItem = (item) => request(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
export const updateMenuItem = (id, updates) => request(`${API_URL}/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updates) });
export const deleteMenuItem = (id) => request(`${API_URL}/${id}`, { method: "DELETE" });
