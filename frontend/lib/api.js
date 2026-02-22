import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },

  // 🔥 Allow 403 without throwing error
  validateStatus: function (status) {
    return (status >= 200 && status < 300) || status === 403;
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Generic request function
export async function apiRequest(endpoint, method = "GET", body) {
  try {
    const response = await api({
      method,
      url: endpoint,
      data: body,
    });

    return response.data;
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export default api;
