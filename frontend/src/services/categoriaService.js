import axiosClient from '../api/axiosClient';

export const getCategorias = async () => {
  const response = await axiosClient.get('/categorias');
  return response.data.data;
};

export const getCategoriaById = async (id) => {
  const response = await axiosClient.get(`/categorias/${id}`);
  return response.data.data;
};

export const createCategoria = async (categoria) => {
  const response = await axiosClient.post('/categorias', categoria);
  return response.data.data;
};

export const updateCategoria = async (id, categoria) => {
  const response = await axiosClient.put(`/categorias/${id}`, categoria);
  return response.data.data;
};

export const deleteCategoria = async (id) => {
  const response = await axiosClient.delete(`/categorias/${id}`);
  return response.data;
};