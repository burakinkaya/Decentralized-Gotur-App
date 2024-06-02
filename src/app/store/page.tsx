"use client";

import ConnectWalletButton from "@/components/ConnectWalletButton";
import { Button } from "@/components/ui/button";
import { GOTUR_CONTRACT_ADDRESS, CHAIN_ID } from "@/config";
import GoturAbi from "@/config/abi/GoturAbi";
import { formatAddress } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

type Product = {
  id: number;
  isAvailable: boolean;
  name: string;
  price: bigint;
  quantity: bigint;
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
  cancelStatus: number;
};

export default function Store() {
  const { address: account } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [productName, setProductName] = useState<string>("");
  const [productPrice, setProductPrice] = useState<bigint>(BigInt(0));
  const [productQuantity, setProductQuantity] = useState<bigint>(BigInt(0));

  const [productData, setProductData] = useState<Product[]>([]);

  const [orderData, setOrderData] = useState<Order[]>([]);

  const [toggleAddItemButton, setToggleAddItemButton] = useState<boolean>(false);
  const [toggleButtonText, setToggleButtonText] = useState<string>("Add Item");

  const { data, isFetched, error } = useReadContract({
    abi: GoturAbi,
    address: GOTUR_CONTRACT_ADDRESS,
    functionName: "getMenu",
    chainId: CHAIN_ID,
    args: [account as `0x${string}`],
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
    if (isFetched) {
      if (data) {
        console.log("data is", data);
        const productsWithId = (data as Product[]).map((product, index) => ({
          ...product,
          id: index,
        }));
        setProductData(productsWithId);
      } else {
        console.log("No data returned from contract.");
      }
    }

    if (error) {
      console.error("Error reading contract:", error);
    }
  }, [isFetched, data, error]);

  useEffect(() => {
    if (isOrdersFetched) {
      if (ordersData) {
        const mutableOrdersData: Order[] = (ordersData as any).map((order: any) => {
          const thirtySecondsInMilliseconds = 30 * 1000;
          const currentTime = Date.now();
          const orderIssueTime = Number(order.issuetime) * 1000;

          let status = "";

          if (!order.storeApproved) {
            status = "Waiting for you to Approve order";
          } else if (currentTime - orderIssueTime > thirtySecondsInMilliseconds) {
            status = "You approved the order but over 30 minutes have passed, Customer may cancel the order";
          } else if (!order.courierFound) {
            status = "Waiting for Courier to Find the Order";
          } else if (!order.courierPickedUp) {
            status = "Waiting for Courier to Pick Up the Order";
          } else {
            status = "Courier is on the way to Customer";
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

  const handleOpenStore = async () => {
    try {
      const result = writeContractAsync({
        abi: GoturAbi,
        address: GOTUR_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "openStore",
        account,
        chainId: CHAIN_ID,
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseStore = async () => {
    try {
      const result = writeContractAsync({
        abi: GoturAbi,
        address: GOTUR_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "closeStore",
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
    setToggleButtonText(toggleButtonText === "Add Item" ? "Cancel" : "Add Item");
  };

  return (
    <main className="bg-[#055c63] flex min-h-screen flex-col  justify-between p-12">
      {account && (
        <div className="mb-32  lg:mb-0  flex flex-col gap-10 ">
          <div className="flex flex-row justify-between items-center">
            <h1 className="w-full text-2xl md:text-4xl justify-start">Store Dashboard</h1>
            <button
              className="w-1/3 border border-white/70 rounded-xl p-3 mr-2 bg-purple-900 hover:bg-purple-900/50"
              onClick={handleOpenStore}
            >
              Open Store
            </button>
            <button
              className="w-1/3 border border-white/70 rounded-xl p-3 bg-purple-900 hover:bg-purple-900/50"
              onClick={handleCloseStore}
            >
              Close Store
            </button>
          </div>

          <button
            className="w-fit px-10 border border-white/70 rounded-xl p-3 bg-purple-900 hover:bg-purple-900/50"
            onClick={handleAddItem}
          >
            {toggleButtonText}
          </button>
          {account && (
            <div className="flex flex-row gap-4">
              {toggleAddItemButton ? (
                <div className="flex flex-col gap-10 w-fit pr-4">
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
                </div>
              ) : (
                <div className="w-[344.5px] pr-4"></div>
              )}

              <div className="flex flex-col gap-8 border-l pl-4 border-white/70">
                <div className="flex flex-col gap-10 w-full pr-4 border-white/70">
                  <div className="flex gap-4 items-start flex-col">
                    <p className="text-2xl font-semibold ">My Orders</p>
                    {account && isOrdersFetched && (
                      <div className="grid grid-cols-1 gap-4 rounded-xl w-full justify-between">
                        {orderData.map(
                          (order) =>
                            order.store === account && (
                              <div
                                key={order.orderId}
                                className="flex flex-col border border-white p-4 rounded-xl gap-2 w-full mb-4"
                              >
                                <p>Order ID: {order.orderId}</p>
                                <p>Customer Name: {formatAddress(order.customer)}</p>
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
                              </div>
                            )
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-10 w-full pr-4 border-white/70">
                  <div className="flex gap-4 items-start flex-col">
                    <p className="text-2xl font-semibold">My Products</p>
                    <div className="grid grid-cols-4 gap-10 rounded-xl w-full justify-between">
                      {productData.map(
                        (product) =>
                          product.isAvailable && (
                            <div className="flex flex-col gap-4" key={product.id}>
                              <div className="flex flex-col border border-white p-10 rounded-xl gap-2 w-full items-start">
                                <p>Name: {product.name}</p>
                                <p>Price: {Number(product.price)}</p>
                                <p>Quantity: {Number(product.quantity)}</p>
                              </div>
                              <div className="flex gap-10 w-full  justify-center">
                                <Button className="rounded-xl border border-white hover:bg-white/25">-</Button>
                                <Button className="rounded-xl border border-white hover:bg-white/25">+</Button>
                              </div>
                            </div>
                          )
                      )}
                    </div>
                  </div>
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
