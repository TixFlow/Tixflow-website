import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper, Step } from "@/components/ui/stepper";

const TicketForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventName: "",
    imageUrl: "",
    category: "",
    price: "",
    quantity: "",
    eventDate: "",
    location: "",
    status: "available",
    description: "",
    organizerName: "",
    organizerInfo: "",
    ticketTypes: [],
    paymentInfo: "",
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  return (
    <Card className="max-w-3xl mx-auto p-6">
      <CardHeader>
        <CardTitle>Tạo Vé Sự Kiện</CardTitle>
      </CardHeader>
      <CardContent>
        <Stepper currentStep={step}>
          <Step label="Thông Tin Sự Kiện" />
          <Step label="Thời Gian & Loại Vé" />
          <Step label="Thông Tin Thanh Toán" />
        </Stepper>

        {step === 1 && (
          <div className="space-y-4">
            <Input
              placeholder="Tên sự kiện"
              value={formData.eventName}
              onChange={(e) =>
                setFormData({ ...formData, eventName: e.target.value })
              }
            />
            <Input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.files[0] })
              }
            />
            <Select
              onValueChange={(val) =>
                setFormData({ ...formData, category: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concert">Concert</SelectItem>
                <SelectItem value="conference">Hội thảo</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Giá vé"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Số lượng vé"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
            />
            <Input
              type="date"
              value={formData.eventDate}
              onChange={(e) =>
                setFormData({ ...formData, eventDate: e.target.value })
              }
            />
            <Input
              placeholder="Địa điểm"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <Textarea
              placeholder="Mô tả ngắn"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <Input
              placeholder="Tên ban tổ chức"
              value={formData.organizerName}
              onChange={(e) =>
                setFormData({ ...formData, organizerName: e.target.value })
              }
            />
            <Textarea
              placeholder="Thông tin ban tổ chức"
              value={formData.organizerInfo}
              onChange={(e) =>
                setFormData({ ...formData, organizerInfo: e.target.value })
              }
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thời gian & Loại vé</h3>
            <Input
              placeholder="Loại vé (VIP, Thường, ...)"
              value={formData.ticketTypes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ticketTypes: e.target.value.split(","),
                })
              }
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin thanh toán</h3>
            <Textarea
              placeholder="Thông tin thanh toán"
              value={formData.paymentInfo}
              onChange={(e) =>
                setFormData({ ...formData, paymentInfo: e.target.value })
              }
            />
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && <Button onClick={handleBack}>Quay lại</Button>}
          {step < 3 ? (
            <Button onClick={handleNext}>Tiếp theo</Button>
          ) : (
            <Button>Hoàn tất</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketForm;
