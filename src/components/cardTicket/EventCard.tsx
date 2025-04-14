import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import React from "react";

export default function EventCardSection(): JSX.Element {
  const eventData = {
    title: "BRIGHT NIGHT",
    type: "DJ Party",
    venue: {
      name: "Nebula Groove Lounge",
      address: "177 8th St.",
      city: "New York, NY 10029",
    },
    date: "September 14, 2024",
    time: "6PM to 4AM next day",
    djs: [
      { name: "DJ SPARKL", column: 1 },
      { name: "DJ FRENCHTOUCH", column: 1 },
      { name: "DJ SPINS", column: 2 },
      { name: "VJ VIBRANT", column: 2 },
    ],
    description:
      "Explore the future of art as it lorem ipsum dolor sit amet, consectetur dolor adipiscing elit. Mauris cursus sollicitudin pulvinar. In egestas eu diam sit amet faucibus. Donec pharetra velit eget nibh auctor bibendum. Sed dictum luctus sagittis. Integer eget augue mi. Suspendisse eget felis orci. Aliquam massa leo, semper a arcu eget, efficitur efficitur sem.",
  };

  return (
    <div className="w-full py-2.5 px-px">
      <Card className="w-full bg-[#1a1a1a] rounded-3xl border-none">
        <CardContent className="p-[33px] flex">
          {/* Event Poster */}
          <div className="relative w-[398px] h-[388px] bg-[url(/poster-placeholder-4.svg)] bg-cover bg-center">
            <div className="p-5">
              <Badge className="bg-[#1a1a1a] opacity-90 border border-white text-white rounded-[17px] px-3.5 py-[9px] font-medium">
                {eventData.type}
              </Badge>
            </div>
          </div>

          <div className="ml-[30px] flex-1">
            <h1 className="font-['Oswald-Bold',Helvetica] font-bold text-white text-4xl leading-[44px]">
              {eventData.title}
            </h1>

            <div className="mt-[70px] grid grid-cols-2 gap-x-0">
              <div className="space-y-[22px]">
                <div className="flex">
                  <div className="w-9 h-9 rounded-[18px] border border-solid border-[#fcae42] flex items-center justify-center">
                    <MapPin className="text-[#fcae42] w-[13px] h-[13px]" />
                  </div>
                  <div className="ml-3 font-['Roboto-Regular',Helvetica] font-normal text-white text-base leading-[26px]">
                    {eventData.venue.name}, <br />
                    {eventData.venue.address}
                    <br />
                    {eventData.venue.city}
                  </div>
                </div>

                {/* Date */}
                <div className="flex">
                  <div className="w-9 h-9 rounded-[18px] border border-solid border-[#fcae42] flex items-center justify-center">
                    <Calendar className="text-[#fcae42] w-[13px] h-[13px]" />
                  </div>
                  <div className="ml-3 font-['Roboto-Regular',Helvetica] font-normal text-white text-base leading-[26px]">
                    {eventData.date}
                  </div>
                </div>

                <div className="flex">
                  <div className="w-9 h-9 rounded-[18px] border border-solid border-[#fcae42] flex items-center justify-center">
                    <Clock className="text-[#fcae42] w-[13px] h-[13px]" />
                  </div>
                  <div className="ml-3 font-['Roboto-Regular',Helvetica] font-normal text-white text-base leading-[26px]">
                    {eventData.time}
                  </div>
                </div>

                <div className="flex space-x-6 mt-[57px]">
                  <Button className="w-[188px] h-[34px] bg-[#fcae42] text-[#1a1a1a] rounded-[26px] font-['Oswald-Medium',Helvetica] font-medium text-base hover:bg-[#e09a3b]">
                    Đang xử lý
                  </Button>
                  <Button
                    variant="outline"
                    className="w-[188px] h-[34px] text-[#fcae42] border-[#fcae42] rounded-[26px] font-['Oswald-Medium',Helvetica] font-medium text-base hover:bg-[#fcae42]/10"
                  >
                    More details
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-[35px]">
                <div>
                  <div className="font-['Roboto-Medium',Helvetica] font-medium text-[#d7d7d7] text-base leading-[19px]">
                    Dj&apos;s:
                  </div>
                  <div className="flex mt-[22px]">
                    <div className="w-[178px] font-['Oswald-Bold',Helvetica] font-bold text-[#fcae42] text-lg leading-[30px]">
                      {eventData.djs
                        .filter((dj) => dj.column === 1)
                        .map((dj, index) => (
                          <div key={index}> •&nbsp;&nbsp;{dj.name}</div>
                        ))}
                    </div>
                    <div className="w-[183px] font-['Oswald-Bold',Helvetica] font-bold text-[#fcae42] text-lg leading-[30px]">
                      {eventData.djs
                        .filter((dj) => dj.column === 2)
                        .map((dj, index) => (
                          <div key={index}> •&nbsp;&nbsp;{dj.name}</div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="font-['Roboto-Regular',Helvetica] font-normal text-[#d7d7d7] text-base leading-[26px]">
                  {eventData.description}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
