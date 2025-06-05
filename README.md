# Learning Management System (LMS) Industrial

Un sistema moderno para la gestión de cursos técnicos y formación industrial, con enfoque en energías renovables, robótica y automatización.

## Características Principales

✅ Autenticación de usuarios (normales y administradores)
✅ Dashboard interactivo con métricas clave
✅ Catálogo de cursos con diseño dinámico
✅ Sistema de progreso y seguimiento detallado
✅ Gestión modular de contenido
✅ Recursos destacados y descargables
✅ Animaciones fluidas y UI responsiva
✅ Sección de perfil personalizable
✅ Modal interactivo para actividades de módulos
✅ Sistema de logros y reconocimientos
✅ Redirección inteligente entre cursos y módulos
✅ Optimización de re-renderizados para mejor rendimiento
✅ Manejo avanzado de URL con useSearchParams
✅ Sincronización de estado y URL sin re-renderizados innecesarios
✅ Nuevo: Panel de administración con gestión de usuarios y cursos
✅ Nuevo: Renderizado condicional basado en roles (admin/user)
✅ Nuevo: Estadísticas en tiempo real para administradores
✅ Nuevo: Tabla interactiva de usuarios con filtros y acciones
✅ Nuevo: Gestión visual de cursos (publicar/editar/archivar)

## Tecnologías Utilizadas

Frontend:
React
React Router
Tailwind CSS
Framer Motion

Iconos:
Font Awesome

Herramientas:
Vite

## Estructura del Proyecto Actualizada

src/
├── components/
│ ├── courses/
│ │ ├── CourseCard.jsx
│ │ ├── LessonList.jsx
│ ├── dashboard/
│ │ ├── AcademicProgress.jsx
│ │ ├── ContinueCourse.jsx
│ │ ├── CourseProgress.jsx
│ │ ├── CriticalDeadlines.jsx
│ │ ├── FeaturedResource.jsx
│ │ └── RecentAchievements.jsx
│ ├── layout/
│ │ ├── Header.jsx
│ │ ├── Navbar.jsx
│ │ └── Sidebar.jsx
│ ├── module/
│ │ └── ModuleModal.jsx
│ ├── profile/
│ │ ├── AchievementCard.jsx
│ │ ├── CourseProgressCard.jsx
│ │ └── StatCard.jsx
│ └── ui/
│ ├── Loader.jsx
│ └── ProgressBar.jsx
├── assets/
│ ├── fondo-login.jpg
│ ├── avatar.jpg
│ └── logo.png
├── context/
│ └── AuthContext.jsx
├── data/
│ ├── courses.js
│ ├── dashboardData.js
│ └── userData.js
├── pages/
│ ├── CoursePage.jsx
│ ├── Courses.jsx
│ ├── Dashboard.jsx
│ └── ProfilePage.jsx
├── admin/
│ ├── modals/
│ │ ├── Activities/
│ │ │   ├── ActivityDetailsModal.jsx
│ │ │   ├── CreateActivityModal.jsx
│ │ │   ├── DeleteActivityModal.jsx
│ │ │   └── EditActivityModal.jsx
│ │ ├── Files/
│ │ │   └── RatingModal.jsx
│ │ ├── Modules/
│ │ │   ├── EditModuleModal.jsx
│ │ │   ├── DeleteModuleModal.jsx
│ │ │   └──  CreateModuleModal.jsx
│ │ ├── CreateCourseModal.jsx
│ │ ├── CreateUsersModal.jsx
│ │ ├── DeleteCourseModal.jsx
│ │ ├── DeleeteUserModal.jsx
│ │ ├── EditCourseModal.jsx
│ │ └──  EditUsersModal.jsx
│ ├── AProfile/
│ │ ├── AdminProfile.jsx
│ │ ├── AdvancedFilters.jsx
│ │ ├── DashboardSummary.jsx
│ │ ├── MetricsDashboard.jsx
│ │ ├── SearchBar.jsx
│ │ └── UserTable.jsx
│ ├── Acourses/
│ │ ├── AdminCourse.jsx
│ │ ├── CourseManagement.jsx
│ │ ├── CourseProgressChart.jsx
│ │ ├── EnrollmentStats.jsx
│ │ └── LearningAnalytics.jsx
│ ├── AdminDashboard.jsx
│ ├── AdminStats.jsx
│ ├── UserManagementTable.jsx
│ ├── CourseManagement.jsx
│ └── DeleteConfirmationModal.jsx
├── utils/
│ ├── courseUtils.js
│ ├── animationUtils.js
│ └── chartConfig.js
├── App.jsx
├── index.css
├── ProtectedRoute.jsx
└──  main.jsx

Implementación del Admin Dashboard

# Renderizado Condicional

El Dashboard principal verifica el rol del usuario mediante el contexto de autenticación:

const { isAdmin } = useAuth();
return (

  <div className="flex-1 p-8">
    <Header />
    {isAdmin ? <AdminDashboard /> : <UserDashboard />}
  </div>
);

# Componentes del Admin Dashboard

AdminStats: Muestra métricas clave en tiempo real.

UserManagementTable: Tabla interactiva para gestionar usuarios (roles, estado, acciones).

CourseManagement: Panel para publicar, editar y archivar cursos.

# Datos Simulados

## Los datos de usuarios y cursos se simulan en userData.js y courses.js, respectivamente.

# Implementación del Admin Dashboard

# Descripción de AdminCoursesDashboard

El componente AdminCoursesDashboard es el panel principal de administración de cursos en un Learning Management System (LMS). Está diseñado para que los administradores académicos gestionen, monitoreen y analicen todos los aspectos relacionados con los cursos ofrecidos en la plataforma.

# Funcionalidades Clave

# Función | Descripción

Gestión de Cursos | Permite ver, editar y eliminar cursos existentes.
Análisis Visual | Muestra métricas clave mediante gráficos interactivos (progreso, inscripciones).
Acciones Rápidas | Botones para crear nuevos cursos o filtrar contenido.
Monitoreo de Progreso | Gráficos en tiempo real del avance académico de los estudiantes.
Gestión de Usuarios | Vista rápida de inscripciones y participación en cursos.
