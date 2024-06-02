"use client";

import { useAccount, useAccountEffect, useSwitchChain } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { CHAIN_ID } from "@/config";
import { Wallet2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";

import { formatAddress } from "@/lib/utils";

interface Props {
  className?: string;
  showIcon?: boolean;
}

export default function ConnectWalletButton({ className, showIcon }: Props) {
  const { open } = useWeb3Modal();
  const { address: account, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  useAccountEffect({
    onConnect: async (data) => {
      if (chainId !== CHAIN_ID) {
        await switchChainAsync({ chainId: CHAIN_ID });
      }
      console.log("Connected:", data);
    },
  });

  return (
    <Button className="bg-purple-900 hover:bg-purple-900/50 rounded-xl border border-white" onClick={() => open()}>
      {!account && showIcon && (
        <span className="hidden max-[768px]:inline-flex">
          <Wallet2 size={20} />
        </span>
      )}
      {account ? (
        <>
          <Wallet2 size={20} /> <p>{formatAddress(account)}</p>
        </>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  );
}
