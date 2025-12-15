// src/utils/api.js

const API_URL = "https://backend-finance-manager-jk34.onrender.com/api";

const getToken = () => localStorage.getItem("pfm_token");

const handleResponse = async (res) => {
  // 🔴 If backend returns HTML (404 / error page)
  const text = await res.text();

  try {
    const data = JSON.parse(text);

    if (!res.ok) {
      throw new Error(data.message || "API Error");
    }

    return data;
  } catch (err) {
    console.error("Invalid JSON response:", text);
    throw new Error("Server error. Check API URL.");
  }
};

const api = {
  get: async (url) => {
    const res = await fetch(`${API_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(res);
  },

  post: async (url, data) => {
    const res = await fetch(`${API_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  put: async (url, data) => {
    const res = await fetch(`${API_URL}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  delete: async (url) => {
    const res = await fetch(`${API_URL}${url}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(res);
  },
};

export default api;
