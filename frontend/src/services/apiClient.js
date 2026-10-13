// The only place that knows the backend URL and calls fetch().
// Auth headers/credentials for the admin areas will be added here later.
const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status; // HTTP status, or 0 for network failures
  }
}

export async function apiGet(path, { signal } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      signal,
      headers: { Accept: 'application/json' },
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('Network error', 0);
  }
  if (!response.ok) throw new ApiError(`Request failed (${response.status})`, response.status);
  return response.json();
}
