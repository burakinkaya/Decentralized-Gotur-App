"use client";

import ConnectWalletButton from "../ConnectWalletButton";
import { CHAIN_ID, FOOD_TOKEN_ADDRESS, GOTUR_CONTRACT_ADDRESS } from "@/config";
import GoturAbi from "@/config/abi/erc721Abi";
import { useEffect } from "react";
import { erc20Abi } from "viem";
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

  const { data: userBalanceTotal, isFetched: isFetchedTotalBalance } = useReadContract({
    abi: erc20Abi,
    address: FOOD_TOKEN_ADDRESS as `0x${string}`,
    functionName: "balanceOf",
    chainId: CHAIN_ID,
    args: [account as `0x${string}`],
  });

  return (
    <header className="container flex w-full items-center justify-between py-4 max-sm:px-2">
      <div className="flex flex-1 gap-16">
        <nav className="flex items-center gap-8 text-white max-lg:hidden"></nav>
      </div>
      <div className="flex justify-end gap-6 items-center">
        <div className="flex flex-col gap-1">
          {isFetchedTotalBalance && <p>Total Balance: {Number(userBalanceTotal) / 1e18}</p>}
          {isFetchedFoodToken && <p>Gotur Balance: {Number(userBalanceDataFoodToken) / 1e18}</p>}
        </div>

        <ConnectWalletButton />
      </div>
    </header>
  );
};

export default Header;
