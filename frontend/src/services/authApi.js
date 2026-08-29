const API_URL = "http://localhost:5000/api";

export async function login(credentials) {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to log in.");
  return data.message;
}

export async function signup(details) {
  const response = await fetch(`${API_URL}/admin/signup`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(details),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to create the admin account.");
  return data.message;
}
