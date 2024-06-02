import { polygonAmoy } from "wagmi/chains";

export const CHAIN_ID = 80002;

export const GOTUR_CONTRACT_ADDRESS = "0x4faD9F06b4bC2736dc3355Be88Dbcaf2CfBD929A";
export const FOOD_TOKEN_ADDRESS = "0x3E9E9d0b5D017A1da944FBa4CF55499B39873a95";

export const CUSTOMER_TOKEN_ADDRESS = "0xca9Be83C637bFdd3762A32CA921c9c0f9dc2Ef6C";
export const COURIER_TOKEN_ADDRESS = "0x72AC559A79a4966cd2BE10e249c80cADdb84fD45";
export const STORE_TOKEN_ADDRESS = "0x5b968BF6E5E74Af93f9f8DcEB2c35C22e02A05ff";

export const CHAINS = [polygonAmoy];
export const CHAIN = CHAINS.find((chain) => +chain.id === CHAIN_ID)!;
