import api from "./api";

export const getTransactions = () => api.get("/transactions");
export const createTransaction = (data) => api.post("/transactions", data);
export const updateTransactionApi = (id, data) => api.put(`/transactions/${id}`, data);
export const deleteTransactionApi = (id) => api.delete(`/transactions/${id}`);
