"use client";

import { State } from "wagmi";
import ToastProvider from "./Toast";
import Web3ModalProvider from "./Web3Modal";

interface Props {
  children: React.ReactNode;
  initialState?: State;
}

export default function Providers({ children, initialState }: Props) {
  return (
    <Web3ModalProvider initialState={initialState}>
      <ToastProvider>{children}</ToastProvider>
    </Web3ModalProvider>
  );
}
