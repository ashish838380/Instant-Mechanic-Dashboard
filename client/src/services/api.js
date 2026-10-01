import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

export const getDashboard = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get("/analytics");
  return response.data;
};

export const getBookings = async (params = {}) => {
  const response = await api.get("/bookings", {
    params,
  });
  return response.data;
};

export const getMechanics = async () => {
  const response = await api.get("/mechanics");
  return response.data;
};

export default api;
