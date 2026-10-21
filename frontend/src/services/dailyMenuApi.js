const API_URL = import.meta.env.VITE_API_URL;

// Get the daily menu for a specific date
export const getDailyMenu = async (date) => {
  const response = await fetch(
    `${API_URL}/admin/daily-menu?date=${encodeURIComponent(date)}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const data = await response.json();

  // A missing daily menu is an expected state, not a fatal error.
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch daily menu.");
  }

  return data.dailyMenu;
};

// Create a daily menu for a specific date
export const createDailyMenu = async (date) => {
  const response = await fetch(`${API_URL}/admin/daily-menu`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ date }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create daily menu.");
  }

  return data.dailyMenu;
};

// Add an existing menu item to a daily menu
export const addMenuItemToDailyMenu = async (dailyMenuId, menuId) => {
  const response = await fetch(`${API_URL}/admin/daily-menu/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ dailyMenuId, menuId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add item to daily menu.");
  }

  return data.dailyMenuItem;
};

// Remove an item from a daily menu
export const removeMenuItemFromDailyMenu = async (dailyMenuItemId) => {
  const response = await fetch(
    `${API_URL}/admin/daily-menu/items/${encodeURIComponent(dailyMenuItemId)}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to remove item from daily menu.");
  }

  return data;
};

export const getUpcomingDailyMenus = async () => {
  const response = await fetch(`${API_URL}/admin/daily-menu/upcoming`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch upcoming menus.");
  }

  return data.dailyMenus;
};
