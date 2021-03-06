/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractFactory, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { UnsignedTransaction } from "ethers/utils/transaction";

import { TransactionOverrides } from ".";
import { Helpers } from "./Helpers";

export class HelpersFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: TransactionOverrides): Promise<Helpers> {
    return super.deploy(overrides) as Promise<Helpers>;
  }
  getDeployTransaction(overrides?: TransactionOverrides): UnsignedTransaction {
    return super.getDeployTransaction(overrides);
  }
  attach(address: string): Helpers {
    return super.attach(address) as Helpers;
  }
  connect(signer: Signer): HelpersFactory {
    return super.connect(signer) as HelpersFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Helpers {
    return new Contract(address, _abi, signerOrProvider) as Helpers;
  }
}

const _abi = [
  {
    inputs: [],
    name: "connectorID",
    outputs: [
      {
        internalType: "uint256",
        name: "_type",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      }
    ],
    stateMutability: "pure",
    type: "function"
  }
];

const _bytecode =
  "0x6080604052348015600f57600080fd5b5060948061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063eb15f78114602d575b600080fd5b60336048565b604051603f9291906050565b60405180910390f35b600190602a90565b91825260208201526040019056fea2646970667358221220369033657bbf00e0120fae9cd0a237eeed3b617b6046c25566c725ab51842e5964736f6c634300060c0033";
