"use client";

import React, { useState, useEffect } from "react";
import TicketCarousel from "@/components/Ticket/TicketCarousel";
import { Ticket } from "@/models/Ticket";

interface DataResponse {
  tickets: Ticket[];
}

const categories = [
  { key: "nhạc sống", title: "Nhạc sống" },
  { key: "sân khấu và nghệ thuật", title: "Sân khấu và nghệ thuật" },
  { key: "thể thao", title: "Thể thao" },
  { key: "khác", title: "Thể loại khác" },
];

export default function TicketListByCategory() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:3001/tickets")
      .then((res) => res.json())
      .then((data: DataResponse) => {
        setTickets(data.tickets || data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-10">Đang tải dữ liệu...</p>;

  return (
    <div className="space-y-10 p-1  6">
      {categories.map((cat) => {
        const filteredTickets = tickets.filter(
          (ticket) => ticket.category.toLowerCase() === cat.key.toLowerCase()
        );
        if (filteredTickets.length === 0) return null;
        return (
          <TicketCarousel
            key={cat.key}
            tickets={filteredTickets}
            title={cat.title}
          />
        );
      })}
    </div>
  );
}
