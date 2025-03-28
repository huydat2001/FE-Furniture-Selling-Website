import axios from "./axios.customize";
const getAllUserAPI = (current, pageSize) => {
  const URL_BACKEND = `/v1/api/user?page=${current}&limit=${pageSize}`;
  return axios.get(URL_BACKEND);
};
const createUserAPI = (value) => {
  console.log("value :>> ", value);
  const URL_BACKEND = "/v1/api/user";
  const data = {
    username: value.username,
    email: value.email,
    password: value.password,
    fullName: value.fullName,
    role: value.role,
    phone: value.phone,
    city: value.address[0],
    state: value.address[1],
    street: value.address[2],
  };
  return axios.post(URL_BACKEND, data);
};
export { getAllUserAPI, createUserAPI };
