"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TicketManagementList from "@/components/TicketManagement/TicketManagementList";
import api from "@/config/axios";

export default function TicketManagementPage() {
  const [sellingTickets, setSellingTickets] = useState([]);
  const [buyingTickets, setBuyingTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const [sellingRes, buyingRes] = await Promise.all([
          api.get("/self/selling-tickets"),
          api.get("/self/buying-tickets"),
        ]);

        setSellingTickets(sellingRes.data.data);
        setBuyingTickets(buyingRes.data.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen bg-gray-50">
      <Tabs defaultValue="selling" className="w-full">
        <div className="bg-white rounded-xl p-2 mb-6 shadow-sm">
          <TabsList className="w-full grid grid-cols-2 gap-4">
            <TabsTrigger
              value="selling"
              className="w-full data-[state=active]:bg-primary data-[state=active]:text-white py-3 rounded-lg transition-all"
            >
              Vé đang đăng bán
            </TabsTrigger>
            <TabsTrigger
              value="buying"
              className="w-full data-[state=active]:bg-primary data-[state=active]:text-white py-3 rounded-lg transition-all"
            >
              Vé đã mua
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="selling" className="mt-0 outline-none">
          <TicketManagementList tickets={sellingTickets} type="selling" />
        </TabsContent>

        <TabsContent value="buying" className="mt-0 outline-none">
          <TicketManagementList tickets={buyingTickets} type="buying" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
