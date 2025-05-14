import axios from "./axios.customize";

export const getTotalRevenueAPI = (filters = {}) => {
  let URL_BACKEND = `/v1/api/analytics/total-revenue`;
  const { period, startDate, endDate } = filters;
  const params = new URLSearchParams();
  if (period) params.append("period", period);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (params.toString()) URL_BACKEND += `?${params.toString()}`;

  return axios.get(URL_BACKEND);
};
export const getTotalOrderAPI = (filters = {}) => {
  let URL_BACKEND = `/v1/api/analytics/total-order`;
  const { period, startDate, endDate } = filters;
  const params = new URLSearchParams();
  if (period) params.append("period", period);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (params.toString()) URL_BACKEND += `?${params.toString()}`;
  return axios.get(URL_BACKEND);
};
export const getCancellationRateAPI = (filters = {}) => {
  let URL_BACKEND = `/v1/api/analytics/cancellation-rate`;
  const { period, startDate, endDate } = filters;
  const params = new URLSearchParams();
  if (period) params.append("period", period);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (params.toString()) URL_BACKEND += `?${params.toString()}`;
  return axios.get(URL_BACKEND);
};
export const getTotalSoldProductsAPI = (filters = {}) => {
  let URL_BACKEND = `/v1/api/analytics/total-sold-products`;
  const { period, startDate, endDate } = filters;
  const params = new URLSearchParams();
  if (period) params.append("period", period);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (params.toString()) URL_BACKEND += `?${params.toString()}`;
  return axios.get(URL_BACKEND);
};
export const getProcessingOrdersAPI = (filters = {}) => {
  let URL_BACKEND = `/v1/api/analytics/processing-orders`;
  const { period, startDate, endDate } = filters;
  const params = new URLSearchParams();
  if (period) params.append("period", period);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (params.toString()) URL_BACKEND += `?${params.toString()}`;
  return axios.get(URL_BACKEND);
};
export const getCurrentCustomersAPI = (filters = {}) => {
  let URL_BACKEND = `/v1/api/analytics/current-customers`;
  const { period, startDate, endDate } = filters;
  const params = new URLSearchParams();
  if (period) params.append("period", period);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (params.toString()) URL_BACKEND += `?${params.toString()}`;
  return axios.get(URL_BACKEND);
};
export const getRevenueByPeriod = (filters = {}) => {
  let URL_BACKEND = `/v1/api/analytics/revenue-by-period`;
  const { period, startDate, endDate } = filters;
  const params = new URLSearchParams();
  if (period) params.append("period", period);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (params.toString()) URL_BACKEND += `?${params.toString()}`;
  return axios.get(URL_BACKEND);
};
export const getOrderCountByStatus = (filters = {}) => {
  let URL_BACKEND = `/v1/api/analytics/order-by-status`;
  const { period, startDate, endDate } = filters;
  const params = new URLSearchParams();
  if (period) params.append("period", period);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (params.toString()) URL_BACKEND += `?${params.toString()}`;
  return axios.get(URL_BACKEND);
};
