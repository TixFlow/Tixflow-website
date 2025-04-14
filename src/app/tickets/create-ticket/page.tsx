"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import api from "@/config/axios";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";

interface Event {
  id: string;
  name: string;
  coverUrl: string;
  location: string;
  type: string;
  time: string;
  introduction: string;
  description: string;
  condition: string;
}

export default function CreateTicketPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newEvent, setNewEvent] = useState({
    name: "",
    coverUrl: "",
    location: "",
    type: "live_music",
    time: new Date().toISOString(),
    introduction: "",
    description: "",
    condition: "",
  });

  const [ticketData, setTicketData] = useState({
    name: "",
    imageUrl: "",
    description: "",
    price: 0,
    quantity: 1,
    minInOrder: 1,
    maxInOrder: 10,
    status: "available",
  });

  const [ticketId, setTicketId] = useState<string>("");
  const [paymentLink, setPaymentLink] = useState<string>("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const [activeTab, setActiveTab] = useState("tab1");

  // Thêm state để lưu preview URL
  const [eventImagePreview, setEventImagePreview] = useState<string>("");
  const [ticketImagePreview, setTicketImagePreview] = useState<string>("");

  // Thêm state để track trạng thái upload
  const [isUploading, setIsUploading] = useState({
    event: false,
    ticket: false,
  });

  useEffect(() => {
    fetchEvents();

    return () => {
      // Cleanup preview URLs khi component unmount
      if (eventImagePreview) {
        URL.revokeObjectURL(eventImagePreview);
      }
      if (ticketImagePreview) {
        URL.revokeObjectURL(ticketImagePreview);
      }
    };
  }, [eventImagePreview, ticketImagePreview]);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data.data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Lỗi không xác định";
      toast.error(`Lỗi khi tải danh sách sự kiện: ${errorMessage}`);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);

      // Kiểm tra file tồn tại
      if (!file) {
        throw new Error("Vui lòng chọn file ảnh");
      }

      // Kiểm tra kích thước file (giới hạn 5MB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        throw new Error("Kích thước file không được vượt quá 5MB");
      }

      // Kiểm tra định dạng file
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heic",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WebP");
      }

      // Tạo tên file unique với timestamp và extension
      const fileExtension = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

      // Tạo reference đến storage - Sửa Storage thành storage
      const storageRef = ref(storage, `images/${fileName}`);

      // Upload file với metadata
      const metadata = {
        contentType: file.type,
        customMetadata: {
          originalName: file.name,
        },
      };

      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);

      toast.success("Tải ảnh lên thành công");
      return downloadURL;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Lỗi không xác định khi tải ảnh";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      setLoading(true);
      if (!newEvent.name || !newEvent.coverUrl || !newEvent.location) {
        toast.error("Vui lòng điền đầy đủ thông tin sự kiện");
        return;
      }

      const res = await api.post("/events", { ...newEvent });
      setSelectedEventId(res.data.data.id);
      setActiveTab("tab2");
      toast.success("Tạo sự kiện thành công");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Lỗi không xác định";
      toast.error(`Lỗi khi tạo sự kiện: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    try {
      setLoading(true);
      if (!ticketData.name || !ticketData.imageUrl || ticketData.price <= 0) {
        toast.error("Vui lòng điền đầy đủ thông tin vé");
        return;
      }

      const res = await api.post("/tickets", {
        ...ticketData,
        eventId: selectedEventId,
      });
      setTicketId(res.data.data.id);
      setActiveTab("tab3");
      toast.success("Tạo vé thành công");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Lỗi không xác định";
      toast.error(`Lỗi khi tạo vé: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    setIsCreatingOrder(true);
    try {
      const fee = ticketData.price > 1_000_000 ? 50000 : 30000;
      const total = fee * ticketData.quantity;
      const res = await api.post("/order", {
        ticketId,
        type: "sell_ticket",
        price: total,
        quantity: ticketData.quantity,
      });
      setPaymentLink(res.data.data.paymentLink);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 mt-10 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Đăng bán vé</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tab1">1. Thông tin sự kiện</TabsTrigger>
          <TabsTrigger value="tab2" disabled={!selectedEventId}>
            2. Thông tin vé
          </TabsTrigger>
          <TabsTrigger value="tab3" disabled={!ticketId}>
            3. Thanh toán
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "tab1" && (
        <div className="space-y-4">
          {!showCreateEvent && (
            <>
              <Select
                onValueChange={(value) => {
                  setSelectedEventId(value);
                  if (value) setShowCreateEvent(false);
                }}
                value={selectedEventId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn sự kiện" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {!selectedEventId && (
                <>
                  <div className="text-center text-sm text-gray-500">
                    -- hoặc --
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateEvent(true)}
                    className="w-full"
                  >
                    Tạo mới sự kiện
                  </Button>
                </>
              )}

              {selectedEventId && (
                <Button
                  className="w-full"
                  onClick={() => {
                    setActiveTab("tab2");
                  }}
                >
                  Tiếp tục với sự kiện đã chọn
                </Button>
              )}
            </>
          )}

          {showCreateEvent && (
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateEvent(false);
                  setSelectedEventId("");
                }}
                className="w-full"
              >
                Quay lại chọn sự kiện
              </Button>

              <div className="space-y-4 border p-4 rounded-lg">
                <Input
                  placeholder="Tên sự kiện *"
                  value={newEvent.name}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, name: e.target.value })
                  }
                />

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">
                    Ảnh bìa sự kiện *
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={isUploading.event}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          setIsUploading((prev) => ({ ...prev, event: true }));
                          const url = await handleFileUpload(file);
                          setNewEvent({ ...newEvent, coverUrl: url });
                          // Chỉ tạo preview URL sau khi upload thành công
                          const previewUrl = URL.createObjectURL(file);
                          setEventImagePreview(previewUrl);
                          toast.success("Tải ảnh thành công");
                        } catch (error) {
                          console.error(error);
                          toast.error("Lỗi khi tải ảnh");
                        } finally {
                          setIsUploading((prev) => ({ ...prev, event: false }));
                        }
                      }
                    }}
                  />

                  {isUploading.event && (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    </div>
                  )}

                  {!isUploading.event &&
                    (eventImagePreview || newEvent.coverUrl) && (
                      <div className="mt-2 relative w-full h-48">
                        <Image
                          src={eventImagePreview || newEvent.coverUrl}
                          alt="Event Preview"
                          fill
                          className="object-cover rounded-md"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                        <button
                          onClick={() => {
                            setEventImagePreview("");
                            setNewEvent({ ...newEvent, coverUrl: "" });
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full z-10"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                </div>

                <Input
                  placeholder="Địa điểm *"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                />

                <Select
                  onValueChange={(value) =>
                    setNewEvent({ ...newEvent, type: value })
                  }
                  defaultValue={newEvent.type}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Loại sự kiện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="live_music">Nhạc sống</SelectItem>
                    <SelectItem value="sports">Thể thao</SelectItem>
                    <SelectItem value="stage_and_art">
                      Sân khấu & Nghệ thuật
                    </SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="datetime-local"
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      time: new Date(e.target.value).toISOString(),
                    })
                  }
                />

                <Textarea
                  placeholder="Giới thiệu ngắn gọn"
                  value={newEvent.introduction}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, introduction: e.target.value })
                  }
                />

                <Textarea
                  placeholder="Mô tả chi tiết"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                />

                <Textarea
                  placeholder="Điều kiện & Điều khoản"
                  value={newEvent.condition}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, condition: e.target.value })
                  }
                />

                <Button
                  onClick={handleCreateEvent}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Đang xử lý..." : "Tạo sự kiện & Tiếp tục"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "tab2" && (
        <div className="space-y-4">
          <div className="space-y-4 border p-4 rounded-lg">
            <Input
              placeholder="Tên vé *"
              value={ticketData.name}
              onChange={(e) =>
                setTicketData({ ...ticketData, name: e.target.value })
              }
            />

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Ảnh vé *</label>
              <Input
                type="file"
                accept="image/*"
                disabled={isUploading.ticket}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      setIsUploading((prev) => ({ ...prev, ticket: true }));
                      const url = await handleFileUpload(file);
                      setTicketData({ ...ticketData, imageUrl: url });
                      // Chỉ tạo preview URL sau khi upload thành công
                      const previewUrl = URL.createObjectURL(file);
                      setTicketImagePreview(previewUrl);
                      toast.success("Tải ảnh thành công");
                    } catch (error) {
                      console.error(error);
                      toast.error("Lỗi khi tải ảnh");
                    } finally {
                      setIsUploading((prev) => ({ ...prev, ticket: false }));
                    }
                  }
                }}
              />
              {/* Hiển thị loading state */}
              {isUploading.ticket && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              )}
              {/* Preview image chỉ hiện khi có URL và không trong trạng thái upload */}
              {!isUploading.ticket &&
                (ticketImagePreview || ticketData.imageUrl) && (
                  <div className="mt-2 relative w-full h-48">
                    <Image
                      src={ticketImagePreview || ticketData.imageUrl}
                      alt="Ticket Preview"
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    <button
                      onClick={() => {
                        setTicketImagePreview("");
                        setTicketData({ ...ticketData, imageUrl: "" });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full z-10"
                    >
                      ✕
                    </button>
                  </div>
                )}
            </div>

            <Textarea
              placeholder="Mô tả vé"
              value={ticketData.description}
              onChange={(e) =>
                setTicketData({ ...ticketData, description: e.target.value })
              }
            />

            <Input
              placeholder="Giá vé (VNĐ) *"
              type="number"
              min="0"
              value={ticketData.price || ""}
              onChange={(e) =>
                setTicketData({ ...ticketData, price: Number(e.target.value) })
              }
            />

            <Input
              placeholder="Số lượng vé *"
              type="number"
              min="1"
              value={ticketData.quantity}
              onChange={(e) =>
                setTicketData({
                  ...ticketData,
                  quantity: Number(e.target.value),
                })
              }
            />

            <div className="text-sm text-gray-500">
              Số lượng đặt tối thiểu: {ticketData.minInOrder}, tối đa:{" "}
              {ticketData.maxInOrder}
            </div>

            <Button
              onClick={handleCreateTicket}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Đang xử lý..." : "Hoàn tất đăng bán"}
            </Button>
          </div>
        </div>
      )}

      {activeTab === "tab3" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Bước 3: Thanh toán</h2>

          <Button onClick={handleCreateOrder} disabled={isCreatingOrder}>
            {isCreatingOrder ? "Đang xử lý..." : "Thanh toán"}
          </Button>

          {paymentLink && (
            <div className="pt-4">
              <a
                href={paymentLink}
                target="_blank"
                className="text-blue-600 underline"
              >
                Đi tới trang thanh toán
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
