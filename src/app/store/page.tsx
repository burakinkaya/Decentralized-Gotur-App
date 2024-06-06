"use client";

import ConnectWalletButton from "@/components/ConnectWalletButton";
import { Button } from "@/components/ui/button";
import { GOTUR_CONTRACT_ADDRESS, CHAIN_ID } from "@/config";
import GoturAbi from "@/config/abi/GoturAbi";
import { formatAddress } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

type Product = {
  id: number;
  isAvailable: boolean;
  name: string;
  price: bigint;
  quantity: bigint;
  quantityInput: number;
  priceInput: number;
};

type Order = {
  orderId: number;
  customer: `0x${string}`;
  store: `0x${string}`;
  courier: `0x${string}`;
  totalPrice: bigint;
  courierFee: bigint;
  itemIds: number[];
  itemNames: string[];
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
  iterationStatus: string;
};

export default function Store() {
  const { address: account } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [productName, setProductName] = useState<string>("");
  const [productPrice, setProductPrice] = useState<bigint>(BigInt(0));
  const [productQuantity, setProductQuantity] = useState<bigint>(BigInt(0));

  const [productData, setProductData] = useState<Product[]>([]);
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [completedOrderData, setCompletedOrderData] = useState<Order[]>([]);

  const [toggleAddItemButton, setToggleAddItemButton] = useState<boolean>(false);
  const [toggleButtonText, setToggleButtonText] = useState<string>("Add Item");

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

  const {
    data: completedOrdersData,
    isFetched: isCompletedOrdersFetched,
    error: isCompletedOrdersError,
  } = useReadContract({
    abi: GoturAbi,
    address: GOTUR_CONTRACT_ADDRESS,
    functionName: "getCompletedOrders",
    chainId: CHAIN_ID,
    account,
  });

  useEffect(() => {
    if (isFetched) {
      if (data) {
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
          let iterationStatus = "";

          if (!order.storeApproved) {
            status = "Waiting for you to Approve order";
            iterationStatus = "Approve Order";
          } else if (!order.courierFound) {
            status = "Waiting for Courier to Find the Order.";
            if (currentTime - orderIssueTime > thirtySecondsInMilliseconds) {
              status += " Since over 30 minutes have passed, Customer may cancel the order";
            }
          } else if (!order.courierPickedUp) {
            status = "A Courier is found, waiting for Courier to Pick Up the Order";
          } else if (!order.isDeliveredByCourier) {
            status = "Courier is on his/her way to the Customer";
          } else if (!order.isReceivedByCustomer) {
            status = "Order is delivered to the Customer";
          } else {
            status = "Orde is completed";
          }

          return {
            ...order,
            orderId: Number(order.orderId),
            totalPrice: BigInt(order.totalPrice),
            courierFee: BigInt(order.courierFee),
            itemIds: order.itemIds.map((id: any) => Number(id)),
            itemNames: order.itemNames.map((name: any) => String(name)),
            quantities: order.quantitities.map((quantity: any) => Number(quantity)),
            issuetime: Number(order.issuetime),
            storeApproveTime: Number(order.storeApproveTime),
            status,
            iterationStatus,
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
    if (isCompletedOrdersFetched) {
      if (completedOrdersData) {
        const mutableCompletedOrdersData: Order[] = (completedOrdersData as any).map((completedOrder: any) => {
          const thirtySecondsInMilliseconds = 30 * 1000;
          const currentTime = Date.now();
          const orderIssueTime = Number(completedOrder.issuetime) * 1000;

          const status = "Completed";

          return {
            ...completedOrder,
            orderId: Number(completedOrder.orderId),
            totalPrice: BigInt(completedOrder.totalPrice),
            courierFee: BigInt(completedOrder.courierFee),
            itemIds: completedOrder.itemIds.map((id: any) => Number(id)),
            itemNames: completedOrder.itemNames.map((name: any) => String(name)),
            quantities: completedOrder.quantitities.map((quantity: any) => Number(quantity)),
            issuetime: Number(completedOrder.issuetime),
            storeApproveTime: Number(completedOrder.storeApproveTime),
            status,
          };
        });

        setCompletedOrderData(mutableCompletedOrdersData);
      } else {
        console.log("There is no order returned from contract.");
      }
    }

    if (isOrdersError) {
      console.error("Error reading contract:", isOrdersError);
    }
  }, [isCompletedOrdersFetched, completedOrdersData, isCompletedOrdersError, account]);
  const handleButtonClick = async () => {
    try {
      const result = await writeContractAsync({
        abi: GoturAbi,
        address: GOTUR_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "addItem",
        args: [productName, productPrice, productQuantity],
        account,
        chainId: CHAIN_ID,
      });
      const explorerUrl = `https://amoy.polygonscan.com/tx/${result}`;

      toast.success(createToastMessage(explorerUrl));
    } catch (e: any) {
      toast.error(e || "An unknown error occurred.");
    }
  };

  const handleOpenStore = async () => {
    try {
      const result = await writeContractAsync({
        abi: GoturAbi,
        address: GOTUR_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "openStore",
        account,
        chainId: CHAIN_ID,
      });
      const explorerUrl = `https://amoy.polygonscan.com/tx/${result}`;

      toast.success(createToastMessage(explorerUrl));
    } catch (e: any) {
      toast.error(e || "An unknown error occurred.");
    }
  };

  const handleCloseStore = async () => {
    try {
      const result = await writeContractAsync({
        abi: GoturAbi,
        address: GOTUR_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "closeStore",
        account,
        chainId: CHAIN_ID,
      });
      const explorerUrl = `https://amoy.polygonscan.com/tx/${result}`;

      toast.success(createToastMessage(explorerUrl));
    } catch (e: any) {
      toast.error(e || "An unknown error occurred.");
    }
  };

  const handleAddItem = async () => {
    setToggleAddItemButton(!toggleAddItemButton);
    setToggleButtonText(toggleButtonText === "Add Item" ? "Cancel" : "Add Item");
  };

  const handleApproveOrder = async (orderId: bigint) => {
    try {
      const result = await writeContractAsync({
        abi: GoturAbi,
        address: GOTUR_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "approveOrder",
        args: [orderId],
        account,
        chainId: CHAIN_ID,
      });
      const explorerUrl = `https://amoy.polygonscan.com/tx/${result}`;

      toast.success(createToastMessage(explorerUrl));
    } catch (e: any) {
      toast.error(e || "An unknown error occurred.");
    }
  };

  const handleQuantityChange = (id: number, value: string) => {
    const numericValue = Number(value);
    setProductData((prev) =>
      prev.map((product) => (product.id === id ? { ...product, quantityInput: numericValue } : product))
    );
  };

  const handlePriceChange = (id: number, value: string) => {
    const numericValue = Number(value);
    setProductData((prev) =>
      prev.map((product) => (product.id === id ? { ...product, priceInput: numericValue } : product))
    );
  };

  const handleSetQuantity = async (id: number) => {
    if (!productData.find((product) => product.id === id)?.quantityInput) return;
    try {
      const result = await writeContractAsync({
        abi: GoturAbi,
        address: GOTUR_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "setQuantity",
        args: [BigInt(id), BigInt(productData.find((product) => product.id === id)?.quantityInput!)],
        account,
        chainId: CHAIN_ID,
      });
      const explorerUrl = `https://amoy.polygonscan.com/tx/${result}`;
      toast.success(createToastMessage(explorerUrl));
    } catch (e: any) {
      toast.error(e?.message || "An unknown error occurred.");
    }
  };

  const handleChangePrice = async (id: number) => {
    if (!productData.find((product) => product.id === id)?.priceInput) return;
    try {
      const result = await writeContractAsync({
        abi: GoturAbi,
        address: GOTUR_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "changePrice",
        args: [BigInt(id), BigInt(productData.find((product) => product.id === id)?.priceInput!)],
        account,
        chainId: CHAIN_ID,
      });
      const explorerUrl = `https://amoy.polygonscan.com/tx/${result}`;
      toast.success(createToastMessage(explorerUrl));
    } catch (e: any) {
      toast.error(e?.message || "An unknown error occurred.");
    }
  };

  const handleToggleAvailability = async (id: number) => {
    try {
      const result = await writeContractAsync({
        abi: GoturAbi,
        address: GOTUR_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "toggleItemAvailability",
        args: [BigInt(id)],
        account,
        chainId: CHAIN_ID,
      });
      const explorerUrl = `https://amoy.polygonscan.com/tx/${result}`;
      toast.success(createToastMessage(explorerUrl));
    } catch (e: any) {
      toast.error(e?.message || "An unknown error occurred.");
    }
  };

  return (
    <main className="bg-[#8f7efc] flex min-h-screen flex-col  justify-between p-12">
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
                    onClick={() => {
                      handleButtonClick();
                      setTimeout(() => {
                        handleAddItem();
                      }, 5000);
                    }}
                  >
                    Add Product
                  </button>
                </div>
              ) : (
                <div className="w-[389.5px] pr-4"></div>
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
                                className="flex flex-col border border-white p-4 rounded-xl gap-4 w-full mb-4"
                              >
                                <div className="flex flex-col gap-2">
                                  <p>Order ID: {order.orderId}</p>
                                  <p>Customer Name: {formatAddress(order.customer)}</p>
                                  {order.courier !== "0x0000000000000000000000000000000000000000" && order.courier && (
                                    <p>Courier: {formatAddress(order.courier)}</p>
                                  )}
                                  <p>Total Price: {order.totalPrice.toString()}</p>
                                  <p>Courier Fee: {order.courierFee.toString()}</p>
                                  <p>Items: {order.itemNames.join(", ")}</p>
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

                                {order.iterationStatus === "Approve Order" && (
                                  <button
                                    className="w-fit px-10 border border-white/70 rounded-xl p-3 bg-purple-900 hover:bg-purple-900/50"
                                    onClick={() => handleApproveOrder(BigInt(order.orderId))}
                                  >
                                    {order.iterationStatus}
                                  </button>
                                )}
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
                      {productData.map((product) => (
                        <div className="flex flex-col gap-4" key={product.id}>
                          <div className="flex flex-col border border-white p-10 rounded-xl gap-2 w-full items-start">
                            <p>Name: {product.name}</p>
                            <p>Price: {Number(product.price)}</p>
                            <p>Quantity: {Number(product.quantity)}</p>
                          </div>
                          <div className="flex flex-col gap-4 w-full justify-center">
                            <div className="flex gap-2 items-center">
                              <input
                                type="number"
                                value={product.priceInput}
                                min={0}
                                onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                className="border rounded p-2 text-black w-1/2"
                              />
                              <Button
                                onClick={() => handleChangePrice(product.id)}
                                className="rounded-xl border border-white hover:bg-white/25"
                              >
                                Change Price
                              </Button>
                            </div>
                            <div className="flex gap-2 items-center">
                              <input
                                type="number"
                                value={product.quantityInput}
                                min={0}
                                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                className="border rounded p-2 text-black w-1/2"
                              />
                              <Button
                                onClick={() => handleSetQuantity(product.id)}
                                className="rounded-xl border border-white hover:bg-white/25"
                              >
                                Set Quantity
                              </Button>
                            </div>
                            <Button
                              onClick={() => handleToggleAvailability(product.id)}
                              className="rounded-xl border border-white hover:bg-white/25"
                            >
                              {product.isAvailable ? "Disable" : "Enable"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 items-start flex-col">
                    <p className="text-2xl font-semibold ">Completed Orders</p>
                    {account && isCompletedOrdersFetched && (
                      <div className="grid grid-cols-1 gap-4 rounded-xl w-full justify-between">
                        {completedOrderData.map(
                          (order) =>
                            order.store === account && (
                              <div
                                key={order.orderId}
                                className="flex flex-col border border-white p-4 rounded-xl gap-4 w-full mb-4"
                              >
                                <div className="flex flex-col gap-2">
                                  <p>Order ID: {order.orderId}</p>
                                  <p>Customer Name: {formatAddress(order.customer)}</p>
                                  {order.courier !== "0x0000000000000000000000000000000000000000" && order.courier && (
                                    <p>Courier: {formatAddress(order.courier)}</p>
                                  )}
                                  <p>Total Price: {order.totalPrice.toString()}</p>
                                  <p>Courier Fee: {order.courierFee.toString()}</p>
                                  <p>Items: {order.itemNames.join(", ")}</p>
                                  <p>Quantities: {order.quantities.join(", ")}</p>
                                  <p>Map Address: {order.mapAddress}</p>
                                  <p>Issue Time: {new Date(order.issuetime * 1000).toLocaleString()}</p>
                                  {order.storeApproveTime !== 0 && (
                                    <p>
                                      Store Approve Time: {new Date(order.storeApproveTime * 1000).toLocaleString()}
                                    </p>
                                  )}
                                  <p className="text-green-400">Order Status: {order.status}</p>
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    )}
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
