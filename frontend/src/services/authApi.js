const API_URL = import.meta.env.VITE_API_URL;

const signupPlatformAdmin = async (formData) => {
  const response = await fetch(`${API_URL}/platform-admin/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Signup failed.");
  }

  return data;
};

const loginPlatformAdmin = async (formData) => {
  const response = await fetch(`${API_URL}/platform-admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Login failed.");
  }
  return data;
};

const getCurrentPlatformAdmin = async () => {
  const response = await fetch(`${API_URL}/platform-admin/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Authentication required.");
  }

  return data.admin;
};

export { signupPlatformAdmin, loginPlatformAdmin, getCurrentPlatformAdmin };
