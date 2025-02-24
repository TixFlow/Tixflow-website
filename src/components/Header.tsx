"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ShoppingCart, Moon, Sun, User } from "lucide-react";
import { useRouter } from "next/navigation";
import GradientButton from "./ui/ButtonComponent";

export default function Header() {
  const router = useRouter();
  return (
    <header className="w-full bg-[#F6F6F6] dark:bg-gray-900">
      <div className="container flex mx-auto items-center justify-between p-8 my-3">
        <nav className="flex space-x-6">
        <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary">Home</Link>
        <Link href="/concerts" className="text-gray-700 dark:text-gray-300 hover:text-primary">Concerts</Link>
        <Link href="/singers" className="text-gray-700 dark:text-gray-300 hover:text-primary">Singers</Link>
        </nav>
        <div className="flex-shrink-0">
          <img 
            src="/logo.png" 
            alt="TixFlow Logo" 
            className="w-auto mx-auto cursor-pointer" 
            onClick={() => router.push("/")}
          />
        </div>
        <div className="flex items-center space-x-6">
          <ShoppingCart className="w-7 h-7 text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => router.push("/cart")}/>
         
          <GradientButton className="flex items-center space-x-2 rounded-2xl" onClick={() => router.push("/login")}>
            <User className="w-5 h-5" />
            <span>Login/Register</span>
          </GradientButton>
        </div>
      </div>
    </header>
  );
}
