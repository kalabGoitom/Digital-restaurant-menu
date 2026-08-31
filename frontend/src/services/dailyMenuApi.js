import { getTodaysMenu } from "./menuApi";

const API_URL = `${import.meta.env.VITE_API_URL}/admin/daily-menu`;
async function request(url, options = {}) {
  const response = await fetch(url, { credentials: "include", ...options });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(
      data.message || "The request could not be completed.",
    );
    error.status = response.status;
    throw error;
  }
  return data;
}

export async function ensureTodaysDailyMenu() {
  try {
    return await request(API_URL, { method: "POST" });
  } catch (error) {
    if (error.status === 400 && error.message.includes("already exists"))
      return null;
    throw error;
  }
}

export const addToTodaysMenu = (menuId) =>
  request(`${API_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ menuId }),
  });
export const removeFromTodaysMenu = (dailyMenuItemId) =>
  request(`${API_URL}/items/${dailyMenuItemId}`, { method: "DELETE" });
export const getPublicTodaysMenu = getTodaysMenu;
