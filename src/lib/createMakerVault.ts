import { ethers, BigNumber, Contract, utils } from "ethers";
import DSA from "dsa-sdk";
import Web3 from "web3";
import { abiEncodeWithSelector } from "./utils/abiEncodeWithSelector";
import { constants } from "../constants/constants";
import { Vaults } from "../customTypes/customTypes";

const ConnectMaker = require("../../pre-compiles/ConnectMaker.json");
const InstaAccount = require("../../pre-compiles/InstaAccount.json");

export async function createMakerVault(
  web3: Web3,
  dsaAddress: string,
  eth_amount: BigNumber,
  dai_amount: BigNumber
):Promise<Vaults> {
  // setup ethers
  let provider = new ethers.providers.Web3Provider(web3.currentProvider as any);
  let userWallet: ethers.providers.JsonRpcSigner = await provider.getSigner();
  let userAddress: string = await userWallet.getAddress();

  // setup dsa contract
  const dsaSdk = new DSA(web3);
  let dsa = new Contract(dsaAddress, InstaAccount.abi, userWallet);

  const gasLimit = BigNumber.from(1000000);
  const gasPrice = utils.parseUnits("20", "gwei");

  // First send ETH to the DSA
  await userWallet.sendTransaction({
    to: dsaAddress,
    value: eth_amount,
    gasLimit,
    gasPrice,
  });

  // Open vault
  const openVaultData = abiEncodeWithSelector(ConnectMaker.abi, "open", [
    "ETH-A",
  ]);

  // Deposit 10 eth
  const depositEthData = abiEncodeWithSelector(ConnectMaker.abi, "deposit", [
    0,
    eth_amount,
    0,
    0,
  ]);

  // Borrow max DAI amount (-1 is maximum) //TODO: get max amount
  const borrowDaiData = abiEncodeWithSelector(ConnectMaker.abi, "borrow", [
    0,
    dai_amount,
    0,
    0,
  ]);

  // Casting it twice makes it easier for the network
  await dsa.cast(
    [
      //@ts-ignore
      constants.ConnectMaker,
      //@ts-ignore
      constants.ConnectMaker,
    ],
    [openVaultData, depositEthData],
    userAddress
  );

  await dsa.cast(
    [
      //@ts-ignore
      constants.ConnectMaker,
    ],
    [borrowDaiData],
    userAddress
  );

  // return vaults
  return await dsaSdk.maker.getVaults(dsaAddress);
}
