import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  // baseURL: "http://localhost:3008",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
