import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      error.response?.data?.message || error.message
    );

    return Promise.reject(error);
  }
);
// AUTH

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const verifyOTP = async (data) => {
  const res = await api.post("/auth/verify-otp", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const checkOtpAllowed = async (email) => {
  const res = await api.post("/auth/check-otp", { email });
  return res.data;
};

export const checkResetOtpAllowed = async (email) => {
  const res = await api.post("/auth/check-reset-otp", { email });
  return res.data;
};

// FORGOT PASSWORD

export const forgotPassword = async (data) => {
  const res = await api.post("/auth/forgot-password", data);
  return res.data;
};

export const resetPassword = async (data) => {
  const res = await api.post("/auth/reset-password", data);
  return res.data;
};

export const googleLogin = async (data) => {
  const res = await api.post("/auth/google-login", data);
  return res.data;
};


//  CREATE PORTFOLIO
export const createPortfolio = async (data) => {
  const res = await api.post("/portfolio", data);
  return res.data;
};

// GET PORTFOLIO
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

export const getMyPortfolios = async () => {
  const res = await api.get("/portfolio/me");
  return res.data;
};

export const getPortfolioById = async (id) => {
  const res = await api.get(`/portfolio/edit/${id}`);
  return res.data;
};

export const updatePortfolio = async (id,data) => {
  const res = await api.put(`/portfolio/${id}`,data);
  return res.data;
};

export const deletePortfolio = async (id) => {
  const res = await api.delete(`/portfolio/${id}`);
  return res.data;
};

export const updatePortfolioGeneralDetail = async (data) => {
  const res = await api.post(`/portfolio/general-details`,data);
  return res.data;
};

export const getPortfolioForManage = async (id) => {
  const res = await api.get(`/portfolio/manage/${id}`);
  return res.data;
};

export const publishPortfolio = async (id) => {
  const res = await api.get(`/portfolio/publish/${id}`);
  return res.data;
};

export const unpublishPortfolio = async (id) => {
  const res = await api.get(`/portfolio/unpublish/${id}`);
  return res.data;
};

export const sendPortfolioVerificationEmail = async (data) => {
  const res = await api.post(`/portfolio/send-verify-email`,data);
  return res.data;
};

export const verifyPortfolioEmailOtp = async (data) => {
  const res = await api.post(`/portfolio/verify-email`,data);
  return res.data;
};



// New Free Analytics 
export const trackAnalyticsEvent = async (data) => {
  const res = await api.post("/analytics/track", data);
  return res.data;
};

export const getAnalyticsSummary = async (portfolioId) => {
  const res = await api.get(`/analytics/summary/${portfolioId}`);
  return res.data;
};

export const getMyAnalyticsSummary = async () => {
  const res = await api.get("/analytics/me");
  return res.data;
};

// Setting page 
export const deleteAccountAPI = async () => {
  const res = await api.post("/auth/account-delete");
  return res.data;
};

export const updateProfileAPI = async (data) => {
  const res = await api.post("/auth/update-profile", data);
  return res.data;
};


export default api;