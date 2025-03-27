"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import "./CreateTicketPage.css";

const TICKET_CATEGORIES = [
  "Nhạc sống",
  "Sân khấu và nghệ thuật",
  "Thể thao",
  "Khác",
];

export default function CreateTicketPage() {
  const [activeTab, setActiveTab] = useState("tab1");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    images: [] as File[],
    eventName: "",
    location: "",
    city: "",
    district: "",
    ward: "",
    address: "",
    category: "",
    intro: "",
    detail: "",
    terms: "",
  });

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validImages: File[] = [];

    files.forEach((file) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width / img.height === 1280 / 720) {
          validImages.push(file);
          setFormData((prev) => ({ ...prev, images: validImages }));
        } else {
          toast.error("Ảnh phải đúng tỉ lệ 1280:720");
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  };

  const handleNextTab = () => {
    const requiredFields = {
      images: "Hình ảnh sự kiện",
      eventName: "Tên sự kiện",
      location: "Địa điểm",
      city: "Tỉnh/Thành phố",
      district: "Quận/Huyện",
      category: "Thể loại sự kiện",
      intro: "Giới thiệu sự kiện",
      detail: "Chi tiết sự kiện",
      terms: "Điều khoản và điều kiện",
    };

    const newErrors: { [key: string]: string } = {};

    Object.entries(requiredFields).forEach(([key, label]) => {
      const value = formData[key as keyof typeof formData];
      if (Array.isArray(value)) {
        if (value.length === 0) newErrors[key] = `Vui lòng nhập ${label}`;
      } else {
        if (!value?.toString().trim())
          newErrors[key] = `Vui lòng nhập ${label}`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setActiveTab("tab2");
  };

  return (
    <div className="ticket-container">
      <h1 className="ticket-title">Đăng bán vé</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="ticket-tabs">
          <TabsTrigger value="tab1">1. Thông tin sự kiện</TabsTrigger>
          <TabsTrigger value="tab2" disabled={activeTab === "tab1"}>
            2. Thời gian / Loại vé
          </TabsTrigger>
          <TabsTrigger value="tab3" disabled={activeTab !== "tab2"}>
            3. Thông tin thanh toán
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tab1">
          <div className="form-section">
            <div className="form-group">
              <Label>
                <span className="required">*</span>Hình ảnh sự kiện (tỉ lệ
                1280x720):
              </Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div className="form-group">
              <Label>
                <span className="required">*</span>Tên sự kiện:
              </Label>
              <Input
                placeholder="Vui lòng nhập tên sự kiện"
                value={formData.eventName}
                onChange={(e) => {
                  handleInputChange("eventName", e.target.value);
                  setErrors((prev) => ({ ...prev, eventName: "" }));
                }}
              />
              {errors.eventName && (
                <p className="form-error">{errors.eventName}</p>
              )}
            </div>

            <div className="form-group">
              <Label>
                <span className="required">*</span>Địa điểm:
              </Label>
              <Input
                placeholder="Tên địa điểm"
                value={formData.location}
                onChange={(e) => {
                  handleInputChange("location", e.target.value);
                  setErrors((prev) => ({ ...prev, location: "" }));
                }}
              />
              {errors.eventName && (
                <p className="form-error">{errors.location}</p>
              )}
              <div className="grid-2x2">
                <Input
                  placeholder="Tỉnh/Thành phố"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
                <Input
                  placeholder="Quận/Huyện"
                  value={formData.district}
                  onChange={(e) =>
                    handleInputChange("district", e.target.value)
                  }
                />
                <Input
                  placeholder="Phường/Xã"
                  value={formData.ward}
                  onChange={(e) => handleInputChange("ward", e.target.value)}
                />
                <Input
                  placeholder="Số nhà/Đường"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <Label>
                <span className="required">*</span>Thể loại sự kiện:
              </Label>
              <Select
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thể loại" />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="form-group">
              <Label>
                <span className="required">*</span>Giới thiệu sự kiện:
              </Label>
              <Textarea
                placeholder="Vui lòng nhập giới thiệu về sự kiện"
                value={formData.intro}
                onChange={(e) => handleInputChange("intro", e.target.value)}
              />
            </div>

            <div className="form-group">
              <Label>
                <span className="required">*</span>Chi tiết sự kiện:
              </Label>
              <Textarea
                value={formData.detail}
                onChange={(e) => handleInputChange("detail", e.target.value)}
              />
            </div>

            <div className="form-group">
              <Label>
                <span className="required">*</span>Điều khoản và điều kiện:
              </Label>
              <Textarea
                value={formData.terms}
                onChange={(e) => handleInputChange("terms", e.target.value)}
              />
            </div>

            <div className="form-actions">
              <Button onClick={handleNextTab}>Tiếp theo</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tab2">
          <div className="form-section">
            <p className="text-muted">
              Nội dung Tab 2: Thời gian và loại vé sẽ được bổ sung...
            </p>
            <div className="form-actions">
              <Button onClick={() => setActiveTab("tab3")}>Tiếp theo</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tab3">
          <div className="form-section">
            <p className="text-muted">
              Nội dung Tab 3: Thông tin thanh toán sẽ được bổ sung...
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
