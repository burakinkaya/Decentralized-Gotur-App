"use client";

import ConnectWalletButton from "../ConnectWalletButton";
import { CHAIN_ID, FOOD_TOKEN_ADDRESS, GOTUR_CONTRACT_ADDRESS } from "@/config";
import GoturAbi from "@/config/abi/erc721Abi";
import { useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";

const Header = () => {
  const { address: account } = useAccount();

  const { data: userBalanceDataFoodToken, isFetched: isFetchedFoodToken } = useReadContract({
    abi: GoturAbi,
    address: GOTUR_CONTRACT_ADDRESS,
    functionName: "balanceOf",
    chainId: CHAIN_ID,
    args: [account as `0x${string}`],
  });

  console.log("userBalanceDataFoodToken", userBalanceDataFoodToken);

  useEffect(() => {
    console.log("isFetchedFoodToken", isFetchedFoodToken);
  }, [userBalanceDataFoodToken]);

  return (
    <header className="container flex w-full items-center justify-between py-6 max-sm:px-2">
      <div className="flex flex-1 gap-16">
        <nav className="flex items-center gap-8 text-white max-lg:hidden"></nav>
      </div>
      <div className="flex justify-end gap-4 items-center">
        {isFetchedFoodToken && <p>Current Balance: {Number(userBalanceDataFoodToken) / 1e18}</p>}
        <ConnectWalletButton />
      </div>
    </header>
  );
};

export default Header;
