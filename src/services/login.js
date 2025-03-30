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
export { loginAPI, getAccountAPI };
