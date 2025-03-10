"use client";

import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import Image from "next/image";
import GradientButton from "./ui/ButtonComponent";
import { Button } from "./ui/button";
import Logo from "./Logo";

const NAV_ITEMS = [
  { href: "/", label: "Trang chủ" },
  { href: "/blogs", label: "Blogs sự kiện" },
  { href: "/tickets", label: "Bán vé" },
  { href: "/buy-tickets", label: "Mua vé" },
  { href: "/our-tickets", label: "Vé chúng tôi" },
];

const Fb = "https://www.facebook.com/profile.php?id=61573137565358";
const Ig = "https://www.instagram.com/tixflow_official/";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="w-full bg-[#F6F6F6] dark:bg-gray-900">
      <div className="container flex mx-auto items-center justify-between p-5 my-3">
        <Logo width={100} height={30} />
        <nav className="flex space-x-10">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-gray-700 dark:text-gray-300 hover:text-orange-500 transition duration-150 ease-in-out"
            >
              {item.label}
              {pathname === item.href && (
                <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-orange-500"></span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-6">
          <Facebook
            className="w-7 h-7 text-gray-700 dark:text-gray-300 cursor-pointer"
            onClick={() => window.open(Fb, "_blank")}
          />
          <Instagram
            className="w-7 h-7 text-gray-700 dark:text-gray-300 cursor-pointer"
            onClick={() => window.open(Ig, "_blank")}
          />

          <Button
            className="flex items-center space-x-2 text-base rounded-3xl border border-black text-black bg-[#F6F6F6] hover:bg-gray-200"
            onClick={() => router.push("/auth/login")}
          >
            <span>Đăng nhập</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
