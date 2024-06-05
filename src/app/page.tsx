"use client";
import ConnectWalletButton from "@/components/ConnectWalletButton";

import {
  CHAIN_ID,
  COURIER_TOKEN_ADDRESS,
  CUSTOMER_TOKEN_ADDRESS,
  DEPLOYER_WALLET,
  FOOD_TOKEN_ADDRESS,
  GOTUR_CONTRACT_ADDRESS,
  STORE_TOKEN_ADDRESS,
} from "@/config";
import FoodTokenAbi from "@/config/abi/FoodTokenAbi";
import GoturAbi from "@/config/abi/GoturAbi";
import erc721Abi from "@/config/abi/erc721Abi";

import { Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { erc20Abi } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
export default function Home() {
  const [userType, setUserType] = useState("");

  const [depositTokens, setDepositTokens] = useState(0);

  const [withdrawTokens, setWithdrawTokens] = useState(0);

  const { address: account } = useAccount();

  const [mintQuantity, setMintQuantity] = useState(0);
  const [mintAddress, setMintAddress] = useState("0x" as `0x${string}`);

  const { writeContractAsync } = useWriteContract();

  const createToastMessage = (explorerUrl: string) => {
    return (
      <span>
        Transaction submitted successfully.{" "}
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
          Transaction Hash
        </a>
      </span>
    );
  };

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/^0+/, "");
    setDepositTokens(cleanedValue === "" ? 0 : Number(cleanedValue));
  };

  const handleWithdrawChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/^0+/, "");
    setWithdrawTokens(cleanedValue === "" ? 0 : Number(cleanedValue));
  };

  const { data: userBalanceDataCustomer, isFetched: isFetchedCustomer } = useReadContract({
    abi: erc721Abi,
    address: CUSTOMER_TOKEN_ADDRESS,
    functionName: "balanceOf",
    chainId: CHAIN_ID,
    args: [account as `0x${string}`],
  });

  const { data: userBalanceDataCourier, isFetched: isFetchedCourier } = useReadContract({
    abi: erc721Abi,
    address: COURIER_TOKEN_ADDRESS,
    functionName: "balanceOf",
    chainId: CHAIN_ID,
    args: [account as `0x${string}`],
  });

  const { data: userBalanceDataStore, isFetched: isFetchedStore } = useReadContract({
    abi: erc721Abi,
    address: STORE_TOKEN_ADDRESS,
    functionName: "balanceOf",
    chainId: CHAIN_ID,
    args: [account as `0x${string}`],
  });

  const userBalanceCustomer = Number(userBalanceDataCustomer);
  const userBalanceCourier = Number(userBalanceDataCourier);
  const userBalanceStore = Number(userBalanceDataStore);

  useEffect(() => {
    if (isFetchedCustomer && isFetchedCourier && isFetchedStore) {
      if (userBalanceCustomer > 0) {
        setUserType("customer");
      } else if (userBalanceCourier > 0) {
        setUserType("courier");
      } else if (userBalanceStore > 0) {
        setUserType("store");
      } else {
        setUserType("none");
      }
    }
  }, [userBalanceCustomer, isFetchedCustomer, isFetchedCourier, isFetchedStore]);

  const handleButtonClick = async (functionName: string, args?: any) => {
    try {
      const result = await writeContractAsync({
        abi: GoturAbi,
        address: GOTUR_CONTRACT_ADDRESS as `0x${string}`,
        //@ts-ignore
        functionName,
        args,
        account,
        chainId: CHAIN_ID,
      });
      const explorerUrl = `https://amoy.polygonscan.com/tx/${result}`;

      toast.success(createToastMessage(explorerUrl));
    } catch (e: any) {
      toast.error(e || "An unknown error occurred.");
    }
  };

  const handleDepositTokens = async () => {
    try {
      const approveResult = await writeContractAsync({
        abi: erc20Abi,
        address: FOOD_TOKEN_ADDRESS as `0x${string}`,
        functionName: "approve",
        args: [GOTUR_CONTRACT_ADDRESS, BigInt(depositTokens * 1e18)],
        account,
        chainId: CHAIN_ID,
      });
      const explorerUrlapprove = `https://amoy.polygonscan.com/tx/${approveResult}`;

      toast.success(createToastMessage(explorerUrlapprove));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const depositResult = await writeContractAsync({
        abi: GoturAbi,
        address: GOTUR_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "deposit",
        args: [BigInt(depositTokens)],
        account,
        chainId: CHAIN_ID,
      });
      const explorerUrldeposit = `https://amoy.polygonscan.com/tx/${depositResult}`;

      toast.success(createToastMessage(explorerUrldeposit));
    } catch (e: any) {
      toast.error(e || "An unknown error occurred.");
    }
  };

  const handleWithdrawTokens = async () => {
    try {
      const withdrawalResult = await writeContractAsync({
        abi: GoturAbi,
        address: GOTUR_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "withdraw",
        args: [BigInt(withdrawTokens)],
        account,
        chainId: CHAIN_ID,
      });
      const explorerUrl = `https://amoy.polygonscan.com/tx/${withdrawalResult}`;

      toast.success(createToastMessage(explorerUrl));
    } catch (e: any) {
      toast.error(e || "An unknown error occurred.");
    }
  };

  const handleMintFoodTokens = async (to: string, amount: number) => {
    try {
      const result = await writeContractAsync({
        abi: FoodTokenAbi,
        address: FOOD_TOKEN_ADDRESS as `0x${string}`,
        functionName: "mint",
        args: [to as `0x${string}`, BigInt(amount)],
        account,
        chainId: CHAIN_ID,
      });
      const explorerUrl = `https://amoy.polygonscan.com/tx/${result}`;

      toast.success(createToastMessage(explorerUrl));
    } catch (e: any) {
      toast.error(e || "An unknown error occurred.");
    }
  };

  return (
    <main className="bg-[#8f7efc] flex min-h-screen flex-col items-center justify-between p-12">
      <div className="mb-16 text-center lg:mb-0 lg:w-full items-center lg:max-w-5xl flex flex-col gap-6">
        <h1 className="w-full text-2xl md:text-4xl">Welcome to Gotur, a Decentralized Delivery System</h1>
        {!account && (
          <div className="flex flex-col gap-10">
            <p className="text-xl md:text-2xl text-left">Connect your wallet first</p>
            <ConnectWalletButton />
          </div>
        )}
        {account && (
          <div className="flex flex-col gap-5 w-full items-center justify-center border-b border-white/70 pb-6">
            <div className="flex flex-col gap-2">
              <p>Remember, you need to deposit Food Tokens (FTK) to be a courier, store or buy products as customer!</p>
            </div>
            <div className="flex flex-row gap-4">
              <input
                type="number"
                value={depositTokens}
                onChange={handleDepositChange}
                className="text-white rounded-xl p-1 text-center bg-purple-900/50"
              ></input>
              <button
                className="w-fit border border-white/70 rounded-xl p-3 bg-purple-900 hover:bg-purple-900/50"
                onClick={() => handleDepositTokens()}
              >
                Deposit Food Tokens
              </button>
            </div>
            <div className="flex flex-row gap-4">
              <input
                type="number"
                value={withdrawTokens}
                onChange={handleWithdrawChange}
                className="text-white rounded-xl p-1 text-center bg-purple-900/50"
              ></input>
              <button
                className="w-fit border border-white/70 rounded-xl p-3 bg-purple-900 hover:bg-purple-900/50"
                onClick={() => handleWithdrawTokens()}
              >
                Withdraw Food Tokens
              </button>
            </div>
            {account === DEPLOYER_WALLET && (
              <div className="flex flex-row gap-6 w-fit items-center">
                <div className="flex gap-4 flex-row">
                  <div className="flex flex-row items-center gap-2">
                    <p>Quantity:</p>
                    <input
                      type="number"
                      min={1}
                      value={mintQuantity}
                      onChange={(e) => setMintQuantity(Number(e.target.value))}
                      className="text-white rounded-xl p-1 text-center bg-purple-900/50"
                    ></input>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <p>Address:</p>
                    <input
                      type="string"
                      value={mintAddress}
                      onChange={(e) => setMintAddress(e.target.value as `0x${string}`)}
                      className="text-white rounded-xl p-1 text-center bg-purple-900/50"
                    ></input>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleMintFoodTokens(mintAddress, mintQuantity);
                    setMintAddress("0x");
                    setMintQuantity(0);
                  }}
                  className="h-1/2 border border-white/70 rounded-xl p-3 bg-purple-900 hover:bg-purple-900/50"
                >
                  Mint Food Tokens
                </button>
              </div>
            )}
          </div>
        )}

        {account && userType === "none" && (
          <div className="flex flex-col gap-4">
            <p className="text-xl md:text-2xl text-left">I'm a:</p>
            <div className="flex gap-4 w-full">
              <button
                className="w-1/3 border border-white/70 rounded-xl p-3 bg-purple-900 hover:bg-purple-900/50"
                onClick={() => handleButtonClick("makeCustomer")}
              >
                Customer
              </button>
              <button
                className="w-1/3 border border-white/70 rounded-xl p-3 bg-purple-900 hover:bg-purple-900/50"
                onClick={() => handleButtonClick("makeCourier")}
              >
                Courier
              </button>
              <button
                className="w-1/3 border border-white/70 rounded-xl p-3 bg-purple-900 hover:bg-purple-900/50"
                onClick={() => handleButtonClick("makeStore", ["store1"])}
              >
                Store
              </button>
            </div>
            <div className="flex flex-row gap-4">
              <Truck className="sm:w-24 sm:h-24 w-12 h-12" />
              <Truck className="sm:w-24 sm:h-24 w-12 h-12" />
              <Truck className="sm:w-24 sm:h-24 w-12 h-12" />
              <Truck className="sm:w-24 sm:h-24 w-12 h-12" />
            </div>
          </div>
        )}

        {account && userType !== "none" && (
          <button
            className="w-1/3 border border-white/70 rounded-xl p-3 bg-purple-900 hover:bg-purple-900/50"
            onClick={() => (window.location.href = `/${userType}`)}
          >
            Go to Dashboard
          </button>
        )}
      </div>
    </main>
  );
}
