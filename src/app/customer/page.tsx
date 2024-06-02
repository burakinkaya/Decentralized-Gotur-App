"use client";

import { CHAIN_ID, GOTUR_CONTRACT_ADDRESS } from "@/config";
import GoturAbi from "@/config/abi/GoturAbi";
import { formatAddress } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import Link from "next/link";

type Store = {
  name: string;
  owner: `0x${string}`;
};

type Order = {
  orderId: number;
  customer: `0x${string}`;
  store: `0x${string}`;
  courier: `0x${string}`;
  totalPrice: bigint;
  courierFee: bigint;
  itemIds: number[];
  quantities: number[];
  courierFound: boolean;
  storeApproved: boolean;
  courierPickedUp: boolean;
  isDeliveredByCourier: boolean;
  isReceivedByCustomer: boolean;
  isCanceled: boolean;
  isComplete: boolean;
  mapAddress: string;
  issuetime: number;
  storeApproveTime: number;
  status?: string;
  cancelStatus: number; // Varsayılan değeri olmayan bir number
};

export default function Customer() {
  const { address: account } = useAccount();

  const { writeContractAsync } = useWriteContract();

  const [storeData, setStoreData] = useState<Store[]>([]);

  const [orderData, setOrderData] = useState<Order[]>([]);

  const {
    data: storesData,
    isFetched: isStoresFetched,
    error: isStoresError,
  } = useReadContract({
    abi: GoturAbi,
    address: GOTUR_CONTRACT_ADDRESS,
    functionName: "getStores",
    chainId: CHAIN_ID,
    account,
  });

  const {
    data: ordersData,
    isFetched: isOrdersFetched,
    error: isOrdersError,
  } = useReadContract({
    abi: GoturAbi,
    address: GOTUR_CONTRACT_ADDRESS,
    functionName: "getActiveOrders",
    chainId: CHAIN_ID,
    account,
  });

  useEffect(() => {
    if (isStoresFetched) {
      if (storesData) {
        setStoreData(storesData as Store[]);
      } else {
        console.log("No data returned from contract.");
      }
    }

    if (isStoresError) {
      console.error("Error reading contract:", isStoresError);
    }
  }, [isStoresFetched, storesData, isStoresError]);

  const handleCancelOrder = async (orderId: bigint, cancelStatus: number) => {
    try {
      const functionName = cancelStatus === 2 ? "cancelOrderByTime" : ("cancelOrder" as const);

      const result = await writeContractAsync({
        abi: GoturAbi,
        address: GOTUR_CONTRACT_ADDRESS as `0x${string}`,
        functionName: functionName,
        args: [orderId],
        account,
        chainId: CHAIN_ID,
      });

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isOrdersFetched) {
      if (ordersData) {
        const mutableOrdersData: Order[] = (ordersData as any).map((order: any) => {
          const thirtySecondsInMilliseconds = 30 * 1000;
          const currentTime = Date.now();
          const orderIssueTime = Number(order.issuetime) * 1000;

          let status = "";
          let cancelStatus = 0;

          if (!order.storeApproved) {
            status = "Waiting for Store to Approve your Order";
            cancelStatus = 1;
          } else if (currentTime - orderIssueTime > thirtySecondsInMilliseconds) {
            status = "Order approved but over 30 minutes have passed";
            cancelStatus = 2;
          } else if (!order.courierFound) {
            status = "Waiting for Courier to Find your Order";
          } else if (!order.courierPickedUp) {
            status = "Waiting for Courier to Pick Up your Order";
          } else {
            status = "Courier is on the way to your location";
          }

          return {
            ...order,
            orderId: Number(order.orderId),
            totalPrice: BigInt(order.totalPrice),
            courierFee: BigInt(order.courierFee),
            itemIds: order.itemIds.map((id: any) => Number(id)),
            quantities: order.quantitities.map((quantity: any) => Number(quantity)),
            issuetime: Number(order.issuetime),
            storeApproveTime: Number(order.storeApproveTime),
            status,
            cancelStatus,
          };
        });

        setOrderData(mutableOrdersData);
      } else {
        console.log("There is no order returned from contract.");
      }
    }

    if (isOrdersError) {
      console.error("Error reading contract:", isOrdersError);
    }
  }, [isOrdersFetched, ordersData, isOrdersError, account]);

  return (
    <main className="bg-[#055c63] flex min-h-screen flex-col items-center justify-between p-12">
      <div className="text-center lg:w-full items-center lg:max-w-5xl flex flex-col gap-10">
        <h1 className="w-full text-2xl md:text-4xl text-left">Customer Dashboard</h1>
        {account && isStoresFetched && (
          <div className="grid grid-cols-4 gap-10 rounded-xl w-full justify-between">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <p className="w-full text-2xl text-left text-white font-semibold">Stores</p>
                {storeData.map(
                  (store) =>
                    store.name && (
                      <Link key={store.owner} href={`/customer/stores/${store.owner}`}>
                        <div className="flex flex-col border border-white p-10 rounded-xl gap-2 w-full cursor-pointer">
                          <p>{store.name}</p>
                          <p>{formatAddress(store.owner)}</p>
                        </div>
                      </Link>
                    )
                )}
              </div>
            </div>
          </div>
        )}
        {account && isOrdersFetched && (
          <div className="w-full">
            <p className="w-full text-2xl text-left mb-4 text-white font-semibold">Active Orders</p>
            {orderData.map(
              (order) =>
                order.customer === account && (
                  <div
                    key={order.orderId}
                    className="flex flex-col border border-white p-4 rounded-xl gap-2 w-full mb-4"
                  >
                    <p>Order ID: {order.orderId}</p>
                    <p>Store Name: {formatAddress(order.store)}</p>
                    {order.courier !== "0x0000000000000000000000000000000000000000" && order.courier && (
                      <p>Courier: {formatAddress(order.courier)}</p>
                    )}
                    <p>Total Price: {order.totalPrice.toString()}</p>
                    <p>Courier Fee: {order.courierFee.toString()}</p>
                    <p>Items: {order.itemIds.join(", ")}</p>
                    <p>Quantities: {order.quantities.join(", ")}</p>
                    <p>Map Address: {order.mapAddress}</p>
                    <p>Issue Time: {new Date(order.issuetime * 1000).toLocaleString()}</p>
                    {order.storeApproveTime !== 0 && (
                      <p>Store Approve Time: {new Date(order.storeApproveTime * 1000).toLocaleString()}</p>
                    )}
                    <p>Order Status: {order.status}</p>
                    <button
                      onClick={() =>
                        order.cancelStatus !== undefined && handleCancelOrder(BigInt(order.orderId), order.cancelStatus)
                      }
                      className="w-fit justify-center self-center border mt-2 border-white/70 rounded-xl p-3 bg-red-900 hover:bg-red-900/50"
                    >
                      Cancel Order
                    </button>
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </main>
  );
}
