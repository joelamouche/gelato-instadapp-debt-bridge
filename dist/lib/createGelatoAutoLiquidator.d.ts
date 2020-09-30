import { BigNumber } from "ethers";
import Web3 from "web3";
export declare function createGelatoAutoLiquidator(web3: Web3, dsaAddress: string, eth_amount: BigNumber, dai_amount: BigNumber, mockCDAIAddress: string, mockAggregatorAddress: string, conditionCompareAddress: string, conditionHasMakerVaultAddress: string): Promise<any>;
