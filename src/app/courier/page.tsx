"use client";

import ConnectWalletButton from "@/components/ConnectWalletButton";
import { CHAIN_ID, GOTUR_CONTRACT_ADDRESS } from "@/config";
import GoturAbi from "@/config/abi/GoturAbi";
import { formatAddress } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

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
  iterationStatus: number;
  buttonStatus: string;
};
export default function Courier() {
  const { address: account } = useAccount();

  const { writeContractAsync } = useWriteContract();

  const [orderData, setOrderData] = useState<Order[]>([]);

  const [myOrderData, setMyOrderData] = useState<Order[]>([]);

  const {
    data: ordersData,
    isFetched: isOrdersFetched,
    error: isOrdersError,
  } = useReadContract({
    abi: GoturAbi,
    address: GOTUR_CONTRACT_ADDRESS,
    functionName: "getServeableOrders",
    chainId: CHAIN_ID,
    account,
  });

  const {
    data: myOrdersData,
    isFetched: isMyOrdersFetched,
    error: isMyOrdersError,
  } = useReadContract({
    abi: GoturAbi,
    address: GOTUR_CONTRACT_ADDRESS,
    functionName: "getActiveOrders",
    chainId: CHAIN_ID,
    account,
  });

  const handleOrderClick = async (orderId: bigint, iterationStatus: number) => {
    try {
      const functionName =
        iterationStatus === 1
          ? "takeOrderAsCourier"
          : iterationStatus === 2
          ? "markOrderPickedUp"
          : "markOrderDelivered";

      console.log("iteration status is", iterationStatus);

      console.log("function name is", functionName);

      console.log("order id is", orderId);

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
        console.log("orders data", ordersData);
        const mutableOrdersData: Order[] = (ordersData as any).map((order: any) => {
          const thirtySecondsInMilliseconds = 30 * 1000;
          const currentTime = Date.now();
          const orderIssueTime = Number(order.issuetime) * 1000;

          let status = "";
          let iterationStatus = 0;
          let buttonStatus = "";

          if (order.storeApproved && !order.courierFound) {
            status = "Waiting for Courier to Find the Order.";
            if (currentTime - orderIssueTime > thirtySecondsInMilliseconds) {
              status += " Since over 30 minutes have passed, Customer may cancel the order";
            }
            iterationStatus = 1;
            buttonStatus = "Register to Order";
          } else if (order.courierFound && order.courier === account && !order.courierPickedUp) {
            status = "You are registered to Order, pick the Order and deliver";
            iterationStatus = 2;
            buttonStatus = "Pick Order";
            console.log("aaa");
          } else if (order.courierFound && order.courier === account && order.courierPickedUp) {
            status = "You are on your way to the Customer";
            iterationStatus = 3;
            buttonStatus = "Set Order as Delivered";
          } else {
            if (!order.isReceivedByCustomer) {
              status = "Waiting for Customer to approve delivery";
            } else {
              status = "Order Completed";
            }
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
            iterationStatus,
            buttonStatus,
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

  useEffect(() => {
    if (isMyOrdersFetched) {
      if (myOrdersData) {
        console.log("my orders data", myOrdersData);
        const mutableOrdersData: Order[] = (myOrdersData as any).map((order: any) => {
          const thirtySecondsInMilliseconds = 30 * 1000;
          const currentTime = Date.now();
          const orderIssueTime = Number(order.issuetime) * 1000;

          let status = "";
          let iterationStatus = 0;
          let buttonStatus = "";

          if (order.storeApproved && !order.courierFound) {
            status = "Waiting for Courier to Find the Order.";
            if (currentTime - orderIssueTime > thirtySecondsInMilliseconds) {
              status += " Since over 30 minutes have passed, Customer may cancel the order";
            }
            iterationStatus = 1;
            buttonStatus = "Register to Order";
          } else if (order.courierFound && order.courier === account && !order.courierPickedUp) {
            status = "You are registered to Order, pick the Order and deliver";
            iterationStatus = 2;
            buttonStatus = "Pick Order";
            console.log("aaa");
          } else if (
            order.courierFound &&
            order.courier === account &&
            order.courierPickedUp &&
            !order.isDeliveredByCourier
          ) {
            status = "You are on your way to the Customer";
            iterationStatus = 3;
            buttonStatus = "Set Order as Delivered";
            console.log("bbb");
          } else {
            console.log("ccc");
            if (!order.isReceivedByCustomer) {
              status = "Waiting for Customer to approve delivery";
            } else {
              status = "Order Completed";
            }
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
            iterationStatus,
            buttonStatus,
          };
        });

        setMyOrderData(mutableOrdersData);
      } else {
        console.log("There is no order returned from contract.");
      }
    }

    if (isMyOrdersError) {
      console.error("Error reading contract:", isMyOrdersError);
    }
  }, [isMyOrdersFetched, myOrdersData, isMyOrdersError, account]);

  return (
    <main className="bg-[#8f7efc] flex min-h-screen flex-col  justify-between p-12">
      {account && (
        <div className="mb-32  lg:mb-0  flex flex-col gap-10 ">
          <div className="flex flex-row justify-between items-center">
            <h1 className="w-full text-2xl md:text-4xl justify-start">Courier Dashboard</h1>
          </div>

          {account && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-8 border-l pl-4 border-white/70">
                  <div className="flex flex-col gap-10 w-full pr-4 border-white/70">
                    <div className="flex gap-4 items-start flex-col">
                      <p className="text-2xl font-semibold ">My Orders</p>
                      {account && (
                        <div className="grid grid-cols-1 gap-4 rounded-xl w-full justify-between">
                          {myOrderData.map(
                            (order) =>
                              order.courier === account && (
                                <div
                                  key={order.orderId}
                                  className="flex flex-col border border-white p-4 rounded-xl gap-4 w-full mb-4"
                                >
                                  <div className="flex flex-col gap-2">
                                    <p>Order ID: {order.orderId}</p>
                                    <p>Store Name: {formatAddress(order.store)}</p>
                                    <p>Customer Name: {formatAddress(order.customer)}</p>
                                    <p>Total Price: {order.totalPrice.toString()}</p>
                                    <p>Courier Fee: {order.courierFee.toString()}</p>
                                    <p>Items: {order.itemIds.join(", ")}</p>
                                    <p>Quantities: {order.quantities.join(", ")}</p>
                                    <p>Map Address: {order.mapAddress}</p>
                                    <p>Issue Time: {new Date(order.issuetime * 1000).toLocaleString()}</p>
                                    {order.storeApproveTime !== 0 && (
                                      <p>
                                        Store Approve Time: {new Date(order.storeApproveTime * 1000).toLocaleString()}
                                      </p>
                                    )}
                                    <p>Order Status: {order.status}</p>
                                  </div>
                                  {!order.isDeliveredByCourier && (
                                    <button
                                      onClick={() => handleOrderClick(BigInt(order.orderId), order.iterationStatus)}
                                      className="w-fit px-10 border border-white/70 rounded-xl p-3 bg-purple-900 hover:bg-purple-900/50"
                                    >
                                      {order.buttonStatus}
                                    </button>
                                  )}
                                </div>
                              )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-10 w-full pr-4 border-white/70"></div>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-8 border-l pl-4 border-white/70">
                  <div className="flex flex-col gap-10 w-full pr-4 border-white/70">
                    <div className="flex gap-4 items-start flex-col">
                      <p className="text-2xl font-semibold ">Available Orders</p>
                      {account && (
                        <div className="grid grid-cols-1 gap-4 rounded-xl w-full justify-between">
                          {orderData.map(
                            (order) =>
                              order.storeApproved && (
                                <div
                                  key={order.orderId}
                                  className="flex flex-col border border-white p-4 rounded-xl gap-4 w-full mb-4"
                                >
                                  <div className="flex flex-col gap-2">
                                    <p>Order ID: {order.orderId}</p>
                                    <p>Store Name: {formatAddress(order.store)}</p>
                                    <p>Customer Name: {formatAddress(order.customer)}</p>
                                    <p>Total Price: {order.totalPrice.toString()}</p>
                                    <p>Courier Fee: {order.courierFee.toString()}</p>
                                    <p>Items: {order.itemIds.join(", ")}</p>
                                    <p>Quantities: {order.quantities.join(", ")}</p>
                                    <p>Map Address: {order.mapAddress}</p>
                                    <p>Issue Time: {new Date(order.issuetime * 1000).toLocaleString()}</p>
                                    {order.storeApproveTime !== 0 && (
                                      <p>
                                        Store Approve Time: {new Date(order.storeApproveTime * 1000).toLocaleString()}
                                      </p>
                                    )}
                                    <p>Order Status: {order.status}</p>
                                  </div>
                                  {
                                    <button
                                      onClick={() => handleOrderClick(BigInt(order.orderId), order.iterationStatus)}
                                      className="w-fit px-10 border border-white/70 rounded-xl p-3 bg-purple-900 hover:bg-purple-900/50"
                                    >
                                      {order.buttonStatus}
                                    </button>
                                  }
                                </div>
                              )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-10 w-full pr-4 border-white/70"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!account && (
        <div className="flex flex-col gap-10 w-fit">
          <p className="text-xl md:text-2xl text-left">Connect your wallet first</p>
          <ConnectWalletButton />
        </div>
      )}
    </main>
  );
}
