"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Logo from "./logo/Logo";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import SearchBar from "./SearchBar";

const NAV_ITEMS = [
  { href: "/tickets", label: "Đăng bán vé" },
  { href: "/buy-tickets", label: "Mua vé" },
  { href: "/blogs", label: "Blogs sự kiện" },
];

const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/profile.php?id=61573137565358",
    icon: <FaFacebook size={22} />,
    label: "Facebook",
  },
  {
    href: "https://www.instagram.com/tixflow_official/",
    icon: <FaInstagram size={22} />,
    label: "Instagram",
  },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="w-full bg-[#F6F6F6] dark:bg-gray-900">
      <div className="container flex mx-auto items-center justify-between p-2 my-3">
        <Logo width={200} height={160} />

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
        <SearchBar />

        <div className="flex items-center space-x-6">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-orange-500"
            >
              {link.icon}
            </a>
          ))}

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
