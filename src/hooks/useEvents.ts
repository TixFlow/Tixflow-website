import { useState, useEffect } from "react";
import api from "@/config/axios";
import { toast } from "sonner";

const EVENTS_CACHE_KEY = "events_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const fetchEvents = async () => {
    if (isLoadingEvents) return;

    try {
      // Kiểm tra cache
      const cachedData = localStorage.getItem(EVENTS_CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setEvents(data);
          return;
        }
      }

      setIsLoadingEvents(true);
      const res = await api.get("/events");
      setEvents(res.data.data);

      // Lưu cache
      localStorage.setItem(
        EVENTS_CACHE_KEY,
        JSON.stringify({
          data: res.data.data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      toast.error(
        `Lỗi khi tải danh sách sự kiện: ${error instanceof Error ? error.message : "Lỗi không xác định"}`
      );
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, isLoadingEvents, refetchEvents: fetchEvents };
};
