import {motion} from "framer-motion"
export default function Loader() {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#d62828] flex items-center justify-center"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity 
          }}
          className="h-16 w-16 border-4 border-[#fcbf49] border-t-transparent rounded-full"
        />
      </motion.div>
    );
  }