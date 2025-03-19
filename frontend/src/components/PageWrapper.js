import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 10, backgroundColor: "#ecf6f6" },
  animate: { opacity: 1, y: 0, backgroundColor: "#ecf6f6", transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, backgroundColor: "#ecf6f6", transition: { duration: 0.3 } },
};

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
