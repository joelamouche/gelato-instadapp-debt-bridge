/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractFactory, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { UnsignedTransaction } from "ethers/utils/transaction";
import { BigNumberish } from "ethers/utils";

import { TransactionOverrides } from ".";
import { MockCdai } from "./MockCdai";

export class MockCdaiFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _sRPS: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<MockCdai> {
    return super.deploy(_sRPS, overrides) as Promise<MockCdai>;
  }
  getDeployTransaction(
    _sRPS: BigNumberish,
    overrides?: TransactionOverrides
  ): UnsignedTransaction {
    return super.getDeployTransaction(_sRPS, overrides);
  }
  attach(address: string): MockCdai {
    return super.attach(address) as MockCdai;
  }
  connect(signer: Signer): MockCdaiFactory {
    return super.connect(signer) as MockCdaiFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockCdai {
    return new Contract(address, _abi, signerOrProvider) as MockCdai;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_sRPS",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rate",
        type: "uint256"
      }
    ],
    name: "setSupplyRatePerSecond",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "supplyRatePerSecond",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516100f23803806100f28339818101604052602081101561003357600080fd5b505160005560ac806100466000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80631eeed95e146037578063b1d38974146053575b600080fd5b605160048036036020811015604b57600080fd5b5035606b565b005b60596070565b60408051918252519081900360200190f35b600055565b6000548156fea2646970667358221220df38b91927913b0681a7bda3fca6c433a586d60423b8e56a9ab7038d01fa010a64736f6c634300060c0033";
