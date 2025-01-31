const courses = [
  {
    id: 1,
    icon: 'bolt',
    color: '#48CAE4',
    title: 'Energías Renovables',
    description: 'Diseño e implementación de sistemas de energía solar y eólica para aplicaciones industriales.',
    duration: '18 horas',
    progress: 65,
    modules: [
      {
        id: 1,
        title: 'Fundamentos de energía solar',
        activities: [
          {
            type: 'video',
            title: 'Introducción a la energía fotovoltaica',
            duration: '15:30 min',
            url: '#',
            completed: true
          },
          {
            type: 'pdf',
            title: 'Manual de conceptos básicos',
            pages: 18,
            downloadUrl: '#',
            completed: true
          },
          {
            type: 'quiz',
            title: 'Evaluación de conceptos básicos',
            questions: 10,
            passingScore: 80,
            completed: false
          },
          {
            type: 'practice',
            title: 'Cálculo de instalación básica',
            duration: '30 min',
            completed: false
          }
        ]
      },
      {
        id: 2,
        title: 'Sistemas eólicos a pequeña escala',
        activities: [
          {
            type: 'video',
            title: 'Componentes de un aerogenerador',
            duration: '12:45 min',
            url: '#',
            completed: false
          },
          {
            type: 'pdf',
            title: 'Guía de dimensionamiento',
            pages: 22,
            downloadUrl: '#',
            completed: false
          }
        ]
      }
    ],
    resources: [
      {
        title: 'Guía de instalación fotovoltaica',
        icon: 'file-pdf',
        link: '#'
      },
      {
        title: 'Casos de éxito internacionales',
        icon: 'globe',
        link: '#'
      }
    ]
  },
  {
    id: 2,
    icon: 'robot',
    color: '#8AC926',
    title: 'Robótica Básica',
    description: 'Introducción a la construcción y programación de robots industriales colaborativos.',
    duration: '22 horas',
    progress: 45,
    modules: [
      {
        id: 1,
        title: 'Electrónica básica para robótica',
        activities: [
          {
            type: 'video',
            title: 'Componentes electrónicos esenciales',
            duration: '18:20 min',
            url: '#',
            completed: true
          },
          {
            type: 'practice',
            title: 'Montaje de circuito básico',
            duration: '45 min',
            completed: true
          }
        ]
      },
      {
        id: 2,
        title: 'Programación de actuadores',
        activities: [
          {
            type: 'video',
            title: 'Control de motores paso a paso',
            duration: '22:10 min',
            url: '#',
            completed: false
          },
          {
            type: 'quiz',
            title: 'Evaluación de conceptos de control',
            questions: 8,
            passingScore: 75,
            completed: false
          }
        ]
      }
    ],
    resources: [
      {
        title: 'Manual de Arduino Industrial',
        icon: 'microchip',
        link: '#'
      },
      {
        title: 'Proyectos prácticos',
        icon: 'code',
        link: '#'
      }
    ]
  },
  {
    id: 3,
    icon: 'microchip',
    color: '#FFBA08',
    title: 'Programación en PLC',
    description: 'Automatización industrial mediante controladores lógicos programables.',
    duration: '20 horas',
    progress: 30,
    modules: [
      {
        id: 1,
        title: 'Lógica de escalera básica',
        activities: [
          {
            type: 'video',
            title: 'Introducción a la programación ladder',
            duration: '14:50 min',
            url: '#',
            completed: false
          },
          {
            type: 'practice',
            title: 'Ejercicio de contactos básicos',
            duration: '30 min',
            completed: false
          }
        ]
      },
      {
        id: 2,
        title: 'Comunicación industrial MODBUS',
        activities: [
          {
            type: 'video',
            title: 'Fundamentos del protocolo MODBUS',
            duration: '16:30 min',
            url: '#',
            completed: false
          },
          {
            type: 'pdf',
            title: 'Guía de configuración',
            pages: 15,
            downloadUrl: '#',
            completed: false
          }
        ]
      }
    ],
    resources: [
      {
        title: 'Manual Siemens S7-1200',
        icon: 'file-alt',
        link: '#'
      },
      {
        title: 'Simulador PLC virtual',
        icon: 'laptop-code',
        link: '#'
      }
    ]
  },
  {
    id: 4,
    icon: 'tools',
    color: '#D00000',
    title: 'Mantenimiento Industrial',
    description: 'Estrategias avanzadas de mantenimiento predictivo y preventivo en entornos productivos.',
    duration: '25 horas',
    progress: 80,
    modules: [
      {
        id: 1,
        title: 'Análisis de vibraciones',
        activities: [
          {
            type: 'video',
            title: 'Fundamentos del análisis de vibraciones',
            duration: '20:15 min',
            url: '#',
            completed: true
          },
          {
            type: 'practice',
            title: 'Lectura e interpretación de espectros',
            duration: '45 min',
            completed: true
          }
        ]
      },
      {
        id: 2,
        title: 'Termografía aplicada',
        activities: [
          {
            type: 'video',
            title: 'Introducción a la termografía industrial',
            duration: '18:40 min',
            url: '#',
            completed: true
          },
          {
            type: 'quiz',
            title: 'Evaluación de conceptos térmicos',
            questions: 12,
            passingScore: 85,
            completed: true
          }
        ]
      }
    ],
    resources: [
      {
        title: 'Checklist de mantenimiento',
        icon: 'clipboard-check',
        link: '#'
      },
      {
        title: 'Guía de lubricación',
        icon: 'oil-can',
        link: '#'
      }
    ]
  }
];

export default courses;