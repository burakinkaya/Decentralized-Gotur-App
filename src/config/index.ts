import { polygonAmoy } from "wagmi/chains";

export const CHAIN_ID = 80002;

export const GOTUR_CONTRACT_ADDRESS = "0x17ddC883f33049D9738C2001FDb5bDaA6d64C64E";
export const FOOD_TOKEN_ADDRESS = "0xF4d36E9baB2629A8757E162C9995f2175F8f2C54";

export const CUSTOMER_TOKEN_ADDRESS = "0xbe0ec89702b8abeB9232cdF7301Fe5c35E63bE12";
export const COURIER_TOKEN_ADDRESS = "0x86e06E2D747391DC6b3fe8772864a465e60a6945";
export const STORE_TOKEN_ADDRESS = "0x51E1c28a56384E89beb067eb34bE5fB6F94d46c4";

export const CHAINS = [polygonAmoy];
export const CHAIN = CHAINS.find((chain) => +chain.id === CHAIN_ID)!;
