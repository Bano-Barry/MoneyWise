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

export const updateCategory = async (id: number, categoryData: NewCategory) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id: number) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};