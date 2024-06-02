"use client";

import { Truck } from "lucide-react";
import { useAccount } from "wagmi";
export default function Courier() {
  const { address: account } = useAccount();

  return (
    <main className="bg-[#055c63] flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mb-32 text-center lg:mb-0 lg:w-full items-center lg:max-w-5xl flex flex-col gap-20">
        <h1 className="w-full text-2xl md:text-4xl">Courier Dashboard</h1>

        {account && (
          <div className="flex flex-col gap-10">
            <p className="text-xl md:text-2xl text-left">I'm a Courier</p>
            <div className="flex gap-4 w-full"></div>
            <div className="flex flex-row gap-4">
              <Truck className="sm:w-24 sm:h-24 w-12 h-12" />
              <Truck className="sm:w-24 sm:h-24 w-12 h-12" />
              <Truck className="sm:w-24 sm:h-24 w-12 h-12" />
              <Truck className="sm:w-24 sm:h-24 w-12 h-12" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
