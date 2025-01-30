import { apiClient } from './apiClient';
import { jwtDecode } from 'jwt-decode';

export const apiUsers = {
    login: async (identifier, password) => {
        try {
            const response = await apiClient.post('/api/auth/login', {
                identifier: identifier,
                password: password,
            });

            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.msg || 'Login failed');
            } else {
                throw new Error('An error occurred. Please try again.');
            }
        }
    },

    getUserbyId: async (userId) => {
        try {
            const response = await apiClient.get('api/getByLocation', {
                params: { userId },
            });
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },

    verifyToken: async () => {
        try {
            const response = await apiClient.get('/api/auth/protected');
            return response.data;
        } catch (error) {
            const serverError = error.response?.data || {
                message: 'Unknown error',
            };
            console.warn('Server validation error:', serverError);
            return serverError;
        }
    },

    getAllUserByLocation: async (page, limit, search) => {
        try {
            const response = await apiClient.get(
                '/api/auth/getuser-bylocation',
                {
                    params: {
                        page,
                        limit,
                        search,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },

    register: async (data) => {
        try {
            const response = await apiClient.post('/api/auth/register', data);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },

    getDetail: async (idUser) => {
        try {
            const response = await apiClient.get(`/api/auth/getById/${idUser}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },

    getListLocation: async () => {
        try {
            const response = await apiClient.get(`/api/auth/getdetail-login`);
            return response.data.data;
        } catch (error) {
            return error.response.data;
        }
    },
};

export const apiAuth = {
    refreshToken: async () => {
        try {
            const response = await apiClient.get('/api/token');
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
            await apiClient.get('/api/auth/logout');
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },
};
