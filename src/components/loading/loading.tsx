"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import gifSrc from "../../assets/loading.gif";
interface TicketLoadingProps {
  message?: string;
  height?: string;
  gifSrc?: string;
}

export default function TicketLoading({
  message = "Đang tải vé, vui lòng đợi...",
  height = "h-full",
}: TicketLoadingProps) {
  return (
    <div
      className={`w-full ${height} flex flex-col items-center justify-center py-10 space-y-4`}
    >
      <motion.div
        className="w-20 h-20 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Image
          src={gifSrc}
          alt="Loading..."
          width={80}
          height={80}
          className="object-contain"
          priority
        />
      </motion.div>

      {message && (
        <p className="text-center text-sm text-gray-500 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
