import axiosInstance from "./axiosInstance";

const transactionAPI = {
  getAll: () => axiosInstance.get("/transaction"),
  getAllByKiotId: (kiotId) => axiosInstance.get(`/transaction?Did=${kiotId}`),
  getById: () => axiosInstance.get("/transaction/getById"),
  create: (transaction) => axiosInstance.post("/transaction/create", transaction),
  update: (transaction) => axiosInstance.post("/transaction/update", transaction),
};

export default transactionAPI;
