import axiosInstance from "./axiosInstance";

const accountAPI = {
  getAllAccept: () => axiosInstance.get("/account/accept"),
  acceptById: (values) => axiosInstance.post("/account/accept", values),
  getById: () => axiosInstance.get("/account/getById"),
  getAll: () => axiosInstance.get("/account"),
  getAllByKiotId: (kiotId) => axiosInstance.get(`/account?Did=${kiotId}`),
  create: (values) => axiosInstance.post("/account/create", values),
  update: (values) => axiosInstance.post("/account/update", values),
  uploadAvatar: (formData) =>
    axiosInstance.post("/account/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default accountAPI;
