import { BigNumber } from "ethers";
import Web3 from "web3";
export declare function createGelatoOptimizer(web3: Web3, dsaAddress: string, eth_amount: BigNumber, dai_amount: BigNumber, mockCDAIAddress: string, mockDSRAddress: string, conditionCompareAddress: string, conditionHasMakerVaultAddress: string): Promise<any>;
