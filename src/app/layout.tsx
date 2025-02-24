import Footer from "@/components/Footer";
import Header from "@/components/Header";

import "@/styles/globals.css";
import { ReactNode } from "react";

import { Inter } from "next/font/google";


export const metadata = {
  title: "Tixflow",
  description: "A concert ticket booking platform",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
