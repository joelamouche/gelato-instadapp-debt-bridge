import Web3 from "web3";
import DSA from 'dsa-sdk'
import { getDSAAccounts } from "./getDSAAccounts";
import { Vaults } from "../customTypes/customTypes";

export async function getVaults(web3: Web3, dsaAddress?:string): Promise<Vaults> {
    const dsaSdk = new DSA(web3);
    // return vaults
    return await dsaSdk.maker.getVaults(dsaAddress?dsaAddress:((await getDSAAccounts(web3))[0]).address);
}
