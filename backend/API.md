# Documentación de la API de TaskFlow

Referencia de todos los endpoints disponibles en la API REST de TaskFlow.

## Información general

| Concepto | Valor |
|----------|-------|
| **URL base** | `http://localhost:4000/api` |
| **Formato** | JSON |
| **Content-Type** | `application/json` |
| **Autenticación** | Bearer token en rutas protegidas |

### Autenticación

Las rutas protegidas requieren el header:

```
Authorization: Bearer <accessToken>
```

El **access token** se obtiene en `POST /api/auth/login` y expira según `JWT_ACCESS_EXPIRES` (por defecto, 5 minutos).

El **refresh token** se envía automáticamente en una cookie HTTP-only (`refreshToken`) y se usa en `POST /api/auth/refresh` para renovar el access token.

El access token incluye un `sid` (session ID) vinculado a la tabla `refresh_tokens`. Si la sesión se revoca, las peticiones autenticadas devuelven `401` aunque el token no haya expirado.

### Respuestas de error comunes

Todas las respuestas de error siguen este formato:

```json
{
  "success": false,
  "message": "Descripción del error"
}
```

| Código | Significado |
|--------|-------------|
| `400` | Datos inválidos o campos obligatorios faltantes |
| `401` | No autenticado, token expirado o sesión revocada |
| `403` | Token inválido o permisos insuficientes |
| `404` | Recurso no encontrado |
| `405` | Método HTTP no permitido |
| `500` | Error interno del servidor |
| `503` | Servicio degradado (ej. base de datos desconectada) |

---

## Health Check

### `GET /api/health`

Verifica el estado del servidor y la conexión a PostgreSQL. **No requiere autenticación.**

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "status": "online",
  "message": "Sistema TaskFlow operativo",
  "environment": "development",
  "database": "connected",
  "timestamp": "2026-06-23T12:00:00.000Z"
}
```

**Respuesta degradada (503 Service Unavailable):**

```json
{
  "success": false,
  "status": "degraded",
  "message": "Error de conexión con la base de datos",
  "error": "mensaje de error",
  "timestamp": "2026-06-23T12:00:00.000Z"
}
```

---

## Autenticación (`/api/auth`)

### `POST /api/auth/register`

Registra un nuevo usuario. **No requiere autenticación.**

**Body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | string | Sí | Nombre del usuario |
| `email` | string | Sí | Correo electrónico único |
| `password` | string | Sí | Contraseña en texto plano (se hashea en el servidor) |
| `avatar` | string | No | URL del avatar |

**Ejemplo:**

```json
{
  "name": "Ana García",
  "email": "ana@taskflow.com",
  "password": "miPassword123"
}
```

**Respuesta exitosa (201 Created):**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "name": "Ana García",
    "email": "ana@taskflow.com",
    "avatar": null,
    "role": "user",
    "created_at": "2026-06-23T12:00:00.000Z"
  }
}
```

**Errores:** `400` si faltan campos o el email ya existe.

---

### `POST /api/auth/login`

Inicia sesión y devuelve un access token. Establece la cookie `refreshToken`. **No requiere autenticación.**

**Body:**

| Campo | Tipo | Requerido |
|-------|------|-----------|
| `email` | string | Sí |
| `password` | string | Sí |

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Ana García",
    "email": "ana@taskflow.com",
    "avatar": null,
    "role": "user"
  }
}
```

**Errores:** `401` si las credenciales son inválidas.

---

### `POST /api/auth/refresh`

Renueva el access token usando la cookie `refreshToken`. Rota el refresh token en cada uso. **No requiere Bearer token.**

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errores:** `401` si no hay cookie, `403` si el token es inválido o ya fue utilizado.

---

### `POST /api/auth/logout`

Cierra la sesión eliminando el refresh token de la base de datos y limpiando la cookie. **No requiere Bearer token.**

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Sesión cerrada correctamente"
}
```

---

### `GET /api/auth/me`

Devuelve los datos del usuario autenticado. **Requiere autenticación.**

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ana García",
    "email": "ana@taskflow.com",
    "avatar": null,
    "role": "user",
    "created_at": "2026-06-23T12:00:00.000Z"
  }
}
```

---

## Tareas (`/api/tasks`)

> Todas las rutas de tareas requieren autenticación. Cada usuario solo accede a sus propias tareas.

### `GET /api/tasks`

Obtiene las tareas del usuario autenticado con filtros opcionales.

**Query params:**

| Param | Valores | Descripción |
|-------|---------|-------------|
| `status` | `pending`, `in_progress`, `completed` | Filtra por estado |
| `priority` | `low`, `medium`, `high` | Filtra por prioridad |
| `categoria_id` | ID numérico o `sin_categoria` | Filtra por categoría |

**Ejemplo:** `GET /api/tasks?status=pending&priority=high&categoria_id=2`

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "title": "Configurar servidor",
      "description": "Configurar el entorno de producción",
      "status": "pending",
      "priority": "high",
      "due_date": "2026-06-01",
      "user_id": 1,
      "created_at": "2026-05-19T10:00:00.000Z",
      "updated_at": "2026-05-19T10:00:00.000Z",
      "categoria_id": 2,
      "categoria": "Trabajo",
      "categoria_color": "#FF5733"
    }
  ]
}
```

---

### `GET /api/tasks/stats`

Obtiene estadísticas de tareas del usuario autenticado.

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "data": {
    "total": 17,
    "by_status": {
      "pending": 5,
      "in_progress": 2,
      "completed": 10
    }
  }
}
```

---

### `GET /api/tasks/:id`

Obtiene una tarea por su ID. Solo si pertenece al usuario autenticado.

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Configurar servidor",
    "description": "...",
    "status": "pending",
    "priority": "high",
    "due_date": "2026-06-01",
    "user_id": 1,
    "categoria_id": 2,
    "categoria": "Trabajo",
    "categoria_color": "#FF5733",
    "created_at": "2026-05-19T10:00:00.000Z",
    "updated_at": "2026-05-19T10:00:00.000Z"
  }
}
```

**Errores:** `404` si la tarea no existe o no pertenece al usuario.

---

### `POST /api/tasks`

Crea una nueva tarea para el usuario autenticado.

**Body:**

| Campo | Tipo | Requerido | Default |
|-------|------|-----------|---------|
| `title` | string | Sí | — |
| `description` | string | No | `null` |
| `status` | string | No | `pending` |
| `priority` | string | No | `medium` |
| `due_date` | string (fecha) | No | `null` |
| `categoria_id` | number | No | `null` |

> El `user_id` se asigna automáticamente desde el token; no es necesario enviarlo.

**Ejemplo:**

```json
{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "priority": "high",
  "categoria_id": 2
}
```

**Respuesta exitosa (201 Created):**

```json
{
  "success": true,
  "message": "Tarea creada exitosamente",
  "data": {
    "id": 18,
    "title": "Nueva tarea",
    "description": "Descripción de la tarea",
    "status": "pending",
    "priority": "high",
    "due_date": null,
    "user_id": 1,
    "categoria_id": 2,
    "created_at": "2026-06-23T12:00:00.000Z",
    "updated_at": "2026-06-23T12:00:00.000Z"
  }
}
```

**Errores:** `400` si falta o está vacío el `title`.

---

### `PUT /api/tasks/:id`

Actualiza una tarea existente. Todos los campos del body son opcionales.

**Body:** `title`, `description`, `status`, `priority`, `due_date`, `categoria_id`

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Tarea actualizada exitosamente",
  "data": { "...": "tarea actualizada" }
}
```

**Errores:** `400` si `title` está vacío, `404` si la tarea no existe.

---

### `DELETE /api/tasks/:id`

Elimina una tarea del usuario autenticado.

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Tarea \"Configurar servidor\" eliminada exitosamente"
}
```

**Errores:** `404` si la tarea no existe o no pertenece al usuario.

---

## Categorías (`/api/categorias`)

> Todas las rutas requieren autenticación. Cada usuario gestiona únicamente sus propias categorías.

### `GET /api/categorias`

Lista todas las categorías del usuario autenticado, ordenadas por nombre.

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Trabajo",
      "descripcion": "Tareas laborales",
      "color": "#FF5733",
      "user_id": 1,
      "created_at": "2026-06-23T12:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/categorias`

Crea una nueva categoría.

**Body:**

| Campo | Tipo | Requerido | Default |
|-------|------|-----------|---------|
| `nombre` | string | Sí | — |
| `descripcion` | string | No | `null` |
| `color` | string (hex) | No | `#CCCCCC` |

**Ejemplo:**

```json
{
  "nombre": "Personal",
  "descripcion": "Tareas del día a día",
  "color": "#3498DB"
}
```

**Respuesta exitosa (201 Created):**

```json
{
  "success": true,
  "message": "Categoría creada exitosamente",
  "data": {
    "id": 2,
    "nombre": "Personal",
    "descripcion": "Tareas del día a día",
    "color": "#3498DB",
    "user_id": 1,
    "created_at": "2026-06-23T12:00:00.000Z"
  }
}
```

**Errores:** `400` si falta el `nombre`.

---

### `GET /api/categorias/:id`

Obtiene una categoría por ID.

**Errores:** `404` si no existe o no pertenece al usuario.

---

### `PUT /api/categorias/:id`

Actualiza una categoría. Todos los campos del body son opcionales: `nombre`, `descripcion`, `color`.

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Categoría actualizada",
  "data": { "...": "categoría actualizada" }
}
```

**Errores:** `404` si no existe o no pertenece al usuario.

---

### `DELETE /api/categorias/:id`

Elimina una categoría. Las tareas asociadas quedan con `categoria_id = null` (ON DELETE SET NULL).

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Categoría eliminada correctamente"
}
```

**Errores:** `404` si no existe o no pertenece al usuario.

---

## Usuarios (`/api/users`)

> Todas las rutas requieren autenticación.

### `GET /api/users`

Lista todos los usuarios. **Solo administradores.**

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ana García",
      "email": "ana@taskflow.com",
      "avatar": null,
      "role": "user",
      "created_at": "2026-06-23T12:00:00.000Z"
    }
  ]
}
```

**Errores:** `403` si el usuario no es admin.

---

### `PUT /api/users/:id`

Actualiza un usuario.

- Un **usuario normal** solo puede editar su propio perfil (`name`, `email`, `avatar`). No puede cambiar su rol.
- Un **administrador** puede editar cualquier usuario, incluido su rol.

**Body:** `name`, `email`, `role`, `avatar` (todos opcionales)

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Usuario actualizado correctamente",
  "data": {
    "id": 2,
    "name": "Carlos López",
    "email": "carlos@taskflow.com",
    "role": "admin",
    "avatar": null
  }
}
```

**Errores:** `403` sin permisos, `404` si el usuario no existe.

---

### `GET /api/users/:id/sessions`

Lista las sesiones activas (refresh tokens) de un usuario. **Solo administradores.**

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "created_at": "2026-06-23T10:00:00.000Z",
      "expires_at": "2026-06-23T11:00:00.000Z"
    }
  ]
}
```

---

### `DELETE /api/users/sessions/:sessionId`

Revoca una sesión específica eliminando su refresh token. **Solo administradores.**

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Sesión cerrada correctamente"
}
```

---

## Resumen de endpoints

| Método | Ruta | Auth | Rol |
|--------|------|------|-----|
| `GET` | `/api/health` | No | — |
| `POST` | `/api/auth/register` | No | — |
| `POST` | `/api/auth/login` | No | — |
| `POST` | `/api/auth/refresh` | Cookie | — |
| `POST` | `/api/auth/logout` | No | — |
| `GET` | `/api/auth/me` | Sí | user/admin |
| `GET` | `/api/tasks` | Sí | user/admin |
| `GET` | `/api/tasks/stats` | Sí | user/admin |
| `GET` | `/api/tasks/:id` | Sí | user/admin |
| `POST` | `/api/tasks` | Sí | user/admin |
| `PUT` | `/api/tasks/:id` | Sí | user/admin |
| `DELETE` | `/api/tasks/:id` | Sí | user/admin |
| `GET` | `/api/categorias` | Sí | user/admin |
| `POST` | `/api/categorias` | Sí | user/admin |
| `GET` | `/api/categorias/:id` | Sí | user/admin |
| `PUT` | `/api/categorias/:id` | Sí | user/admin |
| `DELETE` | `/api/categorias/:id` | Sí | user/admin |
| `GET` | `/api/users` | Sí | admin |
| `PUT` | `/api/users/:id` | Sí | user/admin |
| `GET` | `/api/users/:id/sessions` | Sí | admin |
| `DELETE` | `/api/users/sessions/:sessionId` | Sí | admin |
