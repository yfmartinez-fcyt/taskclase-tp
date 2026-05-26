# Guía Completa de Autenticación: TaskFlow API

Esta guía explica el sistema de autenticación robusto implementado en TaskFlow, diseñado para ofrecer una experiencia de desarrollo profesional y segura.

## 1. Estructura del Sistema

### Backend (Node.js + Express + PostgreSQL)
- **`src/controllers/authController.js`**: Centraliza la lógica de registro, inicio de sesión, cierre de sesión y la **rotación automática de tokens**.
- **`src/middleware/authMiddleware.js`**: Protege las rutas verificando el Access Token en cada solicitud.
- **`src/routes/authRoutes.js`**: Define los puntos de entrada de la API para autenticación.
- **`src/app.js`**: Configura CORS y el manejo de cookies para una comunicación segura con el frontend.

### Frontend (React + Vite)
- **`src/context/AuthContext.jsx`**: Gestiona el estado global del usuario y la persistencia de la sesión en el navegador.
- **`src/api/axiosClient.js`**: Cliente HTTP inteligente que adjunta tokens y gestiona la renovación transparente ante errores 401.
- **`src/components/auth/`**: Controla el acceso a rutas públicas y privadas.

---

## 2. Estrategia de Seguridad: Doble Token y Almacenamiento

Hemos implementado un flujo de **Tokens de Doble Factor** (Access + Refresh) con almacenamiento diferenciado para mitigar ataques XSS y CSRF:

1.  **Access Token (Vida corta, configurable)**:
    - **Uso**: Se envía en el encabezado `Authorization: Bearer <token>`.
    - **Almacenamiento**: Se guarda en `sessionStorage`. Esto es más seguro que `localStorage` ya que los datos se eliminan automáticamente al cerrar la pestaña o el navegador.
    - **Configuración**: El tiempo de vida es ajustable desde el archivo `.env` del backend.

2.  **Refresh Token (Vida larga, rotativo)**:
    - **Uso**: Se utiliza exclusivamente para obtener un nuevo Access Token cuando el anterior expira.
    - **Almacenamiento**: Se envía mediante una **Cookie HttpOnly**. JavaScript no puede acceder a ella, protegiéndola de ataques maliciosos.
    - **Rotación**: Cada vez que se usa para renovar la sesión, el servidor invalida el antiguo y emite uno nuevo, aumentando la seguridad.

### Rotación Automática y Transparente
Gracias a los interceptores de Axios en el frontend, si un Access Token expira (por ejemplo, después de 1 minuto):
1. El interceptor captura el error **401**.
2. Realiza una petición silenciosa a `/api/auth/refresh`.
3. Si el Refresh Token es válido, recibe un nuevo Access Token y lo guarda en `sessionStorage`.
4. **Reintenta automáticamente** la petición original que falló, sin que el usuario note ninguna interrupción.

---

## 3. Configuración y Pruebas

### Variables de Entorno (.env) - Backend
Puedes configurar la seguridad de tu servidor mediante estas variables:
- `JWT_ACCESS_SECRET`: Clave secreta para firmar tokens de acceso.
- `JWT_ACCESS_EXPIRES`: Tiempo de vida del Access Token (ej: `5m` para producción).
- `JWT_REFRESH_SECRET`: Clave secreta para tokens de renovación.
- `JWT_REFRESH_EXPIRES`: Tiempo de vida del Refresh Token (ej: `1h`).

### Pruebas de Rotación
Para verificar que los tokens rotan automáticamente:
1. Configura `JWT_ACCESS_EXPIRES=1m` en el `.env` del backend (para no esperar 5 minutos).
2. Inicia sesión en la aplicación.
3. Espera un minuto.
4. Realiza cualquier acción (crear tarea, actualizar lista).
5. Observa en la pestaña **Network** del navegador cómo se realiza una llamada a `/refresh` justo antes de reintentar tu acción original.

---

## 4. Endpoints Principales

- **POST** `/api/auth/register`: Registro de nuevos usuarios.
- **POST** `/api/auth/login`: Inicia sesión y establece la cookie de Refresh.
- **POST** `/api/auth/refresh`: Intercambia la cookie por un nuevo Access Token.
- **POST** `/api/auth/logout`: Invalida los tokens y limpia la sesión.
- **GET** `/api/auth/me`: Obtiene el perfil del usuario autenticado.

---

## 5. Integración con el Sistema de Temas y UI

El sistema de autenticación ahora está integrado con el nuevo motor de temas dinámicos. Las páginas de Login y Registro utilizan componentes reutilizables que garantizan la consistencia visual y la adaptabilidad al modo oscuro/claro.

Para más información sobre cómo trabajar con la interfaz y los estilos, consulta la [Guía de Desarrollo para el Alumnado](./GUIA_ESTUDIANTES.md).
