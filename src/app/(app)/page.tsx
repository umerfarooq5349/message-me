"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import messages from "@/lib/dummyMessages.json";

export default function Home() {
  return (
    <main className="text-[#D4BEE4] flex flex-col items-center justify-between max-h-screen px-4 md:px-24 py-12 ">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-[#ecb365]">
          Let&#39;s Become Anonymous
        </h1>
        <p className="mt-3 md:mt-4 text-base text-[#D4A373]">
          Explore Be Anonymous - Where you remain hidden
        </p>
      </section>

      <Carousel
        className="w-full max-w-xs  rounded-lg overflow-hidden "
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 2000 })]}
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-2">
                <Card className="flex aspect-square flex-col items-center border-2 border-[#ecb365] justify-center p-6 bg-[#3B1E54] rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 ease-in-out bg-gradient-to-br from-[#3B1E54] to-[#387478] ">
                  <CardHeader className="text-2xl md:text-3xl font-bold text-[#D4A373]">
                    {message.title}
                  </CardHeader>
                  <CardContent>
                    <span className="text-xl md:text-2xl font-semibold text-[#ecb365]">
                      {message.content}
                    </span>
                  </CardContent>
                  <CardFooter className="text-lg md:text-xl font-normal text-[#D4BEE4] mt-2">
                    {message.received}
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-[#D4A373] hover:text-white" />
        <CarouselNext className="text-[#D4A373] hover:text-white" />
      </Carousel>

      {/* <footer className="mt-8 text-center text-[#D4A373] font-light text-sm md:text-base">
        © 2024 - All rights reserved
      </footer> */}
    </main>
  );
}
