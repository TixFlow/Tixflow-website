"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import api from "@/config/axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ImageWithFallback } from "@/components/ImageWithFallback";

interface Event {
  id: string;
  name: string;
  coverUrl: string;
  location: string;
  time: string;
  type: string;
  status: string;
}

const categories = [
  {
    key: "live_music",
    title: "Nhạc sống",
    icon: "🎵",
  },
  {
    key: "stage_and_art",
    title: "Sân khấu và nghệ thuật",
    icon: "🎭",
  },
  {
    key: "sports",
    title: "Thể thao",
    icon: "⚽",
  },
  {
    key: "other",
    title: "Thể loại khác",
    icon: "🎪",
  },
];

export default function EventListByCategory() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        const approvedEvents = response.data.data.filter(
          (event: Event) => event.status === "approved"
        );
        setEvents(approvedEvents);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sự kiện:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleViewDetail = (eventId: string) => {
    router.push(`/tickets/${eventId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      {categories.map((category) => {
        const filteredEvents = events.filter(
          (event) => event.type === category.key
        );

        if (filteredEvents.length === 0) return null;

        return (
          <motion.div
            key={category.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 border-b pb-2">
              <span className="text-2xl">{category.icon}</span>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {category.title}
              </h2>
            </div>

            <Carousel className="w-full">
              <CarouselContent className="-ml-4">
                {filteredEvents.map((event) => (
                  <CarouselItem
                    key={event.id}
                    className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl">
                      <CardContent className="p-0">
                        <div className="relative h-48 w-full overflow-hidden">
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all z-10" />
                          <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-6">
                            <ImageWithFallback
                              src={event.coverUrl}
                              alt={event.name}
                              className="object-cover"
                              fill
                              sizes="(max-width: 1280px) 100vw, 1280px"
                              priority
                            />
                          </div>
                          <div className="absolute top-3 right-3 z-20">
                            <span className="px-3 py-1 bg-primary/90 text-white text-sm rounded-full">
                              Đang bán
                            </span>
                          </div>
                        </div>
                        <div className="p-4 space-y-3 bg-white">
                          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                            {event.name}
                          </h3>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-primary"
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
                              <p className="line-clamp-1">{event.location}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <p>
                                {new Date(event.time).toLocaleString("vi-VN", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewDetail(event.id)}
                            className="w-full mt-4 py-2 bg-primary/10 text-primary font-medium rounded-lg 
                            hover:bg-primary hover:text-white transition-all duration-300"
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4 hover:bg-primary hover:text-white" />
              <CarouselNext className="hidden md:flex -right-4 hover:bg-primary hover:text-white" />
            </Carousel>
          </motion.div>
        );
      })}
    </div>
  );
}

export const isProduction = process.env.NODE_ENV === "production";
