"use client";

import React from "react";
import TicketList from "@/components/Ticket/TicketList";

export default function Tickets() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto p-6">
        <TicketList />
      </main>
    </div>
  );
}
