"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import Image from "next/image";
import { Ticket } from "@/models/Ticket";
import { useSearch } from "@/context/searchContext/searchContext";
import Link from "next/link";

const statusMapping: Record<string, { text: string; className: string }> = {
  available: { text: "Còn hàng", className: "bg-green-100 text-green-800" },
  soldout: { text: "Hết hàng", className: "bg-red-100 text-red-800" },
};

interface TicketCardProps {
  ticket: Ticket;
}

function TicketCard({ ticket }: TicketCardProps) {
  const statusInfo = ticket.status ? statusMapping[ticket.status] : null;
  return (
    <Card className="overflow-hidden py-0">
      <div className="relative w-full aspect-[16/9]">
        <img
          src={ticket.image}
          alt={ticket.event}
          className="w-full h-40 object-cover"
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg line-clamp-2 min-h-[3rem]">
          {ticket.event}
        </h3>
        <p className="text-red-600 font-bold">
          {ticket.price.toLocaleString()}đ
        </p>
        <p className="text-gray-500 text-sm flex gap-2 items-center">
          <CalendarIcon size={16} />
          {format(new Date(ticket.date), "dd/MM/yyyy", { locale: vi })}
        </p>
        {ticket.location && (
          <p className="text-gray-500 text-sm">{ticket.location}</p>
        )}
        {statusInfo && (
          <p
            className={`text-xs font-semibold px-2 py-1 rounded inline-block ${statusInfo.className}`}
          >
            {statusInfo.text}
          </p>
        )}
      </div>
    </Card>
  );
}

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { appliedQuery } = useSearch();

  useEffect(() => {
    fetch("http://localhost:3001/tickets")
      .then((res) => res.json())
      .then((data: Ticket[]) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, selectedDate, appliedQuery]);

  const filterTickets = () => {
    let result = [...tickets];

    if (appliedQuery && appliedQuery.trim() !== "") {
      result = result.filter((ticket) =>
        ticket.event.toLowerCase().includes(appliedQuery.toLowerCase())
      );
    }

    if (selectedDate) {
      const selected = selectedDate.toISOString().split("T")[0];
      result = result.filter((ticket) => ticket.date === selected);
    }

    setFilteredTickets(result);
  };

  if (loading) return <p className="p-10">Đang tải dữ liệu...</p>;

  return (
    <div className="p-6 space-y-6">
      {appliedQuery && appliedQuery.trim() !== "" && (
        <h2 className="text-2xl font-bold">
          Kết quả tìm kiếm cho: "{appliedQuery}"
        </h2>
      )}
      <div className="flex justify-end">
        <div className="relative">
          <button
            onClick={() => setShowCalendar((prev) => !prev)}
            className="px-4 py-2 bg-orange-500 text-white rounded-md"
          >
            {selectedDate ? (
              `Ngày: ${format(selectedDate, "dd/MM/yyyy")}`
            ) : (
              <CalendarIcon size={16} />
            )}
          </button>
          {showCalendar && (
            <div className="absolute right-0 mt-2 z-10">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setShowCalendar(false);
                }}
                className="rounded-md border"
                locale={vi}
              />
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTickets.map((ticket) => (
          <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
            <TicketCard key={ticket.id} ticket={ticket} />
          </Link>
        ))}
        {filteredTickets.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            Không tìm thấy vé nào phù hợp.
          </div>
        )}
      </div>
    </div>
  );
}
