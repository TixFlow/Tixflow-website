"use client";
import { useEffect, useState, useMemo, useCallback, memo } from "react";
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
import RequireAuth from "@/components/AuthGuard";
import { debounce } from "lodash";

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

const EVENTS_CACHE_KEY = "events_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const MemoizedSelect = memo(Select);
const MemoizedButton = memo(Button);

// Thêm interface cho validation rules
interface ValidationRule {
  (value: string | number): string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

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

  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const fetchEvents = useCallback(async () => {
    if (isLoadingEvents) return;

    try {
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
  }, [isLoadingEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    return () => {
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

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      if (!file) throw new Error("Vui lòng chọn file ảnh");

      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heic",
      ];

      if (file.size > MAX_FILE_SIZE) {
        throw new Error("Kích thước file không được vượt quá 5MB");
      }

      if (!allowedTypes.includes(file.type)) {
        throw new Error("Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WebP");
      }

      const fileExtension = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const storageRef = ref(storage, `images/${fileName}`);

      const metadata = {
        contentType: file.type,
        customMetadata: { originalName: file.name },
      };

      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);

      toast.success("Tải ảnh lên thành công");
      return downloadURL;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Lỗi không xác định khi tải ảnh";
      toast.error(message);
      throw error;
    }
  }, []);

  // Sửa lại hàm validateForm
  const validateForm = useCallback(
    (data: Record<string, string | number>, rules: ValidationRules) => {
      const errors: string[] = [];

      Object.entries(rules).forEach(([field, validator]) => {
        const error = validator(data[field]);
        if (error) errors.push(error);
      });

      return errors;
    },
    []
  );

  const validateEventForm = useCallback(
    (event: typeof newEvent) => {
      const eventRules: ValidationRules = {
        name: (value) =>
          !String(value).trim() ? "Tên sự kiện không được để trống" : null,
        coverUrl: (value) => (!value ? "Ảnh bìa sự kiện là bắt buộc" : null),
        location: (value) =>
          !String(value).trim() ? "Địa điểm không được để trống" : null,
        time: (value) => (!value ? "Thời gian sự kiện là bắt buộc" : null),
        type: (value) => (!value ? "Loại sự kiện là bắt buộc" : null),
        introduction: (value) =>
          !String(value).trim()
            ? "Giới thiệu ngắn gọn không được để trống"
            : null,
        description: (value) =>
          !String(value).trim() ? "Mô tả chi tiết không được để trống" : null,
      };
      return validateForm(event, eventRules);
    },
    [validateForm]
  );

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

  // Tối ưu tính toán phí
  const fee = useMemo(() => {
    return ticketData.price > 1_000_000 ? 50000 : 30000;
  }, [ticketData.price]);

  // Tối ưu các handler functions
  const handleCreateOrder = useCallback(async () => {
    setIsCreatingOrder(true);
    try {
      const total = fee * ticketData.quantity;
      const res = await api.post("/orders", {
        ticketId,
        type: "sell_ticket",
        price: total,
        quantity: ticketData.quantity,
      });
      setPaymentIframe(res.data.data.paymentUrl);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      toast.error("Không thể tạo đơn hàng");
    } finally {
      setIsCreatingOrder(false);
    }
  }, [fee, ticketData.quantity, ticketId]);

  const handlePaymentMessage = useCallback((event: MessageEvent) => {
    if (event.origin !== "https://your-payment-domain.com") return;

    const { status } = event.data;

    if (status === "success") {
      setPaymentStatus("success");
      toast.success("Thanh toán thành công!");
      clearTicketDrafts();
    } else if (status === "failed") {
      setPaymentStatus("failed");
      toast.error("Thanh toán thất bại!");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handlePaymentMessage);
    return () => window.removeEventListener("message", handlePaymentMessage);
  }, [handlePaymentMessage]);

  useEffect(() => {
    return () => {
      // Cleanup localStorage
      Object.values(STORAGE_KEYS).forEach((key) =>
        localStorage.removeItem(key)
      );

      // Cleanup image previews
      if (eventImagePreview) URL.revokeObjectURL(eventImagePreview);
      if (ticketImagePreview) URL.revokeObjectURL(ticketImagePreview);
    };
  }, [eventImagePreview, ticketImagePreview]);

  // Thêm hàm xử lý quay lại
  const handleBack = useCallback(() => {
    if (activeTab === "tab2") {
      setActiveTab("tab1");
      setSelectedEventId("");
    } else if (activeTab === "tab3") {
      setActiveTab("tab2");
      setTicketId("");
    }
  }, [activeTab]);

  // Thêm hàm xử lý lưu trạng thái
  const handleSaveState = useCallback(() => {
    const state = {
      selectedEventId,
      ticketData,
      activeTab,
      newEvent,
    };
    saveToStorage("CREATE_TICKET_STATE", state);
    toast.success("Đã lưu trạng thái");
  }, [selectedEventId, ticketData, activeTab, newEvent]);

  // Thêm useEffect để khôi phục trạng thái khi load trang
  useEffect(() => {
    const savedState = getFromStorage("CREATE_TICKET_STATE");
    if (savedState) {
      const {
        selectedEventId: savedEventId,
        ticketData: savedTicketData,
        activeTab: savedTab,
        newEvent: savedEvent,
      } = savedState;

      if (savedEventId) setSelectedEventId(savedEventId);
      if (savedTicketData) setTicketData(savedTicketData);
      if (savedTab) setActiveTab(savedTab);
      if (savedEvent) setNewEvent(savedEvent);
    }
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem("CREATE_TICKET_STATE");
    };
  }, []);

  useEffect(() => {
    const autoSave = debounce(() => {
      handleSaveState();
    }, 1000);

    if (selectedEventId || Object.keys(ticketData).length > 0) {
      autoSave();
    }

    return () => {
      autoSave.cancel();
    };
  }, [selectedEventId, ticketData, handleSaveState]);

  return (
    <RequireAuth>
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
                {selectedEventId && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <MemoizedButton
                        variant="outline"
                        onClick={() => {
                          setSelectedEventId("");
                        }}
                        className="w-full mb-4"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 inline"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Quay lại chọn sự kiện khác
                      </MemoizedButton>
                    </div>

                    <div className="border p-4 rounded-lg bg-gray-50">
                      <h3 className="font-semibold mb-2">Sự kiện đã chọn:</h3>
                      {events.map((event) =>
                        event.id === selectedEventId ? (
                          <div key={event.id} className="space-y-2">
                            <div className="relative w-full h-48 mb-4">
                              <Image
                                src={event.coverUrl}
                                alt={event.name}
                                fill
                                className="object-cover rounded-md"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                              />
                            </div>
                            <p className="font-medium text-lg">{event.name}</p>
                            <p className="text-gray-600">
                              Địa điểm: {event.location}
                            </p>
                            <p className="text-gray-600">
                              Thời gian:{" "}
                              {new Date(event.time).toLocaleString("vi-VN")}
                            </p>
                          </div>
                        ) : null
                      )}
                    </div>

                    <MemoizedButton
                      className="w-full"
                      onClick={() => {
                        setActiveTab("tab2");
                      }}
                    >
                      Tiếp tục với sự kiện đã chọn
                    </MemoizedButton>
                  </div>
                )}

                {!selectedEventId && (
                  <>
                    {isLoadingEvents ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                      </div>
                    ) : (
                      <MemoizedSelect
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
                      </MemoizedSelect>
                    )}

                    <div className="text-center text-sm text-gray-500">
                      -- hoặc --
                    </div>
                    <MemoizedButton
                      variant="outline"
                      onClick={() => setShowCreateEvent(true)}
                      className="w-full"
                    >
                      Tạo mới sự kiện
                    </MemoizedButton>
                  </>
                )}
              </>
            )}

            {showCreateEvent && (
              <div className="space-y-4">
                <MemoizedButton
                  variant="outline"
                  onClick={() => {
                    setShowCreateEvent(false);
                    setSelectedEventId("");
                  }}
                  className="w-full"
                >
                  Quay lại chọn sự kiện
                </MemoizedButton>

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
                            setIsUploading((prev) => ({
                              ...prev,
                              event: true,
                            }));
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
                            setIsUploading((prev) => ({
                              ...prev,
                              event: false,
                            }));
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

                  <MemoizedButton
                    onClick={handleCreateEvent}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Đang xử lý..." : "Tạo sự kiện & Tiếp tục"}
                  </MemoizedButton>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "tab2" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <MemoizedButton
                variant="outline"
                onClick={handleBack}
                className="px-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Quay lại chọn sự kiện
              </MemoizedButton>

              <MemoizedButton
                variant="ghost"
                onClick={handleSaveState}
                className="px-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h1a2 2 0 012 2v7a2 2 0 01-2 2H7a2 2 0 01-2-2V8a2 2 0 012-2h1v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                </svg>
                Lưu trạng thái
              </MemoizedButton>
            </div>

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
                  setTicketData({
                    ...ticketData,
                    price: Number(e.target.value),
                  })
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

              <MemoizedButton
                onClick={handleCreateTicket}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Đang xử lý..." : "Hoàn tất đăng bán"}
              </MemoizedButton>
            </div>
          </div>
        )}

        {activeTab === "tab3" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <MemoizedButton
                variant="outline"
                onClick={handleBack}
                className="px-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Quay lại thông tin vé
              </MemoizedButton>
            </div>

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
                    <MemoizedButton
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
                    </MemoizedButton>
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
    </RequireAuth>
  );
}
