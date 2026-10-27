const API_URL = import.meta.env.VITE_API_URL;

// Get all menu items for the logged-in restaurant
export const getMenuItems = async () => {
  const response = await fetch(`${API_URL}/admin/menu-items`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch menu items.");
  }

  return data.menuItems;
};

// Create a new menu item
export const createMenuItem = async (menuItem) => {
  const response = await fetch(`${API_URL}/admin/menu-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(menuItem),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create menu item.");
  }

  return data.menuItem;
};

// Update an existing menu item
export const updateMenuItem = async (id, menuItem) => {
  const response = await fetch(`${API_URL}/admin/menu-items/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(menuItem),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update menu item.");
  }

  return data;
};

// Delete a menu item
export const deleteMenuItem = async (id) => {
  const response = await fetch(`${API_URL}/admin/menu-items/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete menu item.");
  }

  return data;
};

// Upload a menu item or restaurant image
export const uploadImage = async (imageFile, type = "dish") => {
  const formData = new FormData();

  formData.append("image", imageFile);
  formData.append("type", type);

  const response = await fetch(`${API_URL}/admin/upload-image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload image.");
  }

  return data;
};
