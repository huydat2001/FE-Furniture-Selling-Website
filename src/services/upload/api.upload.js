import axios from "../axios.customize";

const handleUploadFile = (file, folder) => {
  const URL_BACKEND = `/v1/api/upload`;

  let config = {
    headers: {
      folder: folder,
      "Content-type": "multipart/form-data",
    },
  };
  const bodyFormData = new FormData();
  bodyFormData.append("image", file);
  return axios.post(URL_BACKEND, bodyFormData, config);
};
const handleUploadFileMultiple = (files, folder) => {
  const URL_BACKEND = `/v1/api/uploadmultiple`;
  let config = {
    headers: {
      folder: folder,
      "Content-type": "multipart/form-data",
    },
  };
  const bodyFormData = new FormData();
  files.forEach((item) => {
    bodyFormData.append("images", item.file); // Append từng file
  });
  return axios.post(URL_BACKEND, bodyFormData, config);
};

export { handleUploadFile, handleUploadFileMultiple };
