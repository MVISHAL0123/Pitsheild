const API_URL = "http://localhost:5000/api";

// Helper: fetch with timeout
const fetchWithTimeout = async (url, options = {}, timeoutMs = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(id);
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw error;
  }
};

export const api = {
  // Login
  login: async (email, password, role) => {
    const body = { email, password };
    if (role) body.role = role;
    return fetchWithTimeout(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  },

  // Register a new account (role optional: user/admin/maintenance)
  register: async (name, email, password, phone, role) => {
    const body = { name, email, password };
    if (phone) body.phone = phone;
    if (role) body.role = role;
    return fetchWithTimeout(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  },

  // Get potholes (with optional filters and pagination)
  getPotholes: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.severity) params.set("severity", filters.severity);
    if (filters.page) params.set("page", filters.page);
    if (filters.limit) params.set("limit", filters.limit);

    const query = params.toString();
    return fetchWithTimeout(`${API_URL}/potholes${query ? `?${query}` : ""}`);
  },

  // Get single pothole
  getPotholeById: async (id) => {
    return fetchWithTimeout(`${API_URL}/potholes/${id}`);
  },

  // Create pothole complaint
  createPothole: async (data) => {
    return fetchWithTimeout(`${API_URL}/potholes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  // Update pothole status
  updatePotholeStatus: async (id, data) => {
    // data can be { status } or { status, assignedTo }
    const body = typeof data === "string" ? { status: data } : data;
    return fetchWithTimeout(`${API_URL}/potholes/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  },

  // Get teams
  getTeams: async () => {
    return fetchWithTimeout(`${API_URL}/teams`);
  },

  // Create team
  createTeam: async (data) => {
    return fetchWithTimeout(`${API_URL}/teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
};
