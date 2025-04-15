"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

const STORAGE_KEYS = {
  NEW_EVENT: "create_ticket_event_draft",
  TICKET_DATA: "create_ticket_data_draft",
  SELECTED_EVENT: "create_ticket_selected_event",
  ACTIVE_TAB: "create_ticket_active_tab",
};

const saveToStorage = (key: string, data: unknown) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

const getFromStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

const clearTicketDrafts = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};

export default function CreateTicketPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>(
    getFromStorage(STORAGE_KEYS.SELECTED_EVENT) || ""
  );
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
    ...getFromStorage(STORAGE_KEYS.NEW_EVENT),
  });

  const [ticketData, setTicketData] = useState({
    name: "",
    imageUrl: "",
    description: "",
    price: 0,
    quantity: 1,
    minInOrder: 1,
    maxInOrder: 10,
    ...getFromStorage(STORAGE_KEYS.TICKET_DATA),
  });

  const [ticketId, setTicketId] = useState<string>("");

  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const [activeTab, setActiveTab] = useState(
    getFromStorage(STORAGE_KEYS.ACTIVE_TAB) || "tab1"
  );

  // Thêm state để lưu preview URL
  const [eventImagePreview, setEventImagePreview] = useState<string>("");
  const [ticketImagePreview, setTicketImagePreview] = useState<string>("");

  // Thêm state để track trạng thái upload
  const [isUploading, setIsUploading] = useState({
    event: false,
    ticket: false,
  });

  // Thêm state để quản lý iframe
  const [paymentIframe, setPaymentIframe] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");

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

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NEW_EVENT, newEvent);
  }, [newEvent]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TICKET_DATA, ticketData);
  }, [ticketData]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SELECTED_EVENT, selectedEventId);
  }, [selectedEventId]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACTIVE_TAB, activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && !e.newValue) {
        clearTicketDrafts();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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

  // Thêm các hàm validation
  const validateEventForm = (event: typeof newEvent) => {
    const errors: string[] = [];

    if (!event.name.trim()) {
      errors.push("Tên sự kiện không được để trống");
    }
    if (!event.coverUrl) {
      errors.push("Ảnh bìa sự kiện là bắt buộc");
    }
    if (!event.location.trim()) {
      errors.push("Địa điểm không được để trống");
    }
    if (!event.time) {
      errors.push("Thời gian sự kiện là bắt buộc");
    }
    if (!event.type) {
      errors.push("Loại sự kiện là bắt buộc");
    }
    if (!event.introduction.trim()) {
      errors.push("Giới thiệu ngắn gọn không được để trống");
    }
    if (!event.description.trim()) {
      errors.push("Mô tả chi tiết không được để trống");
    }

    return errors;
  };

  const validateTicketForm = (ticket: typeof ticketData) => {
    const errors: string[] = [];

    if (!ticket.name.trim()) {
      errors.push("Tên vé không được để trống");
    }
    if (!ticket.imageUrl) {
      errors.push("Ảnh vé là bắt buộc");
    }
    if (!ticket.description.trim()) {
      errors.push("Mô tả vé không được để trống");
    }
    if (ticket.price <= 0) {
      errors.push("Giá vé phải lớn hơn 0");
    }
    if (ticket.quantity < 1) {
      errors.push("Số lượng vé phải ít nhất là 1");
    }
    if (ticket.minInOrder > ticket.maxInOrder) {
      errors.push("Số lượng đặt tối thiểu không được lớn hơn tối đa");
    }

    return errors;
  };

  const handleCreateEvent = async () => {
    try {
      const errors = validateEventForm(newEvent);
      if (errors.length > 0) {
        errors.forEach((error) => toast.error(error));
        return;
      }

      setLoading(true);
      const res = await api.post("/events", { ...newEvent });
      setSelectedEventId(res.data.data.id);
      setActiveTab("tab2");
      toast.success("Tạo sự kiện thành công");
      localStorage.removeItem(STORAGE_KEYS.NEW_EVENT);
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
      const errors = validateTicketForm(ticketData);
      if (errors.length > 0) {
        errors.forEach((error) => toast.error(error));
        return;
      }

      setLoading(true);
      const res = await api.post("/tickets", {
        ...ticketData,
        eventId: selectedEventId,
      });
      setTicketId(res.data.data.id);
      setActiveTab("tab3");
      toast.success("Tạo vé thành công");
      localStorage.removeItem(STORAGE_KEYS.TICKET_DATA);
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

      // Thay vì set paymentLink, set iframe URL
      setPaymentIframe(res.data.data.paymentUrl);

      // Lắng nghe message từ iframe thanh toán
      window.addEventListener("message", handlePaymentMessage);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      toast.error("Không thể tạo đơn hàng");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Thêm hàm xử lý message từ iframe
  const handlePaymentMessage = (event: MessageEvent) => {
    // Kiểm tra origin của message để đảm bảo an toàn
    if (event.origin !== "https://your-payment-domain.com") return;

    const { status } = event.data;

    if (status === "success") {
      setPaymentStatus("success");
      toast.success("Thanh toán thành công!");
      clearTicketDrafts();
      // Có thể thêm redirect sau khi thanh toán thành công
      // router.push('/tickets/my-tickets');
    } else if (status === "failed") {
      setPaymentStatus("failed");
      toast.error("Thanh toán thất bại!");
    }
  };

  // Cleanup event listener khi component unmount
  useEffect(() => {
    return () => {
      window.removeEventListener("message", handlePaymentMessage);
    };
  }, []);

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
                  className={`${!newEvent.name.trim() ? "border-red-300" : ""}`}
                />
                <div className="text-xs text-red-500">
                  {!newEvent.name.trim() && "Tên sự kiện là bắt buộc"}
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">
                    Ảnh bìa sự kiện *
                    {!newEvent.coverUrl && (
                      <span className="text-xs text-red-500 ml-1">
                        (Bắt buộc)
                      </span>
                    )}
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

              {isUploading.ticket && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              )}

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
              className={`${ticketData.price <= 0 ? "border-red-300" : ""}`}
            />
            <div className="text-xs text-red-500">
              {ticketData.price <= 0 && "Giá vé phải lớn hơn 0"}
            </div>

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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Thanh toán phí đăng bán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Hiển thị thông tin đơn hàng */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Giá vé:</span>
                    <span>{ticketData.price.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số lượng:</span>
                    <span>{ticketData.quantity}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Phí đăng bán:</span>
                    <span>
                      {(ticketData.price > 1_000_000
                        ? 50000
                        : 30000
                      ).toLocaleString()}
                      đ
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-lg text-blue-600">
                      {(
                        (ticketData.price > 1_000_000 ? 50000 : 30000) *
                        ticketData.quantity
                      ).toLocaleString()}
                      đ
                    </span>
                  </div>
                </div>

                {!paymentIframe && (
                  <Button
                    onClick={handleCreateOrder}
                    disabled={isCreatingOrder}
                    className="w-full"
                  >
                    {isCreatingOrder ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Đang xử lý...</span>
                      </div>
                    ) : (
                      "Tiến hành thanh toán"
                    )}
                  </Button>
                )}

                {/* Phần iframe thanh toán */}
                {paymentIframe && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent h-8 z-10"></div>
                    <iframe
                      src={paymentIframe}
                      className="w-full h-[600px] rounded-lg border"
                      frameBorder="0"
                      allow="payment"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white to-transparent h-8 z-10"></div>
                  </div>
                )}

                {/* Hiển thị trạng thái thanh toán */}
                {paymentStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-green-700 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      Thanh toán thành công! Vé của bạn đã được đăng bán.
                    </span>
                  </div>
                )}

                {paymentStatus === "failed" && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>Thanh toán thất bại! Vui lòng thử lại.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="text-sm text-gray-500 mt-4">
        <div className="flex items-center gap-1">
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Các trường đánh dấu (*) là bắt buộc</span>
        </div>
      </div>
    </div>
  );
}
