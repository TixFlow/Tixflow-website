"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { useSearch } from "@/context/searchContext/searchContext";

import api from "@/config/axios";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";

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
    location: string;
    time: string;
  };
}

interface TicketCardProps {
  ticket: Ticket;
}

function TicketCard({ ticket }: TicketCardProps) {
  const router = useRouter();

  const handleViewDetail = () => {
    router.push(`/tickets/tickets/${ticket.id}`);
  };

  return (
    <Card
      className="overflow-hidden py-0 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleViewDetail}
    >
      <div className="relative aspect-[4/3] w-full">
        <ImageWithFallback
          src={ticket.imageUrl}
          alt={ticket.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-lg line-clamp-2 min-h-[3rem]">
          {ticket.name}
        </h3>
        <div className="space-y-2">
          <p className="text-primary font-bold text-xl">
            {ticket.price.toLocaleString()}đ
          </p>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="flex items-center gap-2">
              <CalendarIcon size={16} className="text-primary" />
              {format(new Date(ticket.event.time), "EEEE, dd/MM/yyyy HH:mm", {
                locale: vi,
              })}
            </p>
            <p className="line-clamp-2">{ticket.event.location}</p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Còn lại: {ticket.quantity} vé
            </span>
            <span className="text-sm text-gray-500">
              {ticket.minInOrder}-{ticket.maxInOrder} vé/lần
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/tickets/tickets/${ticket.id}`);
          }}
          disabled={ticket.quantity === 0}
          className={`w-full mt-2 py-2 rounded-lg font-medium transition-all duration-300 ${
            ticket.quantity === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {ticket.quantity === 0 ? "Hết vé" : "Mua vé ngay"}
        </button>
      </div>
    </Card>
  );
}

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const { appliedQuery } = useSearch();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await api.get("/tickets");
        const approvedTickets = response.data.data.filter(
          (ticket: Ticket) => ticket.status === "approved"
        );
        setTickets(approvedTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    let result = [...tickets];

    if (appliedQuery && appliedQuery.trim() !== "") {
      result = result.filter(
        (ticket) =>
          ticket.name.toLowerCase().includes(appliedQuery.toLowerCase()) ||
          ticket.event.name.toLowerCase().includes(appliedQuery.toLowerCase())
      );
    }

    if (selectedDate) {
      result = result.filter((ticket) => {
        const eventDate = new Date(ticket.event.time);
        return (
          eventDate.getFullYear() === selectedDate.getFullYear() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getDate() === selectedDate.getDate()
        );
      });
    }

    return result;
  }, [tickets, selectedDate, appliedQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        {appliedQuery && (
          <h2 className="text-2xl font-bold">
            Kết quả tìm kiếm cho: &quot;{appliedQuery}&quot;
          </h2>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
              <CalendarIcon size={20} />
              {selectedDate
                ? format(selectedDate, "dd/MM/yyyy", { locale: vi })
                : "Chọn ngày"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={vi}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>

      {selectedDate && (
        <div className="flex justify-end">
          <button
            onClick={() => setSelectedDate(undefined)}
            className="text-sm text-primary hover:underline"
          >
            Xóa bộ lọc ngày
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
        {filteredTickets.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            {selectedDate
              ? "Không có vé nào trong ngày đã chọn."
              : "Không tìm thấy vé nào phù hợp."}
          </div>
        )}
      </div>
    </div>
  );
}
