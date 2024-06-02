"use client";

import { Button } from "@/components/ui/button";
import { GOTUR_CONTRACT_ADDRESS, CHAIN_ID } from "@/config";
import GoturAbi from "@/config/abi/GoturAbi";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

type Product = {
  id: number;
  isAvailable: boolean;
  name: string;
  price: bigint;
  quantity: bigint;
};

type CartItem = {
  id: number;
  name: string;
  price: bigint;
  quantity: number;
};

export default function Store() {
  const pathname = usePathname();
  const { address: account } = useAccount();

  const { writeContractAsync } = useWriteContract();

  const [productData, setProductData] = useState<Product[]>([]);

  const [cart, setCart] = useState<CartItem[]>([]);

  const [totalPrice, setTotalPrice] = useState<bigint>(BigInt(0));

  const [courierFee, setCourierFee] = useState<bigint>(BigInt(0));

  const [mapAddress, setMapAddress] = useState<string>("");

  const storeOwner = pathname.split("/")[3];

  const { data, isFetched, error } = useReadContract({
    abi: GoturAbi,
    address: GOTUR_CONTRACT_ADDRESS,
    functionName: "getMenu",
    chainId: CHAIN_ID,
    args: [storeOwner as `0x${string}`],
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

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      let newCart;
      if (existingItem) {
        if (existingItem.quantity < Number(product.quantity)) {
          newCart = prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
          newCart = prevCart;
        }
      } else {
        newCart = [...prevCart, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
      }
      updateTotalPrice(newCart);
      return newCart;
    });
  };

  const removeFromCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      let newCart;
      if (existingItem) {
        if (existingItem.quantity > 1) {
          newCart = prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item));
        } else {
          newCart = prevCart.filter((item) => item.id !== product.id);
        }
      } else {
        newCart = prevCart;
      }
      updateTotalPrice(newCart);
      return newCart;
    });
  };

  const updateTotalPrice = (cart: CartItem[]) => {
    const newTotalPrice = cart.reduce((total, item) => total + item.price * BigInt(item.quantity), BigInt(0));
    setTotalPrice(newTotalPrice);
  };

  useEffect(() => {
    console.log("cart", cart);
  }, [cart]);

  const handlePlaceOrder = async () => {
    try {
      const result = await writeContractAsync({
        abi: GoturAbi,
        address: GOTUR_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "placeOrder",
        args: [
          storeOwner as `0x${string}`,
          cart.map((item) => BigInt(item.id)),
          cart.map((item) => BigInt(item.quantity)),
          mapAddress,
          courierFee,
          totalPrice,
        ],
        account,
        chainId: CHAIN_ID,
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="bg-[#055c63] flex min-h-screen flex-col items-center justify-between p-12">
      <div className="text-center lg:w-full items-center lg:max-w-5xl flex flex-col gap-20">
        <h1 className="w-full text-2xl md:text-4xl text-left">Store Products</h1>
        {account && isFetched && (
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
                      <Button
                        className="rounded-xl border border-white hover:bg-white/25"
                        onClick={() => removeFromCart(product)}
                      >
                        -
                      </Button>
                      <Button
                        className="rounded-xl border border-white hover:bg-white/25"
                        onClick={() => addToCart(product)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                )
            )}
          </div>
        )}
        <div className="w-full mt-10">
          <h2 className="text-2xl">Cart</h2>
          {cart.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <p>
                    {item.name} (x{item.quantity})
                  </p>
                  <p>{Number(item.price) * item.quantity}</p>
                </div>
              ))}
              <div className="flex justify-between font-bold">
                <p>Total Price:</p>
                <p>{Number(totalPrice)}</p>
              </div>
              <div className="flex justify-between">
                <p>Courier Fee: </p>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    onChange={(e) => setCourierFee(BigInt(e.target.value))}
                    className="text-white rounded-xl p-1 text-center bg-purple-900/50"
                  ></input>
                  <p>$</p>
                </div>
              </div>
              <div className="flex justify-between">
                <p>Address: </p>
                <input
                  onChange={(e) => setMapAddress(e.target.value)}
                  type="string"
                  className="text-white rounded-xl p-1 text-center bg-purple-900/50"
                ></input>
              </div>

              <button
                className="w-fit border border-white/70 rounded-xl p-3 bg-purple-900 hover:bg-purple-900/50"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
