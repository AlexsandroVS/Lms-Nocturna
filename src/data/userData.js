import Avatar from "../assets/avatar.jpg"
export const userData = {
    id: 1,
    name: 'Darkness Dial',
    email: 'alexsandro.valeriano1@gmail.com',
    role: 'Desarrollador Web',
    avatar: Avatar,
    registrationDate: 'Miembro desde Enero 2023',
    stats: {
      progress: 75,
      completedCourses: 12,
      learningHours: 86,
      achievements: 8
    },
    enrolledCourses: [1, 3, 4], 
    achievements: [
      { 
        id: 1, 
        title: 'Primer Curso Completado', 
        icon: 'trophy',
        color: '#FFD700',
        unlockedAt: '2023-03-15'
      },
      { 
        id: 2, 
        title: '100 Horas de Aprendizaje', 
        icon: 'clock',
        color: '#48CAE4',
        unlockedAt: '2023-05-01'
      }
    ]
  };