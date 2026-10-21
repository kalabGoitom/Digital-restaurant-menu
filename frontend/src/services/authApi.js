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

const signupRestaurantAdmin = async (formData) => {
  const response = await fetch(`${API_URL}/admin/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Restaurant signup failed.");
  }

  return data;
};

const loginRestaurantAdmin = async (formData) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Restaurant login failed.");
  }

  return data;
};

const verifyRestaurantEmail = async (formData) => {
  const response = await fetch(`${API_URL}/admin/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Email verification failed.");
  }

  return data;
};

const resendRestaurantVerificationCode = async (formData) => {
  const response = await fetch(`${API_URL}/admin/resend-verification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not resend the verification code.");
  }

  return data;
};

const logoutRestaurantAdmin = async () => {
  const response = await fetch(`${API_URL}/admin/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Logout failed.");
  }

  return data;
};

const getCurrentRestaurantAdmin = async () => {
  const response = await fetch(`${API_URL}/admin/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Authentication required.");
  }

  return data.admin;
};

export {
  signupPlatformAdmin,
  loginPlatformAdmin,
  getCurrentPlatformAdmin,
  loginRestaurantAdmin,
  signupRestaurantAdmin,
  getCurrentRestaurantAdmin,
  logoutRestaurantAdmin,
  verifyRestaurantEmail,
};
