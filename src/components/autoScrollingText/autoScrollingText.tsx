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
    <div className={`overflow-hidden whitespace-nowgrap ${className}`}>
      <p
        className="marquee-inner"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        <span>{text}</span>

        <span className="mx-20  ">{text}</span>
      </p>
    </div>
  );
}
