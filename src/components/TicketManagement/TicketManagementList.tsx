// src/components/TicketManagement/TicketManagementList.tsx
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/config/axios";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Ticket {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  quantity: number;
  status: string;
  createdAt: string;
  event: {
    name: string;
    time: string;
    location: string;
  };
}

interface TicketCardProps {
  ticket: Ticket;
  type: "selling" | "buying";
}

const statusLabels: Record<string, string> = {
  pending: "Đang duyệt",
  approved: "Đang đăng bán",
  removed: "Đã huỷ",
  rejected: "Từ chối",
  expired: "Hết hạn",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  approved: "bg-green-100 text-green-800 border border-green-200",
  removed: "bg-gray-100 text-gray-800 border border-gray-200",
  rejected: "bg-red-100 text-red-800 border border-red-200",
  expired: "bg-gray-100 text-gray-800 border border-gray-200",
};

const getStatusLabel = (status: string, type: "selling" | "buying") => {
  if (type === "buying") {
    switch (status) {
      case "pending":
        return "Chờ thanh toán";
      case "approved":
        return "Đã thanh toán";
      case "removed":
        return "Đã huỷ";
      case "expired":
        return "Hết hạn";
      default:
        return status;
    }
  }
  return statusLabels[status];
};

function TicketCard({ ticket, type }: TicketCardProps) {
  const isExpired = new Date(ticket.event.time) < new Date();
  const displayStatus = isExpired ? "expired" : ticket.status;
  const router = useRouter();

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await api.put(`/tickets/${ticket.id}/status/${newStatus}`);
      toast.success("Cập nhật trạng thái thành công");
      router.refresh();
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("Không thể cập nhật trạng thái vé");
    }
  };

  const handleViewDetail = () => {
    router.push(`/account/my-tickets/${ticket.id}`);
  };

  return (
    <Card
      className="group py-0 overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-0 rounded-xl cursor-pointer"
      onClick={handleViewDetail}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <ImageWithFallback
          src={ticket.imageUrl}
          alt={ticket.name}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-medium shadow-sm ${statusColors[displayStatus]}`}
          >
            {getStatusLabel(displayStatus, type)}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem] text-gray-800">
            {ticket.name}
          </h3>
          <p className="text-primary font-bold text-2xl">
            {ticket.price.toLocaleString()}đ
          </p>
          {type === "buying" && (
            <p className="text-sm text-gray-500">
              Số lượng: {ticket.quantity} vé
            </p>
          )}
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p className="font-medium text-base text-gray-800">
            {ticket.event.name}
          </p>
          <div className="flex items-center gap-2 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p>
              {format(new Date(ticket.event.time), "EEEE, dd/MM/yyyy HH:mm", {
                locale: vi,
              })}
            </p>
          </div>
          <div className="flex items-start gap-2 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mt-1 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="line-clamp-2">{ticket.event.location}</p>
          </div>
        </div>
      </div>

      {type === "selling" && (
        <div
          className="px-5 pb-5 space-x-2"
          onClick={(e) => e.stopPropagation()}
        >
          {(ticket.status === "pending" || ticket.status === "approved") &&
            !isExpired && (
              <button
                onClick={() => handleStatusUpdate("removed")}
                className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Huỷ đăng bán
              </button>
            )}
        </div>
      )}
    </Card>
  );
}

interface TicketManagementListProps {
  tickets: Ticket[];
  type: "selling" | "buying";
}

export default function TicketManagementList({
  tickets,
  type,
}: TicketManagementListProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const router = useRouter();

  const updateTicketStatus = useCallback(
    async (ticketId: string, newStatus: string) => {
      try {
        await api.patch(`/tickets/${ticketId}/status/${newStatus}`);
        toast.success("Cập nhật trạng thái thành công");
        router.refresh();
      } catch (error) {
        console.error("Error updating ticket status:", error);
        toast.error("Không thể cập nhật trạng thái vé");
      }
    },
    [router]
  );

  useEffect(() => {
    const checkAndUpdateExpiredTickets = async () => {
      const now = new Date();
      const expiredTickets = tickets.filter(
        (ticket) =>
          new Date(ticket.event.time) < now &&
          ticket.status !== "expired" &&
          ticket.status !== "removed"
      );

      // Update expired tickets
      for (const ticket of expiredTickets) {
        await updateTicketStatus(ticket.id, "expired");
      }
    };

    checkAndUpdateExpiredTickets();
  }, [tickets, updateTicketStatus]);

  const filteredTickets = useMemo(() => {
    const uniqueTickets = new Map();
    const now = new Date();

    let ticketsToFilter = tickets.map((ticket) => ({
      ...ticket,

      status: new Date(ticket.event.time) < now ? "expired" : ticket.status,
    }));

    ticketsToFilter.forEach((ticket) => {
      uniqueTickets.set(ticket.id, ticket);
    });

    ticketsToFilter = Array.from(uniqueTickets.values());

    if (statusFilter === "all") return ticketsToFilter;
    return ticketsToFilter.filter((ticket) => {
      if (statusFilter === "expired") {
        return new Date(ticket.event.time) < now;
      }
      return ticket.status === statusFilter;
    });
  }, [tickets, statusFilter]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800">
          {type === "selling" ? "Vé đang đăng bán" : "Vé đã mua"}
          <span className="text-gray-500 text-base ml-2">
            ({filteredTickets.length} vé)
          </span>
        </h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] border-2 focus:ring-2 focus:ring-primary/20">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {type === "selling" ? (
              <>
                <SelectItem value="pending">Đang duyệt</SelectItem>
                <SelectItem value="approved">Đang đăng bán</SelectItem>
                <SelectItem value="removed">Đã huỷ</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="pending">Chờ thanh toán</SelectItem>
                <SelectItem value="approved">Đã thanh toán</SelectItem>
                <SelectItem value="removed">Đã huỷ</SelectItem>
              </>
            )}
            <SelectItem value="expired">Hết hạn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="text-gray-400 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">
            Không có vé nào {statusFilter !== "all" ? "ở trạng thái này" : ""}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={`${ticket.id}-${type}-${ticket.status}`}
              ticket={ticket}
              type={type}
            />
          ))}
        </div>
      )}
    </div>
  );
}
