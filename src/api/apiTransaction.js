import { apiClient } from "./apiClient";

export const apiTable = {
  getToken: async () => {
    const response = await apiClient.get("/api/token");
    return response.data.accessToken;
  },

  fetchLocations: async (userId) => {
    let endpoint = "";
    if ([114, 369, 370, 371, 372, 373].includes(userId)) {
      endpoint = "/api/getAllLocation";
    } else {
      endpoint = `/api/getByLocation?userId=${userId}`;
    }
    const response = await apiClient.get(endpoint);
    return response.data;
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
      : locationData.locationCodes && Array.isArray(locationData.locationCodes)
      ? locationData.locationCodes.map((location) => location.Code)
      : [];
    const locationParam =
      selectLocation === ""
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
      selectLocation === ""
        ? JSON.stringify(userLocations)
        : JSON.stringify([selectLocation]);

    const response = await apiClient.get(`/api/exportDataOn`, {
      responseType: "arraybuffer", // Menggunakan arraybuffer untuk file
      params: {
        location: locationParam,
        date: formattedDate,
      },
    });

    const nameLocation =
      selectLocationName === "AllLocation" ? locationData : selectLocationName;
    const fileName = `${nameLocation}_${formattedDate}.xlsx`;

    return {
      blob: new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateData: async (outTime, remarks, officer, idTransaction, accessToken) => {
    const requestBody = {
      outTime,
      remaks: remarks,
      officer,
      idTransaction,
    };

    const response = await apiClient.put(
      "/api/updateOutAndRemaks",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  },
};
