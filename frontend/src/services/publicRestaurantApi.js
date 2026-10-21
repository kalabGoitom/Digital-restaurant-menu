const API_URL = import.meta.env.VITE_API_URL;

// Fetch public restaurant details and branding
export const getPublicRestaurant = async (slug) => {
  const response = await fetch(
    `${API_URL}/public/restaurants/${encodeURIComponent(slug)}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load restaurant.");
  }

  return data.restaurant;
};

// Fetch today's public menu for a restaurant
export const getPublicDailyMenu = async (slug) => {
  const response = await fetch(
    `${API_URL}/public/restaurants/${encodeURIComponent(slug)}/menu`,
  );

  const data = await response.json();

  // The restaurant exists, but today's menu may not have been created yet.
  if (
    response.status === 404 &&
    data.message?.includes("Daily menu not found")
  ) {
    return null;
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to load today's menu.");
  }

  return data;
};
