import axios from "axios";
import { getAuthToken } from "./auth";

/**
 * @author Ankur Mundra on June, 2023
 */

const axiosClient = axios.create({
  baseURL: "http://localhost:3002",
  timeout: 10000, // Increased from 1000ms to 10 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    // Attach the token only if it exists and is valid
    if (token && token !== "EXPIRED") {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Always return the config, not all routes need an Authorization header, this is the APIs responsibility.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data, error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
