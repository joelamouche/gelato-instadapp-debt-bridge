import Web3 from "web3";
import { ethers } from "ethers";

export async function getUserAddress(web3: Web3): Promise<string> {
    //setup ethers
    let provider = new ethers.providers.Web3Provider(web3.currentProvider as any);
    let userWallet: ethers.providers.JsonRpcSigner = await provider.getSigner();
    return await userWallet.getAddress();
}
