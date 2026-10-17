const API_URL = import.meta.env.VITE_API_URL;

export const getPlatformDashboardStats = async () => {
  const response = await fetch(`${API_URL}/platform-admin/dashboard/stats`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch dashboard statistics.");
  }

  return data.stats;
};

export const getRecentRestaurants = async () => {
  const response = await fetch(`${API_URL}/platform-admin/restaurants`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch restaurants.");
  }

  return data.restaurants.slice(0, 5);
};

export const getAllRestaurants = async () => {
  const response = await fetch(`${API_URL}/platform-admin/restaurants`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch restaurants.");
  }

  return data.restaurants;
};
