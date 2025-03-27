"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import images from "./dataSlide";
import Image from "next/image";

export default function SlideIndex({ interval = 3000 }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return (
    <div className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-lg mt-2">
      <div className="relative w-full h-150 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="absolute w-full h-full"
          >
            <Image
              src={images[activeStep].src}
              alt={`Slide ${activeStep + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
          <h3 className="text-xl font-semibold mb-1">
            {images[activeStep].title}
          </h3>
          <p className="text-sm">{images[activeStep].description}</p>
        </div>
      </div>

      <div className="absolute inset-0 flex justify-between items-center px-4">
        <button
          onClick={() =>
            setActiveStep((prev) => (prev - 1 + images.length) % images.length)
          }
          className="bg-black/50 text-white p-2 rounded-full"
        >
          &#10094;
        </button>
        <button
          onClick={() => setActiveStep((prev) => (prev + 1) % images.length)}
          className="bg-black/50 text-white p-2 rounded-full"
        >
          &#10095;
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              index === activeStep ? "bg-white scale-125" : "bg-gray-400"
            }`}
            onClick={() => setActiveStep(index)}
          />
        ))}
      </div>
    </div>
  );
}
