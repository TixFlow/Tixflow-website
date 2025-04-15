"use client";
import { useRouter } from "next/navigation";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-red-100 rounded-full mx-auto flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">
            Thanh toán thất bại
          </h2>
          <p className="text-gray-600">
            Rất tiếc, giao dịch của bạn không thành công. Vui lòng thử lại hoặc
            liên hệ với chúng tôi nếu cần hỗ trợ.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Về trang chủ
          </button>

          <button
            onClick={() => router.back()}
            className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
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
                d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
              />
            </svg>
            Thử lại
          </button>

          <button
            onClick={() => router.push("/support")}
            className="w-full bg-gray-100 text-gray-600 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            Liên hệ hỗ trợ
          </button>
        </div>
      </div>
    </div>
  );
}
