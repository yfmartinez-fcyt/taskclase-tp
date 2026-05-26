# Guía de Desarrollo para el Alumnado: TaskFlow Fullstack

Esta guía detalla la arquitectura integral del sistema TaskFlow, cubriendo tanto el **Frontend** (React) como el **Backend** (Node.js/Express). Se enfoca en las mejoras estructurales, estéticas y de seguridad implementadas para crear una aplicación profesional y mantenible.

---

## 1. Frontend: Arquitectura y Sistema de Temas

Se ha implementado una interfaz moderna con estética "Cyberpunk", utilizando un sistema de temas dinámico y componentes altamente reutilizables.

### A. Sistema de Temas (Dark/Light)
- **Tecnología**: React Context API + CSS Variables.
- **Implementación**: El `ThemeProvider` gestiona el estado global. Inyecta clases (`.light`/`.dark`) en el `<html>`, lo que cambia instantáneamente el valor de las variables CSS definidas en `index.css`.
- **Persistencia**: El tema elegido se guarda en `localStorage` para que la preferencia del usuario se mantenga al recargar.

### B. Componentes UI Reutilizables (`src/components/ui/`)
Para evitar la duplicación de código y garantizar consistencia:
- **`Button`**: Soporta múltiples variantes estéticas y estados de carga.
- **`Input` y `Select`**: Campos estandarizados con etiquetas flotantes y validaciones visuales.
- **`Badge`**: Etiquetas dinámicas que cambian de color según el estado (Pendiente, Completada) o prioridad.

### C. Organización por "Secciones" (`SectionCard`)
La UI se divide en tarjetas modulares (`SectionCard.jsx`). Esto permite:
- Agrupar lógica relacionada (ej: "Nuevo Registro" vs "Panel de Control").
- Mantener un diseño limpio y adaptable (Responsive) usando Grid de Tailwind.

---

## 2. Backend: Arquitectura Robusta y API

El servidor se ha estructurado siguiendo el patrón de **Controladores y Rutas** para facilitar la escalabilidad.

### A. Estructura de Capas
- **`routes/`**: Define los puntos de entrada (endpoints) y aplica middlewares de seguridad.
- **`controllers/`**: Contiene la "lógica de negocio", procesando las peticiones y comunicándose con la base de datos PostgreSQL.
- **`middleware/`**: Capas intermedias para tareas repetitivas (Autenticación, Manejo de Errores).

### B. Mejoras Implementadas en esta Versión:
1. **Controlador de Tareas**:
   - Se optimizó la consulta de estadísticas (`getStats`) usando filtros SQL nativos, reduciendo la carga de procesamiento en el servidor.
   - Búsqueda avanzada por ID y filtrado dinámico por estado/prioridad.
2. **Sistema de Diagnóstico (Health Check)**:
   - Nuevo endpoint `/api/health` que verifica no solo el servidor, sino también la conectividad activa con la base de datos.
3. **Manejo de Errores Centralizado**:
   - El `errorHandler.js` ahora captura errores no manejados y devuelve respuestas JSON consistentes con códigos de estado HTTP correctos.

---

## 3. Seguridad y Autenticación

Basado en una estrategia de **Doble Token** para máxima protección:
- **Access Token**: JWT de vida corta guardado en memoria/sessionStorage.
- **Refresh Token**: JWT de vida larga guardado en **Cookie HttpOnly**, invisible para JavaScript malicioso.
- **Rotación**: Los tokens se renuevan automáticamente de forma transparente para el usuario gracias a los interceptores de Axios en el frontend.

---

## 4. Detalle de Secciones de la Interfaz

Para que el alumnado comprenda la navegación y el flujo de datos:

### A. Terminal de Estado (Dashboard Lateral)
- **`ApiStatus.jsx`**: Monitorea en tiempo real la salud de la API. Si el backend cae, el indicador cambia a rojo.
- **`TaskStats.jsx`**: Muestra contadores dinámicos. Los datos se obtienen del endpoint `/api/tasks/stats` y se actualizan tras cada operación CRUD.

### B. Panel de Control (Gestión de Tareas)
- **`TaskSearchById.jsx`**: Permite recuperar una tarea específica. Implementa una lógica de "refresco inteligente" para actualizar la vista si la tarea buscada es editada.
- **`TaskFilters.jsx`**: Filtra la lista principal sin recargar la página, utilizando el estado local de React para enviar queries a la API.

### C. Modales de Acción
- **`ConfirmModal.jsx`**: Un componente genérico para advertencias críticas (como borrar registros), diseñado para prevenir errores accidentales del usuario.

---

## 5. Resumen de Cambios por Sección

| Sección | Cambios Realizados |
| :--- | :--- |
| **Auth** | Implementación de Registro/Login con validación de credenciales y encriptación bcrypt. |
| **Tareas** | Operaciones CRUD completas (Crear, Leer, Actualizar, Borrar) protegidas por usuario. |
| **Dashboard** | Sistema de estadísticas en tiempo real y filtros dinámicos de búsqueda. |
| **Estilos** | Migración completa a paleta "Cyber" dinámica con soporte nativo para Modo Claro. |
| **Infra** | Configuración de CORS seguro y manejo centralizado de errores. |

---

## 5. Mejores Prácticas Sugeridas

1. **Backend**: Siempre usa `try/catch` en tus controladores y delega errores pesados al `next(error)` para que el middleware global los maneje.
2. **Frontend**: No definas colores hexadecimales directamente en los archivos `.jsx`. Usa siempre las variables del tema (`var(--accent-primary)`) o las clases de Tailwind extendidas (`text-cyber-cyan`).
3. **Base de Datos**: Usa siempre parámetros en tus consultas SQL (`$1, $2`) para prevenir ataques de Inyección SQL.
