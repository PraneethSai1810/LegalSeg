import axios from "axios";
import { toast } from "react-toastify";
import { loadingEmitter } from "../utils/loadingEmitter"; // ✅ we'll create this next


const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create an Axios instance (so you don’t repeat headers, baseURL, etc.)
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // for cookies if your backend uses them
});

// Automatically include JWT token if stored
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.request.use((config) => {
  loadingEmitter.emit("start"); // 🔥 show spinner
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    loadingEmitter.emit("stop"); // ✅ hide spinner
    return response;
  },
  (error) => {
    loadingEmitter.emit("stop"); // ✅ hide spinner even on error
    if (!error.response) {
      toast.error("Network error — please check your connection.");
    } else {
      const status = error.response.status;
      const message =
        error.response.data?.message ||
        (status >= 500
          ? "Server error. Please try again later."
          : "Something went wrong. Please try again.");
      toast.error(message);
    }
    return Promise.reject(error);
  }
);


// ✅ Global error + network handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error (server down or no internet)
      toast.error("Network error — please check your connection.");
    } else {
      // API responded with an error (e.g., 400, 500)
      const status = error.response.status;
      const message =
        error.response.data?.message ||
        (status >= 500
          ? "Server error. Please try again later."
          : "Something went wrong. Please try again.");

      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// ================= AUTH =================

// User Signup
export const registerUser = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

// User Login
export const loginUser = async (userData) => {
  const { data } = await api.post("/auth/login", userData);
  return data;
};

// ================= PROFILE =================

// Fetch profile
export const getUserProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};

// Update profile name
export const updateUserProfile = async (updatedData) => {
  const { data } = await api.put("/auth/profile", updatedData);
  return data;
};

// Send OTP to user's email
export const sendOtp = async (email) => {
  const { data } = await api.post("/auth/send-otp", { email });
  return data;
};

// Verify OTP
export const verifyOtp = async (email, otp) => {
  const { data } = await api.post("/auth/verify-otp", { email, otp });
  return data;
};

// Reset password
export const resetPassword = async (email, newPassword) => {
  const { data } = await api.post("/auth/reset-password", { email, newPassword });
  return data;
};

// ================= DOCUMENTS =================

// Upload document (file or text) with progress tracking
export const uploadDocument = async (fileOrText, onProgress) => {
  const formData = new FormData();

  if (fileOrText instanceof File) {
    formData.append("file", fileOrText);
  } else {
    formData.append("text", fileOrText);
    formData.append("title", "pasted-text.txt");
  }

  const { data } = await api.post("/cases/upload", formData, {
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return data; // { document, results }
};

// Fetch all documents (case history) for current user
export const getDocumentHistory = async () => {
  const { data } = await api.get("/cases");
  return data.documents; // array of user's cases
};

// Fetch specific document results by id
export const getDocumentResults = async (documentId) => {
  const { data } = await api.get(`/cases/${documentId}`);
  return data.document; // single case object
};

// (Optional) Delete document later if needed
export const deleteDocument = async (documentId) => {
  console.warn("Delete endpoint not implemented in backend yet");
  return { message: "Mock delete - not implemented" };
};

export default api;
