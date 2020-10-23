import { ethers } from "ethers";
import Web3 from "web3";
export declare function sendDSA(web3: Web3, dsaAddress: string, eth_amount: number): Promise<ethers.providers.TransactionResponse>;
