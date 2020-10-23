import { ethers, BigNumber, utils, Contract } from "ethers";
import Web3 from "web3";
import { constants } from "../constants/constants";
import { abiEncodeWithSelector } from "./utils/abiEncodeWithSelector";
const ConnectBasic = require("../../pre-compiles/ConnectBasic.json");
const InstaAccount = require("../../pre-compiles/InstaAccount.json");

export async function withdrawDSADAI(web3: Web3, dsaAddress:string, dai_amount:number) {
  //setup ethers
  let provider = new ethers.providers.Web3Provider(web3.currentProvider as any);
  let userWallet: ethers.providers.JsonRpcSigner = await provider.getSigner();
  let userAddress = await userWallet.getAddress();
  let dsa = new Contract(dsaAddress, InstaAccount.abi, userWallet);

  // And withdraw fron the DSA
  const gasLimit = BigNumber.from(1000000);
  const gasPrice = utils.parseUnits("20", "gwei");
  const withdrawData = abiEncodeWithSelector(ConnectBasic.abi, "withdraw", [constants.DAI, ethers.utils.parseUnits(dai_amount.toString(), 18), userAddress, 0, 0]);

  return await dsa.cast([constants.ConnectBasic], [withdrawData], userAddress, {
      gasLimit,
      gasPrice,
    })
}
