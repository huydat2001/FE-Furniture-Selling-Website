import axios from "./axios.customize";
const getAllUserAPI = (current, pageSize) => {
  const URL_BACKEND = `/v1/api/user?page=${current}&limit=${pageSize}`;
  return axios.get(URL_BACKEND);
};
const createUserAPI = (value) => {
  const URL_BACKEND = "/v1/api/user";

  const data = {
    username: value.username,
    email: value.email,
    password: value.password,
    fullName: value.fullName,
    role: value.role,
    phone: value.phone,
    status: value.status,
    city: value.address?.[0] ?? undefined,
    state: value.address?.[1] ?? undefined,
    street: value.address?.[2] ?? undefined,
  };
  return axios.post(URL_BACKEND, data);
};
const updateUserAPI = (value) => {
  const URL_BACKEND = "/v1/api/user";
  const data = {
    id: value.id,
    password: value.password,
    fullName: value.fullName,
    role: value.role,
    phone: value.phone,
    city: value.address?.[0] ?? undefined,
    state: value.address?.[1] ?? undefined,
    street: value.address?.[2] ?? undefined,
  };
  return axios.put(URL_BACKEND, data);
};
const deleteUserAPI = (id) => {
  const URL_BACKEND = `/v1/api/user/${id}`;
  return axios.delete(URL_BACKEND);
};
export { getAllUserAPI, createUserAPI, updateUserAPI, deleteUserAPI };
