export const testData = {
  courses: [
    { CourseID: 1, Title: "Matemáticas Avanzadas" },
    { CourseID: 2, Title: "Literatura Contemporánea" },
    { CourseID: 3, Title: "Programación Web" },
    { CourseID: 4, Title: "Historia del Arte" }
  ],

  courseStats: {
    1: {
      moduleAverages: [
        { ModuleID: 101, Modulo: "Álgebra Lineal", PromedioNotas: 14.5, EstudiantesEvaluados: 25 },
        { ModuleID: 102, Modulo: "Cálculo Diferencial", PromedioNotas: 12.8, EstudiantesEvaluados: 23 },
        { ModuleID: 103, Modulo: "Geometría Analítica", PromedioNotas: 15.2, EstudiantesEvaluados: 22 },
        { ModuleID: 104, Modulo: "Probabilidad", PromedioNotas: 13.4, EstudiantesEvaluados: 20 },
        { ModuleID: 105, Modulo: "Estadística", PromedioNotas: 11.9, EstudiantesEvaluados: 18 }
      ],
      lowPerformanceStudents: [
        { UserID: 101, Name: "Juan Pérez", Promedio: 8.5, Entregas: 3 },
        { UserID: 102, Name: "María López", Promedio: 9.2, Entregas: 4 },
        { UserID: 103, Name: "Carlos Ruiz", Promedio: 10.3, Entregas: 5 },
        { UserID: 104, Name: "Pedro Gómez", Promedio: 7.8, Entregas: 2 },
        { UserID: 105, Name: "Laura Silva", Promedio: 9.9, Entregas: 6 }
      ],
      topPerformanceStudents: [
        { UserID: 201, Name: "Ana García", Promedio: 18.7, Entregas: 10 },
        { UserID: 202, Name: "Luis Martínez", Promedio: 17.5, Entregas: 9 },
        { UserID: 203, Name: "Sofía Díaz", Promedio: 16.8, Entregas: 10 },
        { UserID: 204, Name: "Diego Fernández", Promedio: 18.0, Entregas: 8 },
        { UserID: 205, Name: "Valeria Núñez", Promedio: 17.1, Entregas: 7 }
      ],
      lowCompletionActivities: [
        { ActivityID: 1001, Actividad: "Examen Álgebra", Modulo: "Álgebra Lineal", Entregas: 18, TotalEstudiantes: 25, Pendientes: 7 },
        { ActivityID: 1002, Actividad: "Problemas de Cálculo", Modulo: "Cálculo Diferencial", Entregas: 15, TotalEstudiantes: 25, Pendientes: 10 },
        { ActivityID: 1003, Actividad: "Taller de Estadística", Modulo: "Estadística", Entregas: 12, TotalEstudiantes: 25, Pendientes: 13 }
      ]
    },

    2: {
      moduleAverages: [
        { ModuleID: 201, Modulo: "Poesía Moderna", PromedioNotas: 16.2, EstudiantesEvaluados: 20 },
        { ModuleID: 202, Modulo: "Novela Contemporánea", PromedioNotas: 15.7, EstudiantesEvaluados: 18 },
        { ModuleID: 203, Modulo: "Ensayo Literario", PromedioNotas: 13.1, EstudiantesEvaluados: 17 }
      ],
      lowPerformanceStudents: [
        { UserID: 301, Name: "Ernesto Salas", Promedio: 10.5, Entregas: 5 },
        { UserID: 302, Name: "Marta Ríos", Promedio: 9.6, Entregas: 4 },
        { UserID: 303, Name: "Lucía Peña", Promedio: 8.9, Entregas: 3 }
      ],
      topPerformanceStudents: [
        { UserID: 401, Name: "Isabel Herrera", Promedio: 18.1, Entregas: 10 },
        { UserID: 402, Name: "Fernando Rivas", Promedio: 17.3, Entregas: 9 },
        { UserID: 403, Name: "Gabriela Solano", Promedio: 16.5, Entregas: 8 }
      ],
      lowCompletionActivities: [
        { ActivityID: 2001, Actividad: "Ensayo sobre Poesía", Modulo: "Poesía Moderna", Entregas: 13, TotalEstudiantes: 20, Pendientes: 7 },
        { ActivityID: 2002, Actividad: "Análisis de Novela", Modulo: "Novela Contemporánea", Entregas: 11, TotalEstudiantes: 20, Pendientes: 9 }
      ]
    },

    3: {
      moduleAverages: [
        { ModuleID: 301, Modulo: "HTML y CSS", PromedioNotas: 14.0, EstudiantesEvaluados: 26 },
        { ModuleID: 302, Modulo: "JavaScript Básico", PromedioNotas: 13.2, EstudiantesEvaluados: 25 },
        { ModuleID: 303, Modulo: "React JS", PromedioNotas: 12.6, EstudiantesEvaluados: 24 }
      ],
      lowPerformanceStudents: [
        { UserID: 501, Name: "Tomás Ayala", Promedio: 9.7, Entregas: 4 },
        { UserID: 502, Name: "Patricia Vela", Promedio: 10.2, Entregas: 6 }
      ],
      topPerformanceStudents: [
        { UserID: 601, Name: "Daniela Campos", Promedio: 18.0, Entregas: 12 },
        { UserID: 602, Name: "Héctor Navarro", Promedio: 17.8, Entregas: 11 }
      ],
      lowCompletionActivities: [
        { ActivityID: 3001, Actividad: "Maquetación CSS", Modulo: "HTML y CSS", Entregas: 20, TotalEstudiantes: 26, Pendientes: 6 },
        { ActivityID: 3002, Actividad: "Formularios JS", Modulo: "JavaScript Básico", Entregas: 18, TotalEstudiantes: 26, Pendientes: 8 }
      ]
    },

    4: {
      moduleAverages: [
        { ModuleID: 401, Modulo: "Arte Clásico", PromedioNotas: 15.5, EstudiantesEvaluados: 20 },
        { ModuleID: 402, Modulo: "Renacimiento", PromedioNotas: 14.9, EstudiantesEvaluados: 22 },
        { ModuleID: 403, Modulo: "Arte Moderno", PromedioNotas: 13.3, EstudiantesEvaluados: 19 }
      ],
      lowPerformanceStudents: [
        { UserID: 701, Name: "Iván Mendoza", Promedio: 10.1, Entregas: 5 },
        { UserID: 702, Name: "Julia Soto", Promedio: 9.3, Entregas: 4 }
      ],
      topPerformanceStudents: [
        { UserID: 801, Name: "Natalia Varela", Promedio: 18.9, Entregas: 10 },
        { UserID: 802, Name: "Esteban Pardo", Promedio: 17.0, Entregas: 9 }
      ],
      lowCompletionActivities: [
        { ActivityID: 4001, Actividad: "Ensayo Renacimiento", Modulo: "Renacimiento", Entregas: 14, TotalEstudiantes: 20, Pendientes: 6 },
        { ActivityID: 4002, Actividad: "Galería Arte Moderno", Modulo: "Arte Moderno", Entregas: 13, TotalEstudiantes: 20, Pendientes: 7 }
      ]
    }
  }
};
