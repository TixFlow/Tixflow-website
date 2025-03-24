import { Roboto } from "next/font/google";
import "@/app/globals.css";
import { ReactNode } from "react";
import ClientLayout from "@/components/ClientLayout";
import { Metadata } from "next";
import { SearchProvider } from "@/context/searchContext/searchContext";

export const metadata: Metadata = {
  title: "Tixflow",
  description: "Mua vé sự kiện online",
};

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={roboto.className}>
      <body>
        <SearchProvider>
          <ClientLayout>{children}</ClientLayout>
        </SearchProvider>
      </body>
    </html>
  );
}
