import type { scheduleEvent, teacher } from "./types";
import axios from "axios";
import Cookies from "js-cookie";

// Cấu hình Axios Client
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Helper để log lỗi chi tiết
const logErrorDetails = (error: any) => {
  if (axios.isAxiosError(error)) {
    console.error("Axios Error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
    });
  } else {
    console.error("Error:", error instanceof Error ? error.message : String(error));
  }
};

// Interceptors
apiClient.interceptors.request.use(config => {
  const token = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken");
        const response = await apiClient.post("/auth/refresh", { refreshToken });
        const { accessToken } = response.data;
        Cookies.set(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// API functions
export const fetchTeachers = async (): Promise<teacher[]> => {
  try {
    const response = await apiClient.get("/api/teachers");
    return response.data;
  } catch (error) {
    logErrorDetails(error);
    throw new Error("Failed to fetch teachers");
  }
};

export const fetchSchedule = async (): Promise<scheduleEvent[]> => {
  try {
    const response = await apiClient.get("/api/schedule");
    return response.data;
  } catch (error) {
    logErrorDetails(error);
    throw new Error("Failed to fetch schedule");
  }
};

export const createScheduleEvent = async (eventData: Partial<scheduleEvent>): Promise<scheduleEvent> => {
  try {
    console.group("DEBUG - Create Schedule Event");
    console.log("Request URL:", `${apiClient.defaults.baseURL}/api/schedule`);
    console.log("Request Method: POST");
    console.log("Request Headers:", {
      'Content-Type': 'application/json',
      'Authorization': Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken") ? 
                       `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")}` : 'None'
    });
    console.log("Request Payload:", JSON.stringify(eventData, null, 2));
    
    const response = await apiClient.post("/api/schedule", eventData);
    
    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);
    console.groupEnd();
    
    return response.data;
  } catch (error) {
    console.group("DEBUG - Create Schedule Event Error");
    logErrorDetails(error);
    if (axios.isAxiosError(error) && error.response) {
      console.log("Error Response Data:", error.response.data);
    }
    console.groupEnd();
    throw new Error("Failed to create schedule event");
  }
};

export const updateScheduleEvent = async (id: number, eventData: Partial<scheduleEvent>): Promise<scheduleEvent> => {
  try {
    const response = await apiClient.put(`/api/schedule/${id}`, eventData);
    return response.data;
  } catch (error) {
    logErrorDetails(error);
    throw new Error("Failed to update schedule event");
  }
};

export const deleteScheduleEvent = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/schedule/${id}`);
  } catch (error) {
    logErrorDetails(error);
    throw new Error("Failed to delete schedule event");
  }
};

// Export tất cả các hàm API
export default {
  fetchTeachers,
  fetchSchedule,
  createScheduleEvent,
  updateScheduleEvent,
  deleteScheduleEvent,
  apiClient,
};