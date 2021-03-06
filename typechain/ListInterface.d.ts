/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractTransaction, EventFilter, Signer } from "ethers";
import { Listener, Provider } from "ethers/providers";
import { Arrayish, BigNumber, BigNumberish, Interface } from "ethers/utils";
import {
  TransactionOverrides,
  TypedEventDescription,
  TypedFunctionDescription
} from ".";

interface ListInterfaceInterface extends Interface {
  functions: {
    accountID: TypedFunctionDescription<{
      encode([_account]: [string]): string;
    }>;
  };

  events: {};
}

export class ListInterface extends Contract {
  connect(signerOrProvider: Signer | Provider | string): ListInterface;
  attach(addressOrName: string): ListInterface;
  deployed(): Promise<ListInterface>;

  on(event: EventFilter | string, listener: Listener): ListInterface;
  once(event: EventFilter | string, listener: Listener): ListInterface;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): ListInterface;
  removeAllListeners(eventName: EventFilter | string): ListInterface;
  removeListener(eventName: any, listener: Listener): ListInterface;

  interface: ListInterfaceInterface;

  functions: {
    accountID(
      _account: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "accountID(address)"(
      _account: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;
  };

  accountID(
    _account: string,
    overrides?: TransactionOverrides
  ): Promise<BigNumber>;

  "accountID(address)"(
    _account: string,
    overrides?: TransactionOverrides
  ): Promise<BigNumber>;

  filters: {};

  estimate: {
    accountID(
      _account: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "accountID(address)"(
      _account: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;
  };
}
