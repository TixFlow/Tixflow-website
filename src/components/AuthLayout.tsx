"use client";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#FDB777] to-[#FF6200]">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-4xl flex">
        {children}
      </div>
    </div>
  );
}
