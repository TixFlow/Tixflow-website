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
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching ticket with ID:", id);

        const ticketRes = await api.get(`/tickets/${id}`);
        console.log("Ticket response:", ticketRes.data);

        const ticketData = ticketRes.data.data;
        setTicket(ticketData);

        if (ticketData.event) {
          console.log("Using event data from ticket");
          setEvent(ticketData.event);
        } else if (ticketData.eventId) {
          console.log("Fetching event data separately");
          const eventRes = await api.get(`/events/${ticketData.eventId}`);
          console.log("Event response:", eventRes.data);
          setEvent(eventRes.data.data);
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

  if (!ticket || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">
          {!ticket
            ? "Không tìm thấy thông tin vé."
            : "Không tìm thấy thông tin sự kiện."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="max-w-7xl mx-auto pt-10 pb-16 px-4 md:px-8">
        <h1 className="text-center text-4xl font-bold mb-12">THÔNG TIN VÉ</h1>

        <div className="flex flex-col md:flex-row gap-8 bg-primary/10 rounded-3xl p-6 md:p-10">
          <div className="md:w-1/3 flex-shrink-0">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden">
              <Image
                src={ticket.imageUrl}
                alt={ticket.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{ticket.name}</h2>
              <p className="text-gray-600">{ticket.description}</p>
            </div>

            <div className="space-y-4 text-gray-800">
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

              <div className="pt-4 space-y-2">
                <p className="text-2xl font-bold text-primary">
                  {ticket.price.toLocaleString()}đ
                </p>
                <p>Số lượng còn lại: {ticket.quantity} vé</p>
                <p>
                  Giới hạn mua: {ticket.minInOrder} - {ticket.maxInOrder} vé/lần
                </p>
              </div>

              <button
                disabled={ticket.status === "sold_out"}
                className={`w-full md:w-auto px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  ticket.status === "sold_out"
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {ticket.status === "sold_out" ? "Hết vé" : "Mua vé ngay"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-center text-3xl font-bold mb-8">
            THÔNG TIN SỰ KIỆN
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6">
              <Image
                src={event.coverUrl}
                alt={event.name}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">{event.name}</h3>
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

            <div className="text-center mt-8">
              <button
                onClick={() => router.push(`/events/${event.id}`)}
                className="bg-primary/10 text-primary px-6 py-2 rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-300"
              >
                Xem tất cả vé của sự kiện
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
