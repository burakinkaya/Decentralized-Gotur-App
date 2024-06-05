import { polygonAmoy } from "wagmi/chains";

export const CHAIN_ID = 80002;

export const DEPLOYER_WALLET = "0x8ca0b191825F09252117932a23331F40B1BdE09C";

export const GOTUR_CONTRACT_ADDRESS = "0xE9F7b2B2Aa95C16D08d4b66296A8481660089b3f";
export const FOOD_TOKEN_ADDRESS = "0xA452a48505faC6ACe6e823CB80779658aB06936D";

export const CUSTOMER_TOKEN_ADDRESS = "0x2e71ebE1Bc45ef69857b167b2de0d3314c0A5a60";
export const COURIER_TOKEN_ADDRESS = "0xAe6822c2717D52993b0778b1A553FF0C0F940b33";
export const STORE_TOKEN_ADDRESS = "0xe3c20A03798bf2a4528124A388B744C29F8BadAA";

export const CHAINS = [polygonAmoy];
export const CHAIN = CHAINS.find((chain) => +chain.id === CHAIN_ID)!;
