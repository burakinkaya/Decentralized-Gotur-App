"use client";
import "react-toastify/dist/ReactToastify.css";

// ToastProvider Component

import { ToastContainer } from "react-toastify";

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer position="top-right" theme="colored" draggable />
    </>
  );
}
