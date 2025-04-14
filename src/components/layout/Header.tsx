"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Logo from "../logo/Logo";
import { FaFacebook, FaInstagram, FaUser } from "react-icons/fa";
import SearchBar from "../SearchBar";
import { useEffect, useRef, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { logout, selectAuth } from "@/redux/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { useDispatch } from "react-redux";

const NAV_ITEMS = [
  { href: "/tickets/legal-document", label: "Đăng bán vé" },
  { href: "/tickets", label: "Mua vé" },
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
  const dispatch = useDispatch();
  const [, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthReady } = useAppSelector(selectAuth);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthReady) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  return (
    <header className="w-full bg-[#F6F6F6] dark:bg-gray-900 fixed top-0 z-50">
      <div className="container flex mx-auto items-center justify-between p-2">
        <Logo width={100} height={80} />
        <SearchBar />
        <nav className="flex space-x-10">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-gray-700 font-bold text-sm dark:text-gray-300 hover:text-orange-500 transition duration-150 ease-in-out"
            >
              {item.label}
              {pathname === item.href && (
                <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-orange-500"></span>
              )}
            </Link>
          ))}
        </nav>

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

          {!user ? (
            <Button
              className="flex items-center space-x-2 text-base rounded-3xl border border-black text-black bg-[#F6F6F6] hover:bg-gray-200"
              onClick={() => router.push("/auth/login")}
            >
              <span>Đăng nhập</span>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 px-3 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center gap-2">
                  <FaUser size={20} className="text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.lastName} {user?.firstName || "Người dùng"}
                  </span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/account/my-tickets">Vé đã mua</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/our-tickets">Vé đăng bán</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/profile">Tài khoản của tôi</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => dispatch(logout())}>
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
