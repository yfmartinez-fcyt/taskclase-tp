TaskFlow

Aplicación full-stack de gestión de tareas con autenticación JWT, roles de usuario, categorías personalizadas y una interfaz React con estética ciberpunk. Proyecto educativo pensado para demostrar la integración entre un frontend moderno y una API REST con PostgreSQL.


📸 Sugerencia: añade aquí una captura de pantalla o un GIF del proyecto en acción. Ejemplo:
![Demo TaskFlow](docs/demo.gif)



Stack tecnológico

CapaTecnologíasFrontendReact 19, Vite 8, React Router 7, Tailwind CSS 4, Axios, Lucide ReactBackendNode.js, Express 5, PostgreSQL (pg), JWT, bcryptjs, cookie-parserHerramientasESLint, Jest, Supertest, Concurrently

Arquitectura

TaskClase/
├── backend/          # API REST (puerto 4000)
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── config/
├── frontend/         # SPA React (puerto 5173)
│   └── src/
│       ├── api/          # Cliente Axios e interceptores
│       ├── components/   # UI modular (tasks, categorias, auth, layout...)
│       ├── context/      # AuthContext, ThemeContext
│       ├── hooks/        # useTasks, useCategorias
│       ├── pages/        # Vistas principales
│       └── services/     # Capa de acceso a la API
└── package.json      # Scripts para levantar ambos servicios

El frontend consume la API a través de servicios (taskService, categoriaService) y hooks personalizados que centralizan el estado. El backend expone endpoints REST protegidos con middleware de autenticación y autorización por roles.

Requisitos previos


Node.js (v18 o superior recomendado)
PostgreSQL en ejecución
npm (incluido con Node.js)


Instalación

1. Clonar e instalar dependencias

bashgit clone <url-del-repositorio>
cd TaskClase
npm run install-all

Este comando instala las dependencias de la raíz, el backend y el frontend.

2. Configurar la base de datos

Crea la base de datos en PostgreSQL:

sqlCREATE DATABASE taskflow;

Ejecuta el esquema principal en pgAdmin (Query Tool sobre la base taskflow) o con psql:

bashpsql -U postgres -d taskflow -f backend/database.sql


Si ya tenías una base de datos antigua (sin categorías o sin columna role), ejecuta además backend/database.migration.sql.



3. Variables de entorno

Backend — copia la plantilla y completa los valores:

bashcp backend/.env.template backend/.env

VariableDescripciónPORTPuerto del servidor (default: 4000)HOSTInterfaz de escucha (default: 0.0.0.0)DB_*Credenciales de PostgreSQLJWT_ACCESS_SECRETClave secreta del access tokenJWT_REFRESH_SECRETClave secreta del refresh tokenFRONTEND_URLOrígenes permitidos por CORS (separados por comas)

Genera claves seguras para JWT:

bashnode -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Frontend — copia la plantilla:

bashcp frontend/.env.template frontend/.env

VariableDescripciónVITE_API_URLURL base de la API (ej. http://localhost:4000/api)

Ejecución

Desarrollo (backend + frontend)

Desde la raíz del proyecto:

bashnpm run dev

Esto levanta ambos servicios con concurrently:


Backend: http://localhost:4000
Frontend: http://localhost:5173


Por separado

bash# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

Producción

bash# Backend
cd backend && npm start

# Frontend
cd frontend && npm run build && npm run preview

Rutas del frontend

RutaAccesoDescripción/loginPúblicoInicio de sesión/registerPúblicoRegistro de usuario/AutenticadoDashboard de tareas/categoriasAutenticadoGestión de categorías/profileAutenticadoPerfil del usuario/adminAdminPanel de administración

API REST

URL base: http://localhost:4000/api

Documentación detallada de tareas en backend/API.md.

Endpoints principales

MétodoRutaAuthDescripciónGET/api/healthNoEstado del servidor y conexión a BDPOST/api/auth/registerNoRegistroPOST/api/auth/loginNoLogin (devuelve access token + refresh en cookie)POST/api/auth/refreshCookieRenovar access tokenPOST/api/auth/logoutNoCerrar sesiónGET/api/auth/meSíUsuario autenticadoGET/POST/api/tasksSíListar / crear tareasGET/PUT/DELETE/api/tasks/:idSíObtener / actualizar / eliminar tareaGET/api/tasks/statsSíEstadísticas por estadoGET/POST/api/categoriasSíListar / crear categorías del usuarioGET/PUT/DELETE/api/categorias/:idSíCRUD de categoríaGET/api/usersAdminListar usuariosGET/api/users/:id/sessionsAdminSesiones activas de un usuarioDELETE/api/users/sessions/:sessionIdAdminRevocar sesiónPUT/api/users/:idSíActualizar usuario (propio o cualquiera si es admin)

Filtros de tareas (GET /api/tasks)

Query paramValoresstatuspending, in_progress, completedprioritylow, medium, highcategoria_idID numérico o sin_categoria

Modelo de datos

TablaColumnas principalesRelacionesusersid, name, email, password, avatar, role, created_at—tasksid, title, description, status, priority, due_dateuser_id → users, categoria_id → categoriascategoriasid, nombre, descripcion, coloruser_id → usersrefresh_tokensid, user_id, token, expires_at, created_atuser_id → users

Estados de tarea: pending · in_progress · completed

Prioridades: low · medium · high

Roles: user · admin

Autenticación


El login devuelve un access token (almacenado en sessionStorage) y un refresh token (cookie HTTP-only).
Axios incluye el access token en cada petición mediante un interceptor.
Si el access token expira (401/403), el cliente renueva automáticamente el token con cola de peticiones pendientes.
El backend valida que el sid del JWT exista en refresh_tokens, permitiendo revocar sesiones de forma inmediata.


Scripts disponibles

ComandoUbicaciónDescripciónnpm run devRaízBackend + frontend en paralelonpm run install-allRaízInstala todas las dependenciasnpm run devbackend/Servidor con nodemonnpm startbackend/Servidor en producciónnpm testbackend/Tests con Jestnpm run devfrontend/Servidor de desarrollo Vitenpm run buildfrontend/Build de producciónnpm run lintfrontend/ESLint

Problemas conocidos y limitaciones


El access token se guarda en sessionStorage, por lo que se pierde al cerrar la pestaña (comportamiento esperado en un proyecto educativo, pero no recomendado para producción).
No hay paginación en el listado de tareas; con muchas entradas el rendimiento puede degradarse.
El panel de administración no incluye aún búsqueda o filtrado de usuarios.
Las pruebas automatizadas cubren el backend; el frontend no tiene tests unitarios.


Contribuir

Este es un proyecto educativo, así que las contribuciones son bienvenidas especialmente si ayudan a que otros aprendan.


Haz un fork del repositorio.
Crea una rama descriptiva: git checkout -b mejora/nombre-de-la-mejora.
Haz commit de tus cambios con mensajes claros.
Abre un Pull Request explicando qué cambiaste y por qué.


Algunas ideas de mejoras posibles: paginación de tareas, notificaciones en tiempo real con WebSockets, tests del frontend con Vitest, o exportación de tareas a CSV.

Documentación adicional


backend/API.md — Referencia de endpoints de tareas
backend/README.md — Guía del backend
frontend/README.md — Arquitectura del frontend
frontend/GUIA_AUTENTICACION.md — Flujo de autenticación
frontend/GUIA_ESTUDIANTES.md — Guía para estudiantes
RESUMEN_CAMBIOS.md — Historial de mejoras técnicas


Acceso desde la red local

Para probar desde otro dispositivo en la misma red:


Configura FRONTEND_URL en el backend con la IP local (ej. http://172.26.4.3:5173).
Ajusta VITE_API_URL en el frontend si es necesario (ej. http://172.26.4.3:4000/api).
Vite ya expone el frontend con host: true; el backend escucha en 0.0.0.0 por defecto.


El cliente Axios también puede detectar la IP automáticamente si no se define VITE_API_URL.

Licencia

ISC
