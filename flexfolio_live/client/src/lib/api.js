import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// ✅ CREATE PORTFOLIO
export const createPortfolio = async (data) => {
  const res = await api.post("/portfolio", data);
  return res.data;
};

// ✅ GET PORTFOLIO
export const getPortfolio = async (username) => {
  const res = await api.get(`/portfolio/${username}`);
  return res.data;
};

export const getCompany = async (query) => {
  const res = await api.get(`/company/search?q=${query}`);
  return res.data;
};

export const sendContactMessage = async (data) => {
  const res = await api.post("/owner/contact", data);
  return res.data;
};

export default api;