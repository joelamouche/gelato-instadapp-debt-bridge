import { BigNumber } from "ethers";
import Web3 from "web3";
interface OptimizerOptions {
    CMIAddress?: string;
    CCIAddress?: string;
    conditionCompareAddress?: string;
    conditionHasMakerVaultAddress?: string;
}
export declare function createGelatoOptimizer(web3: Web3, dsaAddress: string, eth_amount: BigNumber, dai_amount: BigNumber, options?: OptimizerOptions): Promise<any>;
export {};
