import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function page() {
  return (
    <div>
      <header className="w-full py-10 px-10">
        <h1 className="[font-family:'Oswald-Bold',Helvetica] font-bold text-[#1a1a1a] text-[110px] tracking-[0] leading-[126px] whitespace-nowrap">
          VÉ ĐÃ MUA
        </h1>
      </header>
      <div className="w-full max-w-[1440px] h-14">
        <div className="relative w-[570px] h-14 ml-auto">
          <div className="flex items-center">
            <div className="relative w-full">
              <Input
                className="h-14 pl-[13px] border-none focus-visible:ring-0 font-normal text-[#414141] text-base font-['Roboto-Regular',Helvetica]"
                type="text"
                placeholder="Tìm vé"
              />
              <div className="absolute w-[528px] h-px bottom-0 left-0 bg-[#1a1a1a]" />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="w-9 h-9 rounded-[18px] border border-solid border-[#1a1a1a] ml-2"
            >
              <Search className="h-4 w-4 text-[#1a1a1a]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
