import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const TicketLoading = () => {
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {[...Array(3)].map((_, index) => (
        <Card key={index} className="w-96 h-28 shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <motion.div
              className="w-20 h-20 bg-gray-200 rounded-md skeleton"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="flex-1 space-y-2">
              <motion.div
                className="h-5 w-3/4 bg-gray-200 rounded skeleton"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="h-4 w-1/2 bg-gray-200 rounded skeleton"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TicketLoading;
