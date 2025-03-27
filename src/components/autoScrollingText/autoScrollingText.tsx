"use client";

import React from "react";

interface AutoScrollingTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export default function AutoScrollingText({
  text,
  speed = 10,
  className = "",
}: AutoScrollingTextProps) {
  return (
    <div className={`overflow-hidden whitespace-nowgap ${className}`}>
      <div
        className="inline-block animate-marquee"
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        <span className="mx-20">{text}</span>
        <span className="mx-20">{text}</span>
        <span className="mx-20">{text}</span>
        <span className="mx-20">{text}</span>
      </div>
    </div>
  );
}
