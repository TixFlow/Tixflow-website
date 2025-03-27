import Link from "next/link";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import Logo from "../Logo";

const SOCIAL_LINKS = [
  { href: "#", icon: <FaFacebook size={22} />, label: "YouTube" },
  { href: "#", icon: <FaInstagram size={22} />, label: "Instagram" },
];

const FOOTER_LINKS = [
  {
    title: "VỀ CHÚNG TÔI",
    links: [
      { text: "Trang chủ", href: "/" },
      { text: "Giới thiệu về chúng tôi", href: "/about" },
      { text: "Sự kiện sắp tới", href: "/events" },
      { text: "Dịch vụ của chúng tôi", href: "/services" },
    ],
  },
  {
    title: "VỀ KHÁCH HÀNG",
    links: [
      { text: "Dịch vụ", href: "/services" },
      { text: "Phòng trưng bày", href: "/gallery" },
      { text: "FAQ", href: "/faq" },
      { text: "Nghề nghiệp", href: "/careers" },
    ],
  },
];

const CONTACT_INFO = [
  { icon: <Mail size={20} />, text: "info_confab@email.com" },
  { icon: <Phone size={20} />, text: "+19792616659" },
  { icon: <MessageCircle size={20} />, text: "18332691066" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center border-b border-gray-700">
          <Logo width={100} height={100} />
          <div className="flex gap-4">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                className="text-white hover:text-yellow-400"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mt-6">
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-base text-[#FCAE42] mb-4">
                {section.title}
              </h3>
              <ul>
                {section.links.map((link) => (
                  <li
                    key={link.text}
                    className="mb-2 text-ms hover:text-gray-400"
                  >
                    <Link href={link.href}>{link.text}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-semibold text-base text-[#FCAE42] mb-4">
              LIÊN HỆ CHÚNG TÔI
            </h3>
            <ul>
              {CONTACT_INFO.map((info, idx) => (
                <li key={idx} className="flex text-sm items-center gap-2 mb-2">
                  {info.icon} <span>{info.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-[#FCAE42] uppercase mb-2">
              ĐĂNG KÍ TẠI ĐÂY
            </h3>
            <input
              type="email"
              placeholder="Email của bạn"
              className="w-full px-4 py-2 text-sm bg-transparent border-b border-gray-400 text-white focus:outline-none"
            />
            <button className="w-full bg-orange-400 text-black font-semibold py-3 mt-4 rounded-full hover:bg-orange-500 transition">
              Subscribe
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 align-item-center py-8">
          Hệ thống quản lý và trao đổi vé sự kiện hàng đầu Việt Nam Tixflow ©{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
