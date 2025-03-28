import axios from "axios";
const GHN_TOKEN = import.meta.env.VITE_TOKEN_GHN;
const instance = axios.create({
  baseURL: import.meta.env.VITE_ADDRESS_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
instance.interceptors.request.use(
  function (config) {
    config.headers["Token"] = GHN_TOKEN;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  function (response) {
    if (response.data && response.data.data) return response.data;
    return response;
  },
  function (error) {
    if (error.response && error.response.data) return error.response.data;
    return Promise.reject(error);
  }
);
export default instance;
