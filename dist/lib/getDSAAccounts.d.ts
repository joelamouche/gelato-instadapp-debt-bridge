import Web3 from "web3";
import { DSAAccount } from "../customTypes/customTypes";
export declare function getDSAAccounts(web3: Web3, userAddress?: string): Promise<DSAAccount[]>;
