// utils/adjustColorLightness.js

/**
 * Ajusta la luminosidad de un color hexadecimal.
 * @param {string} hex - El color en formato hexadecimal (ej: "#ff5733").
 * @param {number} amount - El valor de ajuste de luminosidad (puede ser positivo para hacer más claro o negativo para hacerlo más oscuro).
 * @returns {string} - El color ajustado en formato hexadecimal.
 */
export const adjustColorLightness = (hex, amount) => {
  // Asegúrate de que el valor de entrada sea un color válido
  if (!/^#[0-9A-F]{6}$/i.test(hex)) {
    throw new Error('El color debe estar en formato hexadecimal #RRGGBB.');
  }

  // Convierte el color hexadecimal a RGB
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Ajusta la luminosidad del color
  r = Math.min(255, Math.max(0, r + amount));
  g = Math.min(255, Math.max(0, g + amount));
  b = Math.min(255, Math.max(0, b + amount));

  // Convierte los valores RGB ajustados nuevamente a hexadecimal
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};
// utils/animations.js
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120 },
  },
};

// Otras variantes de animación que puedas necesitar
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const slideInVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
};

export const tableAnimations = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

//Course Managament

export const itemVariantsCourse = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120 },
  },
  hover: { scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
};

export const containerVariantsCourse = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

//Courses.jsx

export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.5,
    },
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      duration: 0.3,
    },
  },
};
