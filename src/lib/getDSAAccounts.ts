import Web3 from "web3";
import DSA from 'dsa-sdk'
import { getUserAddress } from "./getUserAddress";
import { DSAAccount } from "../customTypes/customTypes";

export async function getDSAAccounts(web3: Web3,userAddress?:string): Promise<DSAAccount[]> {
    const dsaSdk = new DSA(web3);
    return await dsaSdk.getAccounts(userAddress?userAddress:(await getUserAddress(web3)))
}
