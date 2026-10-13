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

export { signupPlatformAdmin };
