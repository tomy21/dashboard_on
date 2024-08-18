import { apiClient } from "./apiClient";
import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";

export const apiUsers = {
  login: async (email, password, key) => {
    try {
      const dataLogin = {
        email: email,
        password: password,
      };

      const encrypData = CryptoJS.AES.encrypt(
        JSON.stringify(dataLogin),
        key
      ).toString();

      const response = await apiClient.post("/api/login", {
        data: encrypData,
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.msg || "Login failed");
      } else {
        throw new Error("An error occurred. Please try again.");
      }
    }
  },
};

export const apiAuth = {
  refreshToken: async () => {
    try {
      const response = await apiClient.get("/api/token");
      const token = response.data.accessToken;
      const decode = jwtDecode(token);
      return {
        token,
        decode,
      };
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  logout: async () => {
    try {
      await apiClient.get("/api/logout");
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
};
