import { Roboto } from "next/font/google";
import "@/app/globals.css";

import { ReactNode } from "react";
import ClientLayout from "@/components/ClientLayout";
import { Metadata } from "next";
import AppProviders from "@/components/AppProviders";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Tixflow",
  description: "Mua vé sự kiện online",
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={roboto.className}>
      <body>
        <AppProviders>
          <AuthProvider>
            <ClientLayout>
              {children} <Toaster position="top-right" reverseOrder={false} />
            </ClientLayout>
          </AuthProvider>
        </AppProviders>
      </body>
    </html>
  );
}
