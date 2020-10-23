import { ethers, BigNumber, utils } from "ethers";
import Web3 from "web3";

export async function sendDSAETH(web3: Web3, dsaAddress:string, eth_amount:number) {
  //setup ethers
  let provider = new ethers.providers.Web3Provider(web3.currentProvider as any);
  let userWallet: ethers.providers.JsonRpcSigner = await provider.getSigner();

  // And send ETH to the DSA
  const gasLimit = BigNumber.from(1000000);
  const gasPrice = utils.parseUnits("20", "gwei");
  return await userWallet.sendTransaction({
    to: dsaAddress,
    value: utils.parseEther(eth_amount.toString()),
    gasLimit,
    gasPrice,
  });
}
