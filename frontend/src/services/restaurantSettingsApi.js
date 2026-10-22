const API_URL = import.meta.env.VITE_API_URL;

export const getRestaurantSettings = async () => {
  const response = await fetch(`${API_URL}/admin/settings`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch restaurant settings.");
  }

  return data.restaurant;
};

export const updateRestaurantSettings = async (settings) => {
  const response = await fetch(`${API_URL}/admin/settings`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update restaurant settings.");
  }

  return data.restaurant;
};
