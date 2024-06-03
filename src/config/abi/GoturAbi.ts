const GoturAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token20",
        type: "address",
      },
      {
        internalType: "address",
        name: "courierT",
        type: "address",
      },
      {
        internalType: "address",
        name: "customerT",
        type: "address",
      },
      {
        internalType: "address",
        name: "storeT",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "store",
        type: "address",
      },
    ],
    name: "newOrder",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "store",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "orderId",
        type: "uint256",
      },
    ],
    name: "orderApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "store",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "orderId",
        type: "uint256",
      },
    ],
    name: "orderCanceled",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
    ],
    name: "addItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_orderId",
        type: "uint256",
      },
    ],
    name: "approveOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_orderId",
        type: "uint256",
      },
    ],
    name: "cancelOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_orderId",
        type: "uint256",
      },
    ],
    name: "cancelOrderByTime",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "closeStore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "courierToken",
    outputs: [
      {
        internalType: "contract CourierToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "customerToken",
    outputs: [
      {
        internalType: "contract CustomerToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "itemId",
        type: "uint256",
      },
    ],
    name: "disableItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getActiveOrders",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "orderId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "customer",
            type: "address",
          },
          {
            internalType: "address",
            name: "store",
            type: "address",
          },
          {
            internalType: "address",
            name: "courier",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "totalPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "courierFee",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "itemIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "quantitities",
            type: "uint256[]",
          },
          {
            internalType: "bool",
            name: "courierFound",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "storeApproved",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "courierPickedUp",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isDeliveredByCourier",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isReceivedByCustomer",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isCanceled",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isComplete",
            type: "bool",
          },
          {
            internalType: "string",
            name: "mapAddress",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "issuetime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "storeApproveTime",
            type: "uint256",
          },
        ],
        internalType: "struct Gotur.Order[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "ownerAddr",
        type: "address",
      },
    ],
    name: "getMenu",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isAvailable",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "quantity",
            type: "uint256",
          },
        ],
        internalType: "struct Gotur.Item[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getServeableOrders",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "orderId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "customer",
            type: "address",
          },
          {
            internalType: "address",
            name: "store",
            type: "address",
          },
          {
            internalType: "address",
            name: "courier",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "totalPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "courierFee",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "itemIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "quantitities",
            type: "uint256[]",
          },
          {
            internalType: "bool",
            name: "courierFound",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "storeApproved",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "courierPickedUp",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isDeliveredByCourier",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isReceivedByCustomer",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isCanceled",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isComplete",
            type: "bool",
          },
          {
            internalType: "string",
            name: "mapAddress",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "issuetime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "storeApproveTime",
            type: "uint256",
          },
        ],
        internalType: "struct Gotur.Order[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStores",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        internalType: "struct Gotur.StoreRet[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "makeCourier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "makeCustomer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "makeStore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_orderId",
        type: "uint256",
      },
    ],
    name: "markOrderDelivered",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_orderId",
        type: "uint256",
      },
    ],
    name: "markOrderPickedUp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_orderId",
        type: "uint256",
      },
    ],
    name: "markOrderReceived",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "openStore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "storeAddress",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_itemIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_quantities",
        type: "uint256[]",
      },
      {
        internalType: "string",
        name: "_mapAddress",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_courierFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_totalPrice",
        type: "uint256",
      },
    ],
    name: "placeOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "placeStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "itemId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
    ],
    name: "setQuantity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "stakeOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "storeToken",
    outputs: [
      {
        internalType: "contract StoreToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_orderId",
        type: "uint256",
      },
    ],
    name: "takeOrderAsCourier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract FoodToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export default GoturAbi;
