require('dotenv').config();

const express= require('express');

const cors = require('cors');
const cookieParser = require('cookie-parser');

const { connectDB, pool } = require('./config/db');

const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

const errorHandler = require('./middleware/errorHandler');

const app= express();

app.use(cors({
  origin:  process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Permitir el envío de cookies
}));

app.use(express.json())
app.use(cookieParser());
 
app.use(express.urlencoded({extended:true}))

// Rutas de diagnóstico
app.get('/api/health', async (req, res) => {
  try {
    // Verificar conexión a DB
    await pool.query('SELECT 1');
    
    res.json({ 
      success: true,
      status: 'online', 
      message: 'Sistema TaskFlow operativo',
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'degraded',
      message: 'Error de conexión con la base de datos',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta '${req.originalUrl}' no encontrada`
  });
});


app.use(errorHandler);

module.exports = app;
