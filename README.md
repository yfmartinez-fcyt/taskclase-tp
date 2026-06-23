# TaskFlow

Aplicación Full Stack para la gestión de tareas desarrollada con React, Node.js, Express y PostgreSQL.

Permite a los usuarios crear, organizar y administrar tareas mediante autenticación JWT, categorías personalizadas y control de acceso basado en roles.

---

## Características

* Autenticación con JWT y Refresh Tokens.
* Registro e inicio de sesión.
* Gestión completa de tareas (CRUD).
* Gestión de categorías personalizadas.
* Roles de usuario y administrador.
* Estadísticas de tareas.
* API REST protegida.
* Persistencia de datos en PostgreSQL.

---

## Tecnologías Utilizadas

### Frontend

* React
* Vite
* React Router
* Tailwind CSS
* Axios
* Context API

### Backend

* Node.js
* Express
* PostgreSQL
* JWT
* bcryptjs
* cookie-parser

### Testing

* Jest
* Supertest

---

## Estructura del Proyecto

```text
TaskClase/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── database.sql
│   ├── API.md
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── categorias/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── status/
│   │   │   ├── tasks/
│   │   │   └── ui/
│   │   │
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   │
│   └── package.json
│
└── package.json
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd TaskClase
```

### 2. Instalar dependencias

```bash
npm run install-all
```

### 3. Crear la base de datos

```sql
CREATE DATABASE taskflow;
```

### 4. Importar el esquema

```bash
psql -U postgres -d taskflow -f backend/database.sql
```

### 5. Configurar variables de entorno

Backend:

```bash
cp backend/.env.TEMPLATE backend/.env
```

Frontend:

```bash
cp frontend/.env.template frontend/.env
```

Completa los valores correspondientes según tu entorno local.

---

## Ejecución

### Desarrollo

Desde la raíz del proyecto:

```bash
npm run dev
```

Servicios disponibles:

* Frontend: http://localhost:5173
* Backend: http://localhost:4000

---

## Funcionalidades Principales

### Usuarios

* Registro de cuenta.
* Inicio de sesión.
* Gestión de perfil.
* Control de sesiones mediante JWT.

### Tareas

* Crear tareas.
* Editar tareas.
* Eliminar tareas.
* Filtrar por estado.
* Filtrar por prioridad.
* Estadísticas de tareas.

### Categorías

* Crear categorías personalizadas.
* Editar categorías.
* Eliminar categorías.
* Asociación de tareas a categorías.

### Administración

* Gestión de usuarios.
* Consulta de sesiones activas.
* Revocación de sesiones.

---

## API

La documentación completa de la API se encuentra en:

```text
backend/API.md
```