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

interface StoresInterface extends Interface {
  functions: {
    connectorID: TypedFunctionDescription<{ encode([]: []): string }>;
  };

  events: {};
}

export class Stores extends Contract {
  connect(signerOrProvider: Signer | Provider | string): Stores;
  attach(addressOrName: string): Stores;
  deployed(): Promise<Stores>;

  on(event: EventFilter | string, listener: Listener): Stores;
  once(event: EventFilter | string, listener: Listener): Stores;
  addListener(eventName: EventFilter | string, listener: Listener): Stores;
  removeAllListeners(eventName: EventFilter | string): Stores;
  removeListener(eventName: any, listener: Listener): Stores;

  interface: StoresInterface;

  functions: {
    connectorID(
      overrides?: TransactionOverrides
    ): Promise<{
      model: BigNumber;
      id: BigNumber;
      0: BigNumber;
      1: BigNumber;
    }>;

    "connectorID()"(
      overrides?: TransactionOverrides
    ): Promise<{
      model: BigNumber;
      id: BigNumber;
      0: BigNumber;
      1: BigNumber;
    }>;
  };

  connectorID(
    overrides?: TransactionOverrides
  ): Promise<{
    model: BigNumber;
    id: BigNumber;
    0: BigNumber;
    1: BigNumber;
  }>;

  "connectorID()"(
    overrides?: TransactionOverrides
  ): Promise<{
    model: BigNumber;
    id: BigNumber;
    0: BigNumber;
    1: BigNumber;
  }>;

  filters: {};

  estimate: {
    connectorID(overrides?: TransactionOverrides): Promise<BigNumber>;

    "connectorID()"(overrides?: TransactionOverrides): Promise<BigNumber>;
  };
}
