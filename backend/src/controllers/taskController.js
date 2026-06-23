// Importamos el pool de conexiones a la base de datos
const { pool } = require('../config/db');

// ─────────────────────────────────────────────────────────────
// GET /api/tasks — Obtener TODAS las tareas
// ─────────────────────────────────────────────────────────────
const getAllTasks = async (req, res) => {
  try {
    const { status, priority, categoria_id } = req.query;
    const user_id = req.user.id; // Obtenemos el ID del usuario autenticado

    let usuarioFiltro = req.user.id;
    // Sólo los administradores pueden filtrar por otro usuario
    if (req.user.role === 'admin' && user_id) {
      usuarioFiltro = user_id;
    }

    let query = `
      SELECT
      t.id,
      t.title,
      t.description,
      t.status,
      t.priority,
      t.due_date,
      t.user_id,
      t.created_at,
      t.updated_at,
      t.categoria_id,
      c.nombre AS categoria,
      c.color AS categoria_color
      FROM tasks t
      LEFT JOIN categorias c ON c.id = t.categoria_id
      WHERE t.user_id = $1
    `;

    const params = [usuarioFiltro];
    let idx = 2;

    if (status) {
      query += ` AND t.status = $${idx}`;
      params.push(status);
      idx++;
    }

    if (priority) {
      query += ` AND t.priority = $${idx}`;
      params.push(priority);
      idx++;
    }

    if (categoria_id === 'sin_categoria') {
      query += ` AND t.categoria_id IS NULL`;
    }
    else if (categoria_id) {
      query += ` AND t.categoria_id = $${idx}`;
      params.push(categoria_id);
      idx++;
    }

    query += ` ORDER BY 
      CASE t.priority 
        WHEN 'high'   THEN 1 
        WHEN 'medium' THEN 2 
        WHEN 'low'    THEN 3 
      END,
      t.created_at DESC`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error('Error en getAllTasks:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las tareas' });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/tasks/:id — Obtener UNA tarea por su ID
// ─────────────────────────────────────────────────────────────
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT 
      t.*, 
      c.nombre AS categoria,
      c.color AS categoria_color
      FROM tasks t
      LEFT JOIN categorias c ON c.id = t.categoria_id
      WHERE t.id = $1 AND t.user_id = $2`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontró la tarea o no tienes permiso`
      });
    }

    res.json({ success: true, data: result.rows[0] });

  } catch (error) {
    console.error('Error en getTaskById:', error);
    res.status(500).json({ success: false, message: 'Error al obtener la tarea' });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/tasks — Crear una NUEVA tarea
// ─────────────────────────────────────────────────────────────
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, due_date, categoria_id } = req.body;
    const user_id = req.user.id;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El título de la tarea es obligatorio'
      });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, due_date, user_id, categoria_id) VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *`,
      [
        title.trim(),
        description || null,
        status || 'pending',
        priority || 'medium',
        due_date || null,
        user_id,
        categoria_id || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error en createTask:', error);
    res.status(500).json({ success: false, message: 'Error al crear la tarea' });
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/tasks/:id — Actualizar una tarea existente
// ─────────────────────────────────────────────────────────────
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, due_date, categoria_id } = req.body;
    const user_id = req.user.id;

    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El título de la tarea no puede estar vacío'
      });
    }

    // Verificamos que la tarea existe y pertenece al usuario
    const taskExists = await pool.query('SELECT id FROM tasks WHERE id = $1 AND user_id = $2', [id, user_id]);
    if (taskExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontró la tarea o no tienes permiso`
      });
    }

    const result = await pool.query(
      `UPDATE tasks SET
        title       = COALESCE($1, title),
        description = COALESCE($2, description),
        status      = COALESCE($3::task_status, status),
        priority    = COALESCE($4::task_priority, priority),
        due_date    = COALESCE($5, due_date),
        categoria_id = $6, 
        updated_at  = CURRENT_TIMESTAMP
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [
        title !== undefined ? title : null,
        description !== undefined ? description : null,
        (status && status.trim() !== '') ? status : null,
        (priority && priority.trim() !== '') ? priority : null,
        (due_date && due_date.trim() !== '') ? due_date : null,
        categoria_id !== undefined ? categoria_id : taskActual.categoria_id,
        id,
        user_id
      ]
    );

    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error en updateTask:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar la tarea' });
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/tasks/:id — Eliminar una tarea
// ─────────────────────────────────────────────────────────────
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id, title',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontró la tarea o no tienes permiso`
      });
    }

    res.json({
      success: true,
      message: `Tarea "${result.rows[0].title}" eliminada exitosamente`
    });

  } catch (error) {
    console.error('Error en deleteTask:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar la tarea' });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/tasks/stats — Estadísticas generales por usuario
// ─────────────────────────────────────────────────────────────
/**
 * Calcula el resumen de tareas agrupadas por estado para el dashboard.
 * Utiliza agregación directamente en SQL para mayor eficiencia.
 */
const getStats = async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'pending')     AS pending,
        COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress,
        COUNT(*) FILTER (WHERE status = 'completed')   AS completed,
        COUNT(*)                                        AS total
      FROM tasks
      WHERE user_id = $1
    `, [user_id]);

    res.json({
      success: true,
      data: {
        total: parseInt(result.rows[0].total) || 0,
        by_status: {
          pending: parseInt(result.rows[0].pending) || 0,
          in_progress: parseInt(result.rows[0].in_progress) || 0,
          completed: parseInt(result.rows[0].completed) || 0
        }
      }
    });

  } catch (error) {
    console.error('Error en getStats:', error);
    res.status(500).json({ success: false, message: 'Error al obtener estadísticas' });
  }
};

// Exportamos todas las funciones para usarlas en las rutas
module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask, getStats };