const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
  createCategoria,
  getAllCategorias,
  getCategoriaById,
  updateCategoria,
  deleteCategoria
} = require('../controllers/categoriaController');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// CRUD categorías
router.route('/')
  .get(getAllCategorias)
  .post(createCategoria);

router.route('/:id')
  .get(getCategoriaById)
  .put(updateCategoria)
  .delete(deleteCategoria);

module.exports = router;