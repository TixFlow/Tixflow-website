"use client";
import SlideIndex from "@/components/SlideIndex/SlideIndex";
import TicketListByCategory from "./home/TicketListByCategory";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import Logo2 from "@/components/logo/Logo2";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Home() {
  const isMobile = useIsMobile();
  return (
    <div className="bg-gray-100">
      <div className="flex px-10 py-4">
        <div className="w-3/8 bg-white rounded-lg p-4 pt-10 px-10 mx-3 text-sm leading-relaxed">
          <FadeInOnScroll>
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              🎟️ Chào mừng bạn đến với Tixflow!
            </h2>
            <p className="mb-2">
              <strong>Tixflow</strong> là nền tảng tiên phong trong việc{" "}
              <span className="text-blue-500 font-medium">
                mua bán và trao đổi vé sự kiện
              </span>{" "}
              giữa người dùng với nhau một cách an toàn và minh bạch.
            </p>
            <p className="mb-2">
              Bạn đã từng mua vé mà không thể tham gia sự kiện? Hay bỏ lỡ một
              show diễn chỉ vì vé đã &quot;sold out&quot;? Với Tixflow, bạn có
              thể:
            </p>
            <ul className="list-disc pl-5 mb-2">
              <li>Đăng bán vé không dùng đến chỉ trong vài bước</li>
              <li>Mua lại vé từ người dùng khác với giá tốt</li>
              <li>Được đảm bảo về độ tin cậy của vé qua hệ thống xác thực</li>
              <li>Giao dịch tiện lợi, nhanh chóng và bảo mật</li>
            </ul>
            <p className="mb-2">
              Nền tảng còn hỗ trợ{" "}
              <span className="text-green-600 font-medium">
                kiểm tra tình trạng vé
              </span>
              , lịch sử sự kiện và{" "}
              <span className="text-purple-500 font-medium">
                thống kê thị trường vé
              </span>{" "}
              để bạn có quyết định thông minh hơn.
            </p>
            <p className="mb-2">
              Hãy cùng chúng tôi{" "}
              <span className="italic">
                tái sử dụng vé – tiết kiệm chi phí – giảm thiểu lãng phí
              </span>{" "}
              và lan tỏa tinh thần yêu sự kiện!
            </p>
            <p className="font-medium text-gray-600 mt-4">
              ⏳ Mỗi vé đều có giá trị. Đừng để chúng bị lãng phí!
            </p>
            <Logo2 />
          </FadeInOnScroll>
        </div>

        <div className="w-5/8 mx-2">
          <FadeInOnScroll delay={0.3}>
            <SlideIndex />
          </FadeInOnScroll>
        </div>
      </div>

      <TicketListByCategory />
    </div>
  );
}
