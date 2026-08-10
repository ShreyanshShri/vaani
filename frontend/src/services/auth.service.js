import api from "./api";

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data?.data ?? null;
};

export const signupUser = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response.data?.data ?? null;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/current-user");
  return response.data?.data ?? null;
};

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh-token");
  return response.data?.data ?? null;
};
