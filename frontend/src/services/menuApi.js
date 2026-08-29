const API_URL = "http://localhost:5000/api";

export const getTodaysMenu = async () => {
  const response = await fetch(`${API_URL}/menu/today`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch today's menu");
  }

  return data;
};
