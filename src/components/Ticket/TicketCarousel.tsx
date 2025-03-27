"use client";

import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Ticket } from "@/models/Ticket";
import Link from "next/link";
import Image from "next/image";

interface TicketCarouselProps {
  tickets: Ticket[];
  title?: string;
}

const ITEMS_PER_PAGE = 4;

export default function TicketCarousel({
  tickets,
  title = "Danh mục vé",
}: TicketCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - ITEMS_PER_PAGE, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + ITEMS_PER_PAGE, tickets.length - ITEMS_PER_PAGE)
    );
  };

  const visibleTickets = tickets.slice(
    currentIndex,
    currentIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="w-full p-10">
      <div className="flex items-center justify-center mb-6">
        <div className="flex-grow h-px bg-black" />
        <h2 className="px-4 text-2xl font-bold whitespace-nowrap text-center">
          {title}
        </h2>
        <div className="flex-grow h-px bg-black" />
      </div>

      <div className="relative">
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 p-2 bg-white shadow rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mx-10">
          {visibleTickets.map((ticket) => (
            <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
              <div
                key={ticket.id}
                className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition duration-300"
              >
                <Image
                  src={ticket.image}
                  alt={ticket.event}
                  width={400}
                  height={240}
                  className="w-full h-60 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{ticket.event}</h3>
                  <p className="text-red-600 font-bold">
                    {ticket.price.toLocaleString()}đ
                  </p>
                  <p className="text-gray-500 text-sm flex gap-2 items-center">
                    <Calendar size={16} />
                    {ticket.date}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 p-2 bg-white shadow rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
