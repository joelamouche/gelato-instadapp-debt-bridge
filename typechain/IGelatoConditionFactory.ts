/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, Signer } from "ethers";
import { Provider } from "ethers/providers";

import { IGelatoCondition } from "./IGelatoCondition";

export class IGelatoConditionFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IGelatoCondition {
    return new Contract(address, _abi, signerOrProvider) as IGelatoCondition;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_taskReceiptId",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "_conditionData",
        type: "bytes"
      },
      {
        internalType: "uint256",
        name: "_cycleId",
        type: "uint256"
      }
    ],
    name: "ok",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
