// src/app/account/my-tickets/[ticketId]/TicketDetailClient.tsx
"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import api from "@/config/axios";

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
  createdAt: string;
  type: "selling" | "buying";
  event: {
    name: string;
    time: string;
    location: string;
  };
}

interface EditTicketForm {
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  quantity: number;
  minInOrder: number;
  maxInOrder: number;
}

interface PageProps {
  params: Promise<{
    ticketId: string;
  }>;
}

// Component cho vé đang bán
function SellingTicketDetail({
  ticket,
  onUpdate,
}: {
  ticket: Ticket;
  onUpdate: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm] = useState<EditTicketForm>({
    name: ticket.name,
    imageUrl: ticket.imageUrl,
    description: ticket.description,
    price: ticket.price,
    quantity: ticket.quantity,
    minInOrder: ticket.minInOrder,
    maxInOrder: ticket.maxInOrder,
  });

  const isExpired = new Date(ticket.event.time) < new Date();
  const canEdit = ["pending", "approved"].includes(ticket.status) && !isExpired;

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await api.patch(`/tickets/${ticket.id}/status/${newStatus}`);
      toast.success("Cập nhật trạng thái thành công");
      onUpdate();
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("Không thể cập nhật trạng thái vé");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/tickets/${ticket.id}`, editForm);
      toast.success("Cập nhật thông tin vé thành công");
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Không thể cập nhật thông tin vé");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 bg-blue-50">
        <div className="flex justify-between items-center">
          <span className="font-medium">Vé Đang Đăng Bán</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              ticket.status === "pending"
                ? "bg-blue-100 text-blue-800"
                : ticket.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : ticket.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
            }`}
          >
            {ticket.status === "pending"
              ? "Đang chờ duyệt"
              : ticket.status === "approved"
                ? "Đã được duyệt"
                : ticket.status === "rejected"
                  ? "Đã bị từ chối"
                  : "Đã hủy đăng bán"}
          </span>
        </div>
      </div>

      {/* Phần nội dung chi tiết vé */}
      <TicketContent ticket={ticket} />

      {/* Actions */}
      <div className="p-6 border-t">
        <div className="flex space-x-4">
          {canEdit && (
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline">Chỉnh sửa thông tin</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Chỉnh sửa thông tin vé</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  {/* Form fields */}
                  {/* ... (giữ nguyên phần form như cũ) ... */}
                </form>
              </DialogContent>
            </Dialog>
          )}

          {["pending", "approved"].includes(ticket.status) && !isExpired && (
            <Button
              variant="destructive"
              onClick={() => handleStatusUpdate("removed")}
            >
              Hủy đăng bán
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Component cho vé đã mua
function PurchasedTicketDetail({ ticket }: { ticket: Ticket }) {
  const isExpired = new Date(ticket.event.time) < new Date();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 bg-green-50">
        <div className="flex justify-between items-center">
          <span className="font-medium">Vé Đã Mua</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isExpired
                ? "bg-gray-100 text-gray-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {isExpired ? "Đã hết hạn" : "Còn hạn sử dụng"}
          </span>
        </div>
      </div>

      {/* Phần nội dung chi tiết vé */}
      <TicketContent ticket={ticket} />

      {/* Thông tin bổ sung cho vé đã mua */}
      <div className="p-6 border-t">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-green-800">
            Thông tin vé của bạn
          </h3>
          <div className="space-y-2">
            <p className="text-green-700">
              <span className="font-medium">Trạng thái:</span>{" "}
              {isExpired ? "Đã hết hạn" : "Còn hạn sử dụng"}
            </p>
            <p className="text-green-700">
              <span className="font-medium">Ngày mua:</span>{" "}
              {format(new Date(ticket.createdAt), "dd/MM/yyyy", { locale: vi })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component chung cho nội dung vé
function TicketContent({ ticket }: { ticket: Ticket }) {
  return (
    <div className="p-6">
      <div className="relative w-full h-[300px] mb-6">
        <ImageWithFallback
          src={ticket.imageUrl}
          alt={ticket.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {ticket.name}
          </h1>
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              {format(new Date(ticket.event.time), "HH:mm - EEEE, dd/MM/yyyy", {
                locale: vi,
              })}
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              {ticket.event.location}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
          <p className="text-gray-700">{ticket.description}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Thông tin vé</h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Giá vé</p>
              <p className="text-lg font-semibold text-gray-900">
                {ticket.price.toLocaleString("vi-VN")}đ
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số lượng</p>
              <p className="text-lg font-semibold text-gray-900">
                {ticket.quantity} vé
              </p>
            </div>
            {ticket.type === "selling" && (
              <>
                <div>
                  <p className="text-sm text-gray-500">Mua tối thiểu</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {ticket.minInOrder} vé
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mua tối đa</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {ticket.maxInOrder} vé
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page({ params }: PageProps) {
  const resolvedParams = use(params);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tickets/${resolvedParams.ticketId}`);
      setTicket(response.data.data);
    } catch (error) {
      console.error("Error fetching ticket:", error);
      toast.error("Không thể tải thông tin vé");
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">Không tìm thấy vé</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quay lại
        </button>

        {ticket.type === "selling" ? (
          <SellingTicketDetail ticket={ticket} onUpdate={fetchTicket} />
        ) : (
          <PurchasedTicketDetail ticket={ticket} />
        )}
      </div>
    </div>
  );
}
