"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function LoadingOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Image src="/loading.gif" alt="Loading..." width={80} height={80} />
    </motion.div>
  );
}
