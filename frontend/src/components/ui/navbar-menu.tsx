import React from "react";
import { motion } from "framer-motion";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({ item, children } : { item : String , children : React.ReactNode }) => {
  return (
    <div className="relative group">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
      >
        {item}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={transition}
        className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4 hidden group-hover:block"
      >
        <motion.div
          transition={transition}
          className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
        >
          <motion.div
            layout
            className="w-max h-full p-4"
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Menu = ( children  : React.ReactNode ) => {
  return (
    <nav className="relative rounded-full border border-transparent dark:bg-black dark:border-white/[0.2] bg-white shadow-input flex justify-center space-x-4 px-8 py-6">
      {children}
    </nav>
  );
};