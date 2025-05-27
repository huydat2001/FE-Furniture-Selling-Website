import axios from "./axios.customize";

const loginAPI = async (value) => {
  const URL_BACKEND = `/v1/api/auth/login`;
  const data = {
    username: value.username,
    password: value.password,
  };
  return axios.post(URL_BACKEND, data);
};
const getAccountAPI = () => {
  const URL_BACKEND = `/v1/api/auth/account`;
  return axios.get(URL_BACKEND);
};
const registerAPI = async (value) => {
  const URL_BACKEND = `/v1/api/register`;
  return axios.post(URL_BACKEND, value);
};

const verifyEmailAPI = async (value) => {
  const URL_BACKEND = `/v1/api/verify-email`;
  return axios.post(URL_BACKEND, value);
};

const forgotPasswordAPI = async (value) => {
  const URL_BACKEND = `/v1/api/forgot-password`;
  return axios.post(URL_BACKEND, value);
};

const resetPasswordAPI = async (value) => {
  const URL_BACKEND = `/v1/api/reset-password`;
  return axios.post(URL_BACKEND, value);
};
export {
  loginAPI,
  getAccountAPI,
  registerAPI,
  verifyEmailAPI,
  forgotPasswordAPI,
  resetPasswordAPI,
};
