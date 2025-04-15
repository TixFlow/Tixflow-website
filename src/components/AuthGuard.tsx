"use client";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectAuth } from "@/redux/authSlice";
import { useEffect } from "react";

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const { user, isAuthReady } = useAppSelector(selectAuth);

  useEffect(() => {
    if (isAuthReady && !user) {
      router.push("/auth/login");
    }
  }, [isAuthReady, user, router]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full space-y-6 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto flex items-center justify-center">
            <svg
              className="w-10 h-10 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m0 0v2m0-2h2m-2 0H8m4-6V4"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Yêu cầu đăng nhập
          </h2>
          <p className="text-gray-600">
            Vui lòng đăng nhập để truy cập tính năng này
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
