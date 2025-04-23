// app/tickets/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/config/axios";
import { Calendar as CalendarIcon } from "lucide-react";

interface Ticket {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  quantity: number;
  minInOrder: number;
  maxInOrder: number;
  status: string;
  eventId: string;
}

interface Event {
  id: string;
  name: string;
  coverUrl: string;
  location: string;
  time: string;
  type: string;
  status: string;
  introduction: string;
  description: string;
}

export default function TicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching tickets for event ID:", id);

        const ticketsRes = await api.get(`/tickets/event/${id}`);
        console.log("Tickets response:", ticketsRes.data);

        if (ticketsRes.data.data && ticketsRes.data.data.length > 0) {
          const approvedTickets = ticketsRes.data.data.filter(
            (ticket: Ticket) => ticket.status === "approved"
          );
          setTickets(approvedTickets);
          if (ticketsRes.data.data[0].event) {
            setEvent(ticketsRes.data.data[0].event);
          }
        }
      } catch (error) {
        console.error("Error details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">ID vé không hợp lệ.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">
          Không tìm thấy thông tin sự kiện.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="max-w-7xl mx-auto pt-10 pb-16 px-4 md:px-8">
        <h1 className="text-center text-4xl font-bold mb-12">
          THÔNG TIN SỰ KIỆN
        </h1>

        <div className="bg-primary/10 rounded-3xl p-6 md:p-10 mb-12">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-6">
            <Image
              src={event.coverUrl}
              alt={event.name}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold">{event.name}</h2>

            <div className="flex items-center gap-4 text-gray-800">
              <div className="flex items-center gap-2">
                <CalendarIcon className="text-primary" size={20} />
                <span>
                  {new Date(event.time).toLocaleString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{event.location}</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="mb-6">
                <h4 className="text-xl font-semibold mb-2">Giới thiệu</h4>
                <p className="text-gray-600 whitespace-pre-line">
                  {event.introduction}
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Chi tiết</h4>
                <p className="text-gray-600 whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-center text-3xl font-bold mb-8">DANH SÁCH VÉ</h2>
          {tickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={ticket.imageUrl}
                      alt={ticket.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{ticket.name}</h3>
                    <p className="text-gray-600 mb-4">{ticket.description}</p>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-primary">
                        {ticket.price.toLocaleString()}đ
                      </p>
                      <p className="text-sm text-gray-500">
                        Còn lại: {ticket.quantity} vé
                      </p>
                      <p className="text-sm text-gray-500">
                        Giới hạn: {ticket.minInOrder} - {ticket.maxInOrder}{" "}
                        vé/lần
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(`/ticket/${ticket.id}`)}
                      disabled={ticket.quantity === 0}
                      className={`w-full mt-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        ticket.quantity === 0
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary/90"
                      }`}
                    >
                      {ticket.quantity === 0 ? "Hết vé" : "Mua vé ngay"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-8">
              <p>Hiện tại chưa có vé nào được mở bán.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
