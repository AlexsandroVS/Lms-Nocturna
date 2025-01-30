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
          title: 'Fundamentos de energía solar',
          lessons: 6,
          duration: '3h 00m',
          completed: true
        },
        {
          title: 'Sistemas eólicos a pequeña escala',
          lessons: 7,
          duration: '4h 30m',
          completed: false
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
          title: 'Electrónica básica para robótica',
          lessons: 5,
          duration: '2h 45m',
          completed: true
        },
        {
          title: 'Programación de actuadores',
          lessons: 8,
          duration: '5h 15m',
          completed: false
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
          title: 'Lógica de escalera básica',
          lessons: 4,
          duration: '2h 00m',
          completed: false
        },
        {
          title: 'Comunicación industrial MODBUS',
          lessons: 6,
          duration: '3h 30m',
          completed: false
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
          title: 'Análisis de vibraciones',
          lessons: 7,
          duration: '4h 00m',
          completed: true
        },
        {
          title: 'Termografía aplicada',
          lessons: 5,
          duration: '3h 15m',
          completed: true
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