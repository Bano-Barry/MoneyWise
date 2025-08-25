import api from "./api";
import type { NewCategory } from "../types";

export const getCategories = async (type = '') => {
  const response = await api.get(`/categories${type ? `?type=${type}` : ''}`);
  return response.data;
};

export const createCategory = async (categoryData: NewCategory) => {
  const response = await api.post("/categories", categoryData);
  return response.data;
};

// Fonctions à implémenter quand l'API sera prête
// export const updateCategory = async (id, categoryData) => {
//   const response = await api.put(`/categories/${id}`, categoryData);
//   return response.data;
// };
//
// export const deleteCategory = async (id) => {
//   const response = await api.delete(`/categories/${id}`);
//   return response.data;
// };