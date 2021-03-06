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

interface GelatoConditionsStandardInterface extends Interface {
  functions: {
    ok: TypedFunctionDescription<{
      encode([_taskReceiptId, _conditionData, _cycleId]: [
        BigNumberish,
        Arrayish,
        BigNumberish
      ]): string;
    }>;
  };

  events: {};
}

export class GelatoConditionsStandard extends Contract {
  connect(
    signerOrProvider: Signer | Provider | string
  ): GelatoConditionsStandard;
  attach(addressOrName: string): GelatoConditionsStandard;
  deployed(): Promise<GelatoConditionsStandard>;

  on(event: EventFilter | string, listener: Listener): GelatoConditionsStandard;
  once(
    event: EventFilter | string,
    listener: Listener
  ): GelatoConditionsStandard;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): GelatoConditionsStandard;
  removeAllListeners(eventName: EventFilter | string): GelatoConditionsStandard;
  removeListener(eventName: any, listener: Listener): GelatoConditionsStandard;

  interface: GelatoConditionsStandardInterface;

  functions: {
    ok(
      _taskReceiptId: BigNumberish,
      _conditionData: Arrayish,
      _cycleId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;

    "ok(uint256,bytes,uint256)"(
      _taskReceiptId: BigNumberish,
      _conditionData: Arrayish,
      _cycleId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;
  };

  ok(
    _taskReceiptId: BigNumberish,
    _conditionData: Arrayish,
    _cycleId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  "ok(uint256,bytes,uint256)"(
    _taskReceiptId: BigNumberish,
    _conditionData: Arrayish,
    _cycleId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  filters: {};

  estimate: {
    ok(
      _taskReceiptId: BigNumberish,
      _conditionData: Arrayish,
      _cycleId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "ok(uint256,bytes,uint256)"(
      _taskReceiptId: BigNumberish,
      _conditionData: Arrayish,
      _cycleId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;
  };
}
