import { Contract, ethers, BigNumber, utils } from "ethers";
import Web3 from "web3";
import { constants } from "../constants/constants";

// Contracts
const InstaIndex = require("../../pre-compiles/InstaIndex.json");
const InstaList = require("../../pre-compiles/InstaList.json");

export async function createDSA(web3: Web3): Promise<string> {
  //setup ethers
  let provider = new ethers.providers.Web3Provider(web3.currentProvider as any);
  let userWallet: ethers.providers.JsonRpcSigner = await provider.getSigner();
  let userAddress: string = await userWallet.getAddress();

  const instaIndex = new Contract(
    //@ts-ignore
    constants.InstaIndex,
    InstaIndex.abi,
    userWallet
  );
  const instaList = new Contract(
    //@ts-ignore
    constants.InstaList,
    InstaList.abi,
    userWallet
  );

  // Deploy DSA and get and verify ID of newly deployed DSA
  const dsaIDPrevious = await instaList.accounts();
  await instaIndex.build(userAddress, 1, userAddress);
  const dsaID = dsaIDPrevious.add(1);

  // And send ETH to the DSA, just in case
  const gasLimit = BigNumber.from(1000000);
  const gasPrice = utils.parseUnits("20", "gwei");
  await userWallet.sendTransaction({
    to: await instaList.accountAddr(dsaID),
    value: ethers.utils.parseEther("30"),
    gasLimit,
    gasPrice,
  });


  // Instantiate the InstaDapp DSA, returns DSA Address
  return await instaList.accountAddr(dsaID);
}
