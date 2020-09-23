
import ethers, { BigNumber, Contract, utils } from "ethers"
import DSA from 'dsa-sdk'
import Web3 from 'web3'
import bre from "@nomiclabs/buidler"

const ConnectMaker = require("../pre-compiles/ConnectMaker.json");
const InstaAccount = require("../pre-compiles/InstaAccount.json");

export async function createMakerVault(web3:Web3,dsaAddress:string, eth_amount:number){
    const dsaSdk=new DSA(web3)
    //setup ethers
    let provider = new ethers.providers.Web3Provider(web3.currentProvider as any);
    let userWallet:ethers.ethers.providers.JsonRpcSigner = await provider.getSigner();
    let userAddress:string = await userWallet.getAddress();
    
    let dsa = new Contract(InstaAccount.abi, dsaAddress, provider);
    
    const gasLimit = BigNumber.from(1000000);
    const gasPrice = utils.parseUnits("20", "gwei");

    const ETH_AMOUNT=utils.parseEther(eth_amount.toString())
    
    // First send ETH to the DSA
    await userWallet.sendTransaction({
      to: dsaAddress,
      value: ETH_AMOUNT,
      gasLimit,
      gasPrice,
    });
    

    // Open vault
    const openVaultData = await bre.run("abi-encode-with-selector", {
      abi: ConnectMaker.abi,
      functionName: "open",
      inputs: ['ETH-A'],
    });

    // Deposit 10 eth
    const depositEthData = await bre.run("abi-encode-with-selector", {
        abi: ConnectMaker.abi,
        functionName: "deposit",
        inputs: [0,ETH_AMOUNT,0,0],
    });

    // Borrow max DAI amount (-1 is maximum) //TODO: get max amount
    const borrowDaiData = await bre.run("abi-encode-with-selector", {
        abi: ConnectMaker.abi,
        functionName: "borrow",
        inputs: [0,ETH_AMOUNT ,0,0],
    });

    // Casting it twice makes it easier for the network
        await dsa.cast(
        [
          //@ts-ignore
            bre.network.config.ConnectMaker, 
            //@ts-ignore
            bre.network.config.ConnectMaker, 
            ],
        [
            openVaultData,
            depositEthData,
            ],
        userAddress
        )
        
        await dsa.cast(
          [
            //@ts-ignore
              bre.network.config.ConnectMaker
              ],
          [
              borrowDaiData
              ],
          userAddress
          )
        return await dsaSdk.maker.getVaults(dsaAddress)

}