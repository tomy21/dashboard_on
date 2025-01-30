import axios from 'axios';

export const apiClient = axios.create({
    // baseURL: process.env.REACT_APP_BASE_URL,
    // baseURL: "http://localhost:3002",
    baseURL: 'https://on-api.skyparking.online',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});
