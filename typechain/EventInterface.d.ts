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

interface EventInterfaceInterface extends Interface {
  functions: {
    emitEvent: TypedFunctionDescription<{
      encode([connectorType, connectorID, eventCode, eventData]: [
        BigNumberish,
        BigNumberish,
        Arrayish,
        Arrayish
      ]): string;
    }>;
  };

  events: {};
}

export class EventInterface extends Contract {
  connect(signerOrProvider: Signer | Provider | string): EventInterface;
  attach(addressOrName: string): EventInterface;
  deployed(): Promise<EventInterface>;

  on(event: EventFilter | string, listener: Listener): EventInterface;
  once(event: EventFilter | string, listener: Listener): EventInterface;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): EventInterface;
  removeAllListeners(eventName: EventFilter | string): EventInterface;
  removeListener(eventName: any, listener: Listener): EventInterface;

  interface: EventInterfaceInterface;

  functions: {
    emitEvent(
      connectorType: BigNumberish,
      connectorID: BigNumberish,
      eventCode: Arrayish,
      eventData: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "emitEvent(uint256,uint256,bytes32,bytes)"(
      connectorType: BigNumberish,
      connectorID: BigNumberish,
      eventCode: Arrayish,
      eventData: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;
  };

  emitEvent(
    connectorType: BigNumberish,
    connectorID: BigNumberish,
    eventCode: Arrayish,
    eventData: Arrayish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "emitEvent(uint256,uint256,bytes32,bytes)"(
    connectorType: BigNumberish,
    connectorID: BigNumberish,
    eventCode: Arrayish,
    eventData: Arrayish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  filters: {};

  estimate: {
    emitEvent(
      connectorType: BigNumberish,
      connectorID: BigNumberish,
      eventCode: Arrayish,
      eventData: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "emitEvent(uint256,uint256,bytes32,bytes)"(
      connectorType: BigNumberish,
      connectorID: BigNumberish,
      eventCode: Arrayish,
      eventData: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;
  };
}
