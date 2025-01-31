import Avatar from "../assets/avatar.jpg";
import AdminAvatar from "../assets/admin-avatar.jpg";

export const users = [
  {
    id: 1,
    name: "Administrador del Sistema",
    email: "admin@lmsindustrial.com",
    password: "Admin1234!",
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
];
// Función para encontrar usuarios
export const findUserByEmail = (email) => {
  return users.find((user) => user.email === email);
};

export const getUserById = (id) => {
  return users.find((user) => user.id === id);
};
