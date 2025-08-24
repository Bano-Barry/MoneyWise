import api from "./api";

export const getCategories = () => api.get("/catégories");
export const createCategory = (data) => api.post("/catégories", data);