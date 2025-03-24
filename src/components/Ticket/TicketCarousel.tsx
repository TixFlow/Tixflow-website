"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Ticket {
  id: number;
  image: string;
  name: string;
  price: string;
  time: string;
  category: string;
}

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
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>

      <div className="relative">
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 p-2 bg-white shadow rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mx-10">
          {visibleTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition duration-300"
            >
              <img
                src={ticket.image}
                alt={ticket.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{ticket.name}</h3>
                <p className="text-red-600 font-bold">{ticket.price}</p>
                <p className="text-gray-500 text-sm">{ticket.time}</p>
              </div>
            </div>
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
