"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const MobileWrapper = ({ children }: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <p className="text-xl font-semibold text-gray-700 mb-4">
            🚧 Ứng dụng chưa hỗ trợ giao diện mobile
          </p>
          <p className="text-gray-500">
            Vui lòng mở trang web này trên máy tính để có trải nghiệm đầy đủ.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MobileWrapper;
