// Pool de conexiones a la base de datos
const { pool } = require('../config/db');

// ─────────────────────────────────────────────────────────────
// GET /api/categorias — Obtener TODAS las categorías
// ─────────────────────────────────────────────────────────────
const getAllCategorias = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT * FROM categorias WHERE user_id = $1 ORDER BY nombre`,
      [user_id]
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error en getAllCategorias:', error);
    res.status(500).json({ success: false, message: 'Error al obtener categorías' });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/categorias — Crear una NUEVA categoria
// ─────────────────────────────────────────────────────────────
const createCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, color } = req.body;
    const user_id = req.user.id;

    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre es obligatorio'
      });
    }

    const result = await pool.query(
      `INSERT INTO categorias (nombre, descripcion, color, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        nombre.trim(),
        descripcion || null,
        color || '#CCCCCC',
        user_id
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error en createCategoria:', error);
    res.status(500).json({ success: false, message: 'Error al crear categoría' });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/categorias/:id — Obtener UNA categoría por su ID
// ─────────────────────────────────────────────────────────────
const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT * FROM categorias WHERE id = $1 AND user_id = $2`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error en getCategoriaById:', error);
    res.status(500).json({ success: false, message: 'Error al obtener categoría' });
  }
};
// ─────────────────────────────────────────────────────────────
// PUT /api/categorias/:id — Actualizar una categoría existente
// ─────────────────────────────────────────────────────────────
const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, color } = req.body;
    const user_id = req.user.id;

    const result = await pool.query(
      `UPDATE categorias SET
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        color = COALESCE($3, color)
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [nombre, descripcion, color, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Categoría actualizada',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error en updateCategoria:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar categoría' });
  }
};
// ─────────────────────────────────────────────────────────────
// DELETE /api/categorias/:id — Eliminar una categoría
// ─────────────────────────────────────────────────────────────
const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      `DELETE FROM categorias
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Categoría eliminada correctamente'
    });

  } catch (error) {
    console.error('Error en deleteCategoria:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar categoría' });
  }
};

module.exports = {
  createCategoria,
  getAllCategorias,
  getCategoriaById,
  updateCategoria,
  deleteCategoria
};