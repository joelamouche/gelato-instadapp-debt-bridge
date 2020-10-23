import Web3 from "web3";
import { Vaults } from "../customTypes/customTypes";
export declare function getVaults(web3: Web3, dsaAddress?: string): Promise<Vaults>;
