/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, Signer } from "ethers";
import { Provider } from "ethers/providers";

import { ListInterface } from "./ListInterface";

export class ListInterfaceFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ListInterface {
    return new Contract(address, _abi, signerOrProvider) as ListInterface;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address"
      }
    ],
    name: "accountID",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
