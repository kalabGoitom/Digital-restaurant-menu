const API_URL = `${import.meta.env.VITE_API_URL}`;
export const getTodaysMenu = async () => {
  const response = await fetch(`${API_URL}/menu/today`);

  const data = await response.json();

  // The public API uses 404 to mean that an admin has not created today's
  // daily menu yet. For customers this is an expected empty-menu state.
  if (response.status === 404) {
    return { menuItems: [] };
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch today's menu");
  }

  return data;
};
