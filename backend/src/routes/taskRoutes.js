const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getStats
} = require('../controllers/taskController');

// Todas las rutas de tareas requieren autenticación
router.use(authMiddleware);

router.get('/stats', getStats);
router.route('/').get(getAllTasks).post(createTask);
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

module.exports=router;