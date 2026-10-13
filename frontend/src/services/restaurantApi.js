import { apiGet } from "./apiClient.js";

const enc = encodeURIComponent;

// GET /api/public/restaurants/:slug
export async function getPublicRestaurant(slug, options) {
  const data = await apiGet(`/api/public/restaurants/${enc(slug)}`, options);
  return data.restaurant ?? data; // accepts a bare object or { restaurant }
}

// GET /api/public/restaurants/:slug/menu  (today's menu)
export async function getPublicDailyMenu(slug, options) {
  const data = await apiGet(
    `/api/public/restaurants/${enc(slug)}/menu`,
    options,
  );
  return Array.isArray(data) ? data : (data.items ?? []); // accepts an array or { items }
}
