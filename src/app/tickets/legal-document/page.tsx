"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  LifeBuoy,
  Edit3,
  Wallet,
  PackageOpen,
  HelpCircle,
} from "lucide-react";
import AutoScrollingText from "@/components/autoScrollingText/autoScrollingText";

export default function LegalDocumentPage() {
  return (
    <div className="min-h-screen bg-white">
      <LegalDocumentHeader />
      <ProcessStepsSection />
      <EventScheduleSection />
      <CommitmentSection />
    </div>
  );
}

function LegalDocumentHeader() {
  return (
    <section className="text-center py-10 bg-white">
      <h1 className="text-4xl font-bold uppercase">Điều Khoản</h1>
    </section>
  );
}

function ProcessStepsSection() {
  const steps = [
    {
      title: "Nhập Thông Tin Vé & Sự Kiện",
      description:
        "Cung cấp đầy đủ thông tin vé và sự kiện để người mua tin tưởng.",
      Icon: Edit3,
    },
    {
      title: "Thanh Toán Phí Dịch Vụ",
      description:
        "Mức phí dịch vụ phụ thuộc vào giá vé bạn đưa ra. Thanh toán dễ dàng.",
      Icon: Wallet,
    },
    {
      title: "Chờ Người Mua & Nhận Tiền",
      description:
        "Khi vé được mua, bạn nhận thông báo và tiền bán vé nhanh chóng.",
      Icon: PackageOpen,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {steps.map((step, index) => (
          <div key={index} className="space-y-4">
            <step.Icon size={80} className="mx-auto text-orange-500" />
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EventScheduleSection() {
  return (
    <section className="bg-black text-white py-4">
      <div className="max-w-full text-center">
        <AutoScrollingText
          text="Tixflow - Săn vé ngay - Nhận vé liền tay"
          speed={15}
          className=""
        />
      </div>
    </section>
  );
}

function CommitmentSection() {
  const router = useRouter();
  const handleUnderstood = () => {
    router.push("/tickets/create-ticket");
  };
  const commitments = [
    {
      title: "Bảo Mật Giao Dịch",
      description: "Đảm bảo an toàn thông tin người bán & người mua",
      Icon: ShieldCheck,
    },
    {
      title: "Thanh Toán Đảm Bảo",
      description: "Hỗ trợ nhiều phương thức, nhận tiền nhanh chóng",
      Icon: CreditCard,
    },
    {
      title: "Hỗ Trợ 24/7",
      description: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng",
      Icon: LifeBuoy,
    },
    {
      title: "Chính Sách Hỗ Trợ Sau Bán Hàng",
      description: "Hỗ trợ và giải quyết vấn đề sau khi giao dịch thành công",
      Icon: HelpCircle,
    },
  ];

  return (
    <section className="max-w-full mx-20 md:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="grid grid-cols-2 gap-4">
          {commitments.map((commit, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-3 p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <commit.Icon size={48} className="text-gray-700" />
              <h4 className="text-lg font-semibold">{commit.title}</h4>
              <p className="text-center text-gray-600 text-sm px-2 text-justify">
                {commit.description}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-center text-3xl font-bold mb-6">
            Cam Kết Của Chúng Tôi
          </h2>
          <p className="text-gray-800 text-xl text-justify mx-10">
            Chúng tôi cam kết bảo mật giao dịch, thanh toán nhanh chóng và hỗ
            trợ khách hàng 24/7. Tất cả các dịch vụ của chúng tôi được thiết kế
            để mang lại trải nghiệm tốt nhất cho người dùng.
          </p>
          <div className="flex flex-col items-center justify-center p-4 rounded-lg">
            <button
              onClick={handleUnderstood}
              className="bg-orange-400 text-white px-6 py-3 rounded-full font-semibold hover:brightness-95 transition"
            >
              Đăng Vé Bán
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
