import axios from "axios";
import { authClient } from "./auth-client"; // Import client Better Auth

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.alfanialif.my.id",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menangani response dari Backend
api.interceptors.response.use(
  (response) => {
    return response; // Jika sukses, langsung kembalikan datanya
  },
  async (error) => {
    // Jika backend merespon 401 (Unauthorized / Session Expired)
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized");

      // Ini bukan hooks, jadi aman dipanggil di dalam pure JS/TS file
      await authClient.signOut();

      // Redirect user ke halaman login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
