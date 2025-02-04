import Avatar from "../assets/avatar.jpg";
import AdminAvatar from "../assets/admin-avatar.jpg";

export const users = [
  {
    id: 1,
    name: "Administrador del Sistema",
    email: "admin@gmail.com",
    password: "heropass",
    avatar: AdminAvatar,
    role: "admin",
    permissions: {
      manageCourses: true,
      manageUsers: true,
      accessReports: true,
      modifyContent: true,
    },
    registrationDate: "2023-01-01",
    lastLogin: "2024-02-15T08:30:00Z",
    isActive: true,
    stats: {
      progress: 100,
      completedCourses: 15,
      learningHours: 120,
      achievements: 10,
    },
    enrolledCourses: [1, 2, 3],
    achievements: [
      {
        id: 1,
        title: "Primer Curso Completado",
        icon: "trophy",
        color: "#FFD700",
        unlockedAt: "2023-03-15",
      },
    ],
  },
  {
    id: 2,
    name: "Darkness Dial",
    email: "alexsandro.valeriano1@gmail.com",
    password: "heropass",
    avatar: Avatar,
    role: "user",
    permissions: {
      manageCourses: false,
      manageUsers: false,
      accessReports: false,
      modifyContent: false,
    },
    stats: {
      progress: 75,
      completedCourses: 12,
      learningHours: 86,
      achievements: 8,
    },
    enrolledCourses: [1, 2, 3, 4],
    achievements: [
      {
        id: 1,
        title: "Primer Curso Completado",
        icon: "trophy",
        color: "#FFD700",
        unlockedAt: "2023-03-15",
      },
    ],
    registrationDate: "2023-02-15",
    lastLogin: "2024-02-15T08:35:00Z",
    isActive: true,
  },
  {
    id: 3,
    name: "Alexsandro VS",
    email: "alexsandro@gmail.com",
    password: "heropass",
    avatar: Avatar,
    role: "user",
    permissions: {
      manageCourses: false,
      manageUsers: false,
      accessReports: false,
      modifyContent: false,
    },
    stats: {
      progress: 60,
      completedCourses: 2,
      learningHours: 50,
      achievements: 3,
    },
    enrolledCourses: [1, 2, 3, 4],
    achievements: [
      {
        id: 1,
        title: "Primer Curso Completado",
        icon: "trophy",
        color: "#FFD700",
        unlockedAt: "2023-03-15",
      },
    ],
    registrationDate: "2023-02-15",
    lastLogin: "2024-02-15T08:35:00Z",
    isActive: true,
  },
  {
    id: 4,
    name: "María García",
    email: "maria@example.com",
    password: "password123",
    avatar: Avatar,
    role: "user",
    permissions: {
      /* ... */
    },
    stats: {
      progress: 45,
      completedCourses: 3,
      learningHours: 30,
      achievements: 2,
    },
    enrolledCourses: [1, 3],
    registrationDate: "2024-01-10",
    isActive: true,
  },
  {
    id: 5,
    name: "Sebastian Vilchez",
    email: "sebas@gmail.com",
    password: "heropass",
    avatar: Avatar,
    role: "user",
    permissions: { manageCourses: true /* ... */ },
    stats: {
      progress: 35,
      completedCourses: 3,
      learningHours: 15,
      achievements: 1,
    },
    enrolledCourses: [1, 2, 3, 4],
    registrationDate: "2023-11-15",
    isActive: true,
  },
  {
    id: 6,
    name: "Abner Gomez",
    email: "gomez@gmail.com",
    password: "heropass",
    avatar: Avatar,
    role: "user",
    permissions: { manageCourses: true /* ... */ },
    stats: {
      progress: 25,
      completedCourses: 4,
      learningHours: 50,
      achievements: 3,
    },
    enrolledCourses: [1, 2, 3, 4],
    registrationDate: "2023-11-15",
    isActive: true,
  },
  {
    id: 7,
    name: "Daniel Neyra",
    email: "carlos@example.com",
    password: "heropass",
    avatar: Avatar,
    role: "user",
    permissions: { manageCourses: true /* ... */ },
    stats: {
      progress: 35,
      completedCourses: 4,
      learningHours: 75,
      achievements: 4,
    },
    enrolledCourses: [1, 2, 3, 4],
    registrationDate: "2023-11-15",
    isActive: true,
  },
  {
    id: 8,
    name: "Jhon Villanueva",
    email: "carlos@example.com",
    password: "heropass",
    avatar: Avatar,
    role: "user",
    permissions: { manageCourses: true /* ... */ },
    stats: {
      progress: 10,
      completedCourses: 8,
      learningHours: 75,
      achievements: 6,
    },
    enrolledCourses: [2, 4],
    registrationDate: "2023-11-15",
    isActive: true,
  },
];
// Función para encontrar usuarios
export const findUserByEmail = (email) => {
  return users.find((user) => user.email === email);
};

export const getUserById = (id) => {
  return users.find((user) => user.id === id);
};
