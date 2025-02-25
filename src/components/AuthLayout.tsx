"use client";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#5573F7] to-[#DC30FE]">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-4xl flex">
        {children}
      </div>
    </div>
  );
}
