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

interface IGelatoConditionInterface extends Interface {
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

export class IGelatoCondition extends Contract {
  connect(signerOrProvider: Signer | Provider | string): IGelatoCondition;
  attach(addressOrName: string): IGelatoCondition;
  deployed(): Promise<IGelatoCondition>;

  on(event: EventFilter | string, listener: Listener): IGelatoCondition;
  once(event: EventFilter | string, listener: Listener): IGelatoCondition;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): IGelatoCondition;
  removeAllListeners(eventName: EventFilter | string): IGelatoCondition;
  removeListener(eventName: any, listener: Listener): IGelatoCondition;

  interface: IGelatoConditionInterface;

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