"use client";

import { Button } from "@/components/ui/button";
import { GOTUR_CONTRACT_ADDRESS, CHAIN_ID } from "@/config";
import GoturAbi from "@/config/abi/GoturAbi";
import { Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useWriteContract } from "wagmi";
export default function Store() {
  const { address: account } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [productName, setProductName] = useState<string>("");
  const [productPrice, setProductPrice] = useState<bigint>(BigInt(0));
  const [productQuantity, setProductQuantity] = useState<bigint>(BigInt(0));

  const [toggleAddItemButton, setToggleAddItemButton] = useState<boolean>(false);
  const [toggleButtonText, setToggleButtonText] = useState<string>("Add Item");

  const handleButtonClick = async () => {
    try {
      const result = writeContractAsync({
        abi: GoturAbi,
        address: GOTUR_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "addItem",
        args: [productName, productPrice, productQuantity],
        account,
        chainId: CHAIN_ID,
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddItem = async () => {
    setToggleAddItemButton(!toggleAddItemButton);
    setToggleButtonText(toggleButtonText === "Add Item" ? "Cancel Adding Item" : "Add Item");
  };

  return (
    <main className="bg-[#055c63] flex min-h-screen flex-col  justify-between p-12">
      <div className="mb-32  lg:mb-0 lg:max-w-5xl flex flex-col gap-10 ">
        <h1 className="w-full text-2xl md:text-4xl justify-start">Store Dashboard</h1>
        <button
          className="w-1/3 border border-white/70 rounded-xl p-3 bg-purple-900 hover:bg-purple-900/50"
          onClick={handleAddItem}
        >
          {toggleButtonText}
        </button>
        {account && toggleAddItemButton && (
          <div className="flex flex-col gap-10 w-fit">
            <div className="flex gap-2 items-center">
              <p>Product Name:</p>
              <input
                onChange={(e) => setProductName(e.target.value)}
                className="text-white rounded-xl p-1 text-center bg-purple-900/50"
              ></input>
            </div>
            <div className="flex gap-2 items-center">
              <p>Product Price:</p>
              <input
                type="number"
                onChange={(e) => setProductPrice(BigInt(e.target.value))}
                className="text-white rounded-xl p-1 text-center bg-purple-900/50"
              ></input>
            </div>
            <div className="flex gap-2 items-center">
              <p>Product Quantity:</p>
              <input
                type="number"
                onChange={(e) => setProductQuantity(BigInt(e.target.value))}
                className="text-white rounded-xl p-1 text-center bg-purple-900/50"
              ></input>
            </div>
            <button
              className="w-fit border border-white/70 rounded-xl p-3 bg-purple-900 hover:bg-purple-900/50"
              onClick={handleButtonClick}
            >
              Add Product
            </button>
            <div></div>
          </div>
        )}
      </div>
    </main>
  );
}
