"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import api from "@/config/axios";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

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
  event: {
    id: string;
    name: string;
    coverUrl: string;
    location: string;
    time: string;
    type: string;
    status: string;
    introduction: string;
    description: string;
  };
}

export default function TicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/tickets/${id}`);
        if (response.data.data.status === "approved") {
          setTicket(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicket();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Không tìm thấy thông tin vé.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="max-w-7xl mx-auto pt-10 pb-16 px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-8 bg-primary/10 rounded-3xl p-6 md:p-10">
          {/* Ticket Image */}
          <div className="md:w-1/3 flex-shrink-0">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden">
              <ImageWithFallback
                src={ticket.imageUrl}
                alt={ticket.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
          </div>

          {/* Ticket Info */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{ticket.name}</h2>
              <p className="text-gray-600">{ticket.description}</p>
            </div>

            <div className="space-y-4 text-gray-800">
              <div className="flex items-center gap-2">
                <CalendarIcon className="text-primary" size={20} />
                <span>
                  {format(
                    new Date(ticket.event.time),
                    "EEEE, dd/MM/yyyy HH:mm",
                    {
                      locale: vi,
                    }
                  )}
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
                <span>{ticket.event.location}</span>
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
                onClick={() =>
                  router.push(`/tickets/create-ticket?ticketId=${ticket.id}`)
                }
                disabled={ticket.quantity === 0}
                className={`w-full md:w-auto px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  ticket.quantity === 0
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {ticket.quantity === 0 ? "Hết vé" : "Mua vé ngay"}
              </button>
            </div>
          </div>
        </div>

        {/* Event Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Thông tin sự kiện</h2>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden">
              <ImageWithFallback
                src={ticket.event.coverUrl}
                alt={ticket.event.name}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">{ticket.event.name}</h3>
              <div className="prose max-w-none">
                <div className="mb-6">
                  <h4 className="text-xl font-semibold mb-2">Giới thiệu</h4>
                  <p className="text-gray-600 whitespace-pre-line">
                    {ticket.event.introduction}
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Chi tiết</h4>
                  <p className="text-gray-600 whitespace-pre-line">
                    {ticket.event.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
