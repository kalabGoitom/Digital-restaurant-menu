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

export const createRestaurant = async (restaurantData) => {
  const response = await fetch(`${API_URL}/platform-admin/restaurants`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(restaurantData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create restaurant.");
  }

  return data;
};

export const getRestaurantById = async (id) => {
  const response = await fetch(`${API_URL}/platform-admin/restaurants/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch restaurant.");
  }

  return data.restaurant;
};

export const updateRestaurant = async (id, restaurantData) => {
  const response = await fetch(`${API_URL}/platform-admin/restaurants/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(restaurantData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update restaurant.");
  }

  return data.restaurant;
};

export const deactivateRestaurant = async (id) => {
  const response = await fetch(
    `${API_URL}/platform-admin/restaurants/${id}/deactivate`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to deactivate restaurant.");
  }

  return data.restaurant;
};

export const reactivateRestaurant = async (id) => {
  const response = await fetch(
    `${API_URL}/platform-admin/restaurants/${id}/reactivate`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to reactivate restaurant.");
  }

  return data.restaurant;
};
