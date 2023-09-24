import axiosInstance from "./axiosInstance";

const customerAPI = {
  getAll: () => axiosInstance.get("/customer"),
  getAllByKiotId: (kiotId) => axiosInstance.get(`/customer?Did=${kiotId}`),
  getById: () => axiosInstance.get("/customer/getById"),
  create: (values) => axiosInstance.post("/customer/create", values),
  update: (values) => axiosInstance.post("/customer/update", values),
};

export default customerAPI;
