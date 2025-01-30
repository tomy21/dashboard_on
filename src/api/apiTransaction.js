import { apiClient } from './apiClient';

export const apiTable = {
    getToken: async () => {
        const response = await apiClient.get('/api/token');
        return response.data.accessToken;
    },

    fetchLocations: async () => {
        try {
            const response = await apiClient.get('/api/getLocation-byuser');
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },

    getData: async (
        limit,
        selectLocation,
        pages,
        search,
        formattedDate,
        locationData,
        accessToken
    ) => {
        const codes = Array.isArray(locationData)
            ? locationData.map((location) => location.Code)
            : locationData.locationCodes &&
              Array.isArray(locationData.locationCodes)
            ? locationData.locationCodes.map((location) => location.Code)
            : [];
        const locationParam =
            selectLocation === ''
                ? JSON.stringify(codes)
                : JSON.stringify([selectLocation]);

        const response = await apiClient.get(`/api/getDatabyLocation`, {
            params: {
                limit,
                location: locationParam,
                page: pages,
                keyword: search,
                date: formattedDate,
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    },

    handleExport: async (
        selectLocation,
        formattedDate,
        userLocations,
        selectLocationName,
        locationData
    ) => {
        const locationParam =
            selectLocation === ''
                ? JSON.stringify(userLocations)
                : JSON.stringify([selectLocation]);

        const response = await apiClient.get(`/api/exportDataOn`, {
            responseType: 'arraybuffer', // Menggunakan arraybuffer untuk file
            params: {
                location: locationParam,
                date: formattedDate,
            },
        });

        const nameLocation =
            selectLocationName === 'AllLocation'
                ? locationData
                : selectLocationName;
        const fileName = `${nameLocation}_${formattedDate}.xlsx`;

        return {
            blob: new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
            fileName,
        };
    },

    uploadFile: async (locationCode, formData, accessToken) => {
        const response = await apiClient.post(
            `/api/upload/dataOverNight?locationCode=${locationCode}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    updateData: async (idUser, category, remarks) => {
        try {
            const response = await apiClient.patch(
                `/api/update-status/${idUser}`,
                {
                    category: category,
                    remarks: remarks,
                }
            );

            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },

    getLocationByUsers: async (page, limit, startDate, keyword) => {
        try {
            const response = await apiClient.get('/api/getAllOverNightCMS', {
                params: {
                    page,
                    limit,
                    startDate,
                    keyword,
                },
            });
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },

    getDataPOST: async (locationCode) => {
        try {
            const response = await apiClient.get(
                `/api/input-transaction-post?locationCode=${locationCode}`
            );
            return response;
        } catch (error) {
            return error.response.data;
        }
    },
};

export const DashboardService = {
    getValue: async (date) => {
        try {
            const response = await apiClient.get('/api/dashboard-count', {
                params: {
                    date,
                },
            });
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    getTopLocation: async (date) => {
        try {
            const response = await apiClient.get('/api/dashboard-topLocation', {
                params: {
                    date,
                },
            });
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    getTopStatus: async (date) => {
        try {
            const response = await apiClient.get('/api/dashboard-topStatus', {
                params: {
                    date,
                },
            });
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },

    getDataChartBar: async (month) => {
        try {
            const response = await apiClient.get('/api/status/total', {
                params: {
                    month,
                },
            });
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },

    getDataChartDonut: async (date) => {
        try {
            const response = await apiClient.get('/api/status/percentage', {
                params: {
                    date,
                },
            });
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
};
