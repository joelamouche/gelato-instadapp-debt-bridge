import { ethers, BigNumber, utils, Contract } from "ethers";
import Web3 from "web3";
import { constants } from "../constants/constants";
const IERC20 = require("../../pre-compiles/IERC20.json");

export async function sendDSADAI(web3: Web3, dsaAddress:string, dai_amount:number) {
  //setup ethers
  let provider = new ethers.providers.Web3Provider(web3.currentProvider as any);
  let userWallet: ethers.providers.JsonRpcSigner = await provider.getSigner();
  let dai = new Contract(constants.DAI, IERC20.abi, userWallet);

    return await dai.transfer(dsaAddress, ethers.utils.parseUnits(dai_amount.toString(), 18));
}
