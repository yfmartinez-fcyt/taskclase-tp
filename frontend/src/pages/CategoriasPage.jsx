import { useState } from 'react';

import { useCategorias } from '../hooks/useCategorias';

import SectionCard from '../components/layout/SectionCard';

import Button from '../components/ui/Button';

import CategoriaTable from '../components/categorias/CategoriaTable';
import CategoriaForm from '../components/categorias/CategoriaForm';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmModal from '../components/common/ConfirmModal';

const CategoriasPage = () => {

  const {
    categorias,
    loading,
    error,

    crearCategoria,
    editarCategoria,
    eliminarCategoria
  } = useCategorias();

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [categoriaEditando, setCategoriaEditando] =
    useState(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  // ─────────────────────────────
  // Nueva categoría
  // ─────────────────────────────

  const handleNuevaCategoria = () => {

    setCategoriaEditando(null);

    setMostrarFormulario(true);
  };

  // ─────────────────────────────
  // Editar categoría
  // ─────────────────────────────

  const handleEditar = (categoria) => {

    setCategoriaEditando(categoria);

    setMostrarFormulario(true);
  };

  // ─────────────────────────────
  // Guardar categoría
  // ─────────────────────────────

  const handleGuardar = async (datos) => {

    try {

      if (categoriaEditando) {

        await editarCategoria(
          categoriaEditando.id,
          datos
        );

      } else {

        await crearCategoria(datos);

      }

      setMostrarFormulario(false);

      setCategoriaEditando(null);

    } catch (error) {

      console.error(error);

    }
  };

  // ─────────────────────────────
  // Abrir modal eliminar
  // ─────────────────────────────

  const handleEliminar = (categoria) => {

    setCategoriaSeleccionada(categoria);

    setShowDeleteModal(true);
  };

  // ─────────────────────────────
  // Confirmar eliminación
  // ─────────────────────────────

  const confirmarEliminacion = async () => {

    if (!categoriaSeleccionada) return;

    try {

      setDeleting(true);

      await eliminarCategoria(
        categoriaSeleccionada.id
      );

      setShowDeleteModal(false);

      setCategoriaSeleccionada(null);

    } catch (error) {

      console.error(error);

    } finally {

      setDeleting(false);

    }
  };

  // ─────────────────────────────
  // Cancelar eliminación
  // ─────────────────────────────

  const cancelarEliminacion = () => {

    setShowDeleteModal(false);

    setCategoriaSeleccionada(null);
  };

  return (
    <div className="container mx-auto px-4">

      <SectionCard title="Gestión de Categorías">

        {/* Botón Nueva Categoría */}

        <div className="flex justify-end mb-6">

          <Button
            variant="primary"
            onClick={handleNuevaCategoria}
          >
            + Nueva Categoría
          </Button>

        </div>

        {/* Error */}

        {error && (
          <ErrorMessage
            message={error}
          />
        )}

        {/* Formulario */}

        {mostrarFormulario && (

          <div className="mb-6">

            <CategoriaForm
              categoria={categoriaEditando}
              onGuardar={handleGuardar}
              onCancelar={() => {

                setMostrarFormulario(false);

                setCategoriaEditando(null);

              }}
            />

          </div>

        )}

        {/* Tabla */}

        {loading ? (

          <Loading />

        ) : (

          <CategoriaTable
            categorias={categorias}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
          />

        )}

      </SectionCard>

      {/* Modal eliminar */}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Eliminar Categoría"
        message={
          categoriaSeleccionada
            ? `¿Deseas eliminar la categoría "${categoriaSeleccionada.nombre}"?`
            : ''
        }
        onConfirm={confirmarEliminacion}
        onCancel={cancelarEliminacion}
        loading={deleting}
      />

    </div>
  );
};

export default CategoriasPage;