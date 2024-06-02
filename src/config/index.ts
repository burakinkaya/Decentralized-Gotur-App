import { polygonAmoy } from "wagmi/chains";

export const CHAIN_ID = 80002;

export const GOTUR_CONTRACT_ADDRESS = "0x4e7dE27c5d72C4c800B746D69916B54D074A8508";
export const FOOD_TOKEN_ADDRESS = "0x11c9b6cA53469845edbB0DAf81908dc9C82eD2B1";

export const CUSTOMER_TOKEN_ADDRESS = "0x530481385Cf1897C230e98dfb65dF47EADC20DbC";
export const COURIER_TOKEN_ADDRESS = "0x07E388cAA19B73F8f13b5e7d12d30917b3D0777C";
export const STORE_TOKEN_ADDRESS = "0xe2A0c8143Da499B0CE54bE4cb3468536f9844e4f";

export const CHAINS = [polygonAmoy];
export const CHAIN = CHAINS.find((chain) => +chain.id === CHAIN_ID)!;

