"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const authPages = ["/login", "/register", "/verify"];
  const isAuthPage = authPages.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Header />}
      <main key={pathname} className="flex-1">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
