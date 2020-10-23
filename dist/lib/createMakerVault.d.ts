import { BigNumber } from "ethers";
import Web3 from "web3";
import { Vaults } from "../customTypes/customTypes";
export declare function createMakerVault(web3: Web3, dsaAddress: string, eth_amount: BigNumber, dai_amount: BigNumber): Promise<Vaults>;
