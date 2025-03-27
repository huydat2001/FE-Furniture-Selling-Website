import axios from "./axios.customize";
const getAllUserAPI = (current, pageSize) => {
  const URL_BACKEND = `/v1/api/user?page=${current}&limit=${pageSize}`;
  return axios.get(URL_BACKEND);
};
export { getAllUserAPI };
