// app/tickets/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Ticket } from "@/models/Ticket";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

const isAuthenticated = false;

export default function TicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3001/tickets/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Không tìm thấy vé");
        }
        return res.json();
      })
      .then((data: Ticket) => {
        setTicket(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-10">Đang tải dữ liệu...</p>;
  if (!ticket) return <p className="p-10">Không tìm thấy vé.</p>;

  const dateObj = new Date(ticket.date);

  const dayOfWeek = format(dateObj, "EEE", { locale: vi });
  const dayOfMonth = format(dateObj, "dd", { locale: vi });

  const handleBuyClick = () => {
    if (ticket.status === "soldout") return;
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    alert("Mua vé thành công!");
  };

  const buttonText =
    ticket.status === "soldout"
      ? "Hết hàng"
      : !isAuthenticated
      ? "Đăng nhập để mua vé"
      : "Mua vé ngay";

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto pt-10 pb-16 px-4 md:px-8">
        <h1 className="text-center text-4xl font-bold mb-12">
          THÔNG TIN VÉ BÁN
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-8 bg-orange-400/20 rounded-3xl p-6 md:p-10">
          <div className="flex flex-col items-center justify-center bg-orange-400 rounded-xl outline outline-1 outline-zinc-900 w-24 h-24">
            <span className="text-lg">{dayOfWeek}</span>
            <span className="text-4xl">{dayOfMonth}</span>
          </div>

          <div className="flex flex-col md:flex-row flex-1 gap-8">
            <div className="md:w-1/3 flex-shrink-0">
              <Image
                src={ticket.image}
                alt={ticket.event}
                width={398}
                height={421}
                className="rounded-2xl"
              />
            </div>

            <div className="flex-1 space-y-4 md:pl-10">
              <h2 className="text-3xl font-bold">{ticket.event}</h2>
              <div className="flex flex-col gap-2 text-gray-800">
                <p className="flex items-center gap-2">
                  <CalendarIcon className="text-orange-400" size={18} />
                  <span className="text-gray-600">
                    {format(dateObj, "dd/MM/yyyy", { locale: vi })}
                  </span>
                </p>
                <p>Địa điểm: {ticket.location}</p>
                <p>
                  Giá:{" "}
                  <span className="text-red-600 font-semibold">
                    {ticket.price.toLocaleString()}đ
                  </span>
                </p>
                <p>
                  Còn vé:{" "}
                  <span className="font-semibold">{ticket.available}</span>
                </p>
              </div>

              <button
                onClick={handleBuyClick}
                disabled={ticket.status === "soldout"}
                className={`mt-4 font-medium rounded-3xl px-6 py-2 transition duration-300 ${
                  ticket.status === "soldout"
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-orange-400 text-black hover:brightness-95"
                }`}
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-orange-400 mt-16 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-center text-4xl font-bold mb-8">
            THÔNG TIN SỰ KIỆN
          </h2>
          <div className="text-xl text-justify leading-relaxed bg-white p-6 rounded-lg shadow">
            <p className="mb-4 font-bold">
              Đêm 2 - Anh Trai Say Hi Concert 2024
            </p>
            <p className="mb-4 text-gray-700">
              Hồi 19h30 ngày 20 tháng 3 năm 2024
            </p>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              malesuada ligula vitae urna tincidunt, ut semper enim vehicula.
              Integer nec ligula ac ligula lacinia fermentum a at felis.
              Phasellus semper tellus nec sapien accumsan, a fringilla libero
              fringilla. Proin auctor, lacus id dictum faucibus, orci urna
              ullamcorper nisl, ac consequat lectus ipsum nec augue. Nulla
              facilisi. Sed tristique velit eget ligula porttitor condimentum.
              Aenean nec risus fringilla, gravida lectus vel, egestas mauris.
              Curabitur blandit justo quis risus lacinia, sed facilisis erat
              tincidunt. Praesent cursus interdum sem, et accumsan orci vehicula
              a.
            </p>
          </div>

          <div className="text-center mt-6">
            <button className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:scale-95 transition">
              Xem thêm
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
