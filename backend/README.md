# TaskFlow

Sistema de gestión de tareas (Backend).

## Documentación de la API

Referencia completa de endpoints (auth, tareas, categorías, usuarios):

👉 **[Documentación de la API (API.md)](API.md)**

## Base de datos

1. Crear la base de datos: `CREATE DATABASE taskflow;`
2. Ejecutar el esquema: `psql -U postgres -d taskflow -f database.sql`

El archivo `database.sql` incluye tablas de usuarios, tareas, categorías, refresh tokens e índices.

## Configuración del proyecto

1. Instalar dependencias: `npm install`
2. Copiar y completar `.env` desde `.env.template`
3. Desarrollo: `npm run dev`
4. Producción: `npm start`
