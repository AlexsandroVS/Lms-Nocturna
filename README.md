# Learning Management System (LMS) Industrial

![Demo](https://via.placeholder.com/800x400.png?text=LMS+Industrial+Demo) <!-- Agrega capturas reales aquí -->

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

## Tecnologías Utilizadas

- **Frontend**:  
  ![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
  ![React Router](https://img.shields.io/badge/React_Router-6.14.2-CA4245?logo=react-router)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-06B6D4?logo=tailwind-css)
  ![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.12.16-0055FF?logo=framer)

- **Iconos**:  
  ![Font Awesome](https://img.shields.io/badge/Font_Awesome-6.4.0-528DD7?logo=font-awesome)

- **Herramientas**:  
  ![Vite](https://img.shields.io/badge/Vite-4.3.9-646CFF?logo=vite)

## Estructura del Proyecto Actualizada

```plaintext
src/
├── components/
│   ├── courses/
│   │   ├── CourseCard.jsx
│   │   ├── LessonList.jsx
│   ├── dashboard/
│   │   ├── AcademicProgress.jsx
│   │   ├── ContinueCourse.jsx
│   │   ├── CourseProgress.jsx
│   │   ├── CriticalDeadlines.jsx
│   │   ├── FeaturedResource.jsx
│   │   └── RecentAchievements.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── module/
│   │   └── ModuleModal.jsx
│   ├── profile/
│   │   ├── AchievementCard.jsx
│   │   ├── CourseProgressCard.jsx
│   │   └── StatCard.jsx
│   └── ui/
│       ├── Loader.jsx
│       └── ProgressBar.jsx
├── data/
│   ├── courses.js
│   ├── dashboardData.js
│   └── userData.js
├── pages/
│   ├── CoursePage.jsx
│   ├── Courses.jsx
│   ├── Dashboard.jsx
│   └── ProfilePage.jsx
├── utils/
│   └── courseUtils.js
└── App.jsx
```
