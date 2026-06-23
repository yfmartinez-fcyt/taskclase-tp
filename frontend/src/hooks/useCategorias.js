import { useState, useEffect } from 'react';
import * as categoriaService from '../services/categoriaService';

export const useCategorias = () => {

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargarCategorias = async () => {

    try {

      setLoading(true);

      const categorias =
        await categoriaService.getCategorias();

      setCategorias(categorias || []);

      setError('');

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        'Error al cargar categorías'
      );

    } finally {

      setLoading(false);

    }
  };

const crearCategoria = async (categoria) => {

  try {

    const nuevaCategoria =
      await categoriaService.createCategoria(categoria);

    setCategorias(prev => [
      ...prev,
      nuevaCategoria
    ]);

    return nuevaCategoria;

  } catch (err) {

    console.error(err);

    setError(
      err.message ||
      'Error al crear categoría'
    );

    throw err;
  }
};
const editarCategoria = async (
  id,
  categoria
) => {

  try {

    const categoriaActualizada =
      await categoriaService.updateCategoria(
        id,
        categoria
      );

    setCategorias(prev =>
      prev.map(cat =>
        cat.id === id
          ? categoriaActualizada
          : cat
      )
    );

    return categoriaActualizada;

  } catch (err) {

    console.error(err);

    setError(
      err.message ||
      'Error al actualizar categoría'
    );

    throw err;
  }
};
const eliminarCategoria = async (id) => {

  try {

    await categoriaService.deleteCategoria(id);

    setCategorias(prev =>
      prev.filter(cat => cat.id !== id)
    );

  } catch (err) {

    console.error(err);

    setError(
      err.message ||
      'Error al eliminar categoría'
    );

    throw err;
  }
};
  useEffect(() => {
    cargarCategorias();
  }, []);

  return {
  categorias,
  loading,
  error,

  cargarCategorias,
  crearCategoria,
  editarCategoria,
  eliminarCategoria
};
};