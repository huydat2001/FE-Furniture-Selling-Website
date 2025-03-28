import axios from "./axios.customize.address";

const getProvinceAPI = () => {
  const URL_ADDRESS = "/province";
  return axios.get(URL_ADDRESS);
};
const getDistrictAPI = (provinceId) => {
  const URL_ADDRESS = "/district";
  return axios.get(URL_ADDRESS, {
    params: { province_id: provinceId }, // Truyền ProvinceID
  });
};
const getWardAPI = (district) => {
  const URL_ADDRESS = `/ward?district_id=${district}`;
  return axios.get(URL_ADDRESS);
};
export { getProvinceAPI, getDistrictAPI, getWardAPI };
