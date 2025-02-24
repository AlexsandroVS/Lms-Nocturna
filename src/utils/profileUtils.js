export const profileVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const colorPalette = {
    primary: "#d62828",
    secondary: "#f77f00",
    accent: "#fcbf49",
    neutral: "#003049",
    light: "#eae2b7",
  };