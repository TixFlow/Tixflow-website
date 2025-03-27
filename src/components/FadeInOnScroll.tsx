"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import React from "react";

interface FadeInOutOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function FadeInOutOnScroll({
  children,
  className = "",
  delay = 0,
}: FadeInOutOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visibleRatio, setVisibleRatio] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisibleRatio(entry.intersectionRatio);
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      }
    );

    const element = ref.current;
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: visibleRatio, y: 30 - visibleRatio * 30 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}
