const API_URL = "/api/admin/settings";

export const getRestaurantSettings = async () => {
  const response = await fetch(API_URL, {
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
  const response = await fetch(API_URL, {
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
