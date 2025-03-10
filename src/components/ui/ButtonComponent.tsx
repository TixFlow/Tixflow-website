"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function GradientButton({
  children,
  onClick,
  className,
}: ButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "bg-gradient-to-r from-[#5573F7] to-[#DC30FE] text-white px-4 py-2 rounded-lg",
        "bg-[length:200%] animate-gradient transition-all duration-[2000ms] ease-in-out hover:from-[#DC30FE] hover:to-[#5573F7]",
        className
      )}
    >
      {children}
    </Button>
  );
}
