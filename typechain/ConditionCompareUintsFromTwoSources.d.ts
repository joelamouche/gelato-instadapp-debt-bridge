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

interface ConditionCompareUintsFromTwoSourcesInterface extends Interface {
  functions: {
    compare: TypedFunctionDescription<{
      encode([_sourceA, _sourceB, _sourceAData, _sourceBData, _minSpread]: [
        string,
        string,
        Arrayish,
        Arrayish,
        BigNumberish
      ]): string;
    }>;

    getConditionData: TypedFunctionDescription<{
      encode([_sourceA, _sourceB, _sourceAData, _sourceBData, _minSpread]: [
        string,
        string,
        Arrayish,
        Arrayish,
        BigNumberish
      ]): string;
    }>;

    ok: TypedFunctionDescription<{
      encode([, _conditionData]: [
        BigNumberish,
        Arrayish,
        BigNumberish
      ]): string;
    }>;
  };

  events: {};
}

export class ConditionCompareUintsFromTwoSources extends Contract {
  connect(
    signerOrProvider: Signer | Provider | string
  ): ConditionCompareUintsFromTwoSources;
  attach(addressOrName: string): ConditionCompareUintsFromTwoSources;
  deployed(): Promise<ConditionCompareUintsFromTwoSources>;

  on(
    event: EventFilter | string,
    listener: Listener
  ): ConditionCompareUintsFromTwoSources;
  once(
    event: EventFilter | string,
    listener: Listener
  ): ConditionCompareUintsFromTwoSources;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): ConditionCompareUintsFromTwoSources;
  removeAllListeners(
    eventName: EventFilter | string
  ): ConditionCompareUintsFromTwoSources;
  removeListener(
    eventName: any,
    listener: Listener
  ): ConditionCompareUintsFromTwoSources;

  interface: ConditionCompareUintsFromTwoSourcesInterface;

  functions: {
    compare(
      _sourceA: string,
      _sourceB: string,
      _sourceAData: Arrayish,
      _sourceBData: Arrayish,
      _minSpread: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;

    "compare(address,address,bytes,bytes,uint256)"(
      _sourceA: string,
      _sourceB: string,
      _sourceAData: Arrayish,
      _sourceBData: Arrayish,
      _minSpread: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;

    getConditionData(
      _sourceA: string,
      _sourceB: string,
      _sourceAData: Arrayish,
      _sourceBData: Arrayish,
      _minSpread: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;

    "getConditionData(address,address,bytes,bytes,uint256)"(
      _sourceA: string,
      _sourceB: string,
      _sourceAData: Arrayish,
      _sourceBData: Arrayish,
      _minSpread: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;

    ok(
      arg0: BigNumberish,
      _conditionData: Arrayish,
      arg2: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;

    "ok(uint256,bytes,uint256)"(
      arg0: BigNumberish,
      _conditionData: Arrayish,
      arg2: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;
  };

  compare(
    _sourceA: string,
    _sourceB: string,
    _sourceAData: Arrayish,
    _sourceBData: Arrayish,
    _minSpread: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  "compare(address,address,bytes,bytes,uint256)"(
    _sourceA: string,
    _sourceB: string,
    _sourceAData: Arrayish,
    _sourceBData: Arrayish,
    _minSpread: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  getConditionData(
    _sourceA: string,
    _sourceB: string,
    _sourceAData: Arrayish,
    _sourceBData: Arrayish,
    _minSpread: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  "getConditionData(address,address,bytes,bytes,uint256)"(
    _sourceA: string,
    _sourceB: string,
    _sourceAData: Arrayish,
    _sourceBData: Arrayish,
    _minSpread: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  ok(
    arg0: BigNumberish,
    _conditionData: Arrayish,
    arg2: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  "ok(uint256,bytes,uint256)"(
    arg0: BigNumberish,
    _conditionData: Arrayish,
    arg2: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  filters: {};

  estimate: {
    compare(
      _sourceA: string,
      _sourceB: string,
      _sourceAData: Arrayish,
      _sourceBData: Arrayish,
      _minSpread: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "compare(address,address,bytes,bytes,uint256)"(
      _sourceA: string,
      _sourceB: string,
      _sourceAData: Arrayish,
      _sourceBData: Arrayish,
      _minSpread: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    getConditionData(
      _sourceA: string,
      _sourceB: string,
      _sourceAData: Arrayish,
      _sourceBData: Arrayish,
      _minSpread: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "getConditionData(address,address,bytes,bytes,uint256)"(
      _sourceA: string,
      _sourceB: string,
      _sourceAData: Arrayish,
      _sourceBData: Arrayish,
      _minSpread: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    ok(
      arg0: BigNumberish,
      _conditionData: Arrayish,
      arg2: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "ok(uint256,bytes,uint256)"(
      arg0: BigNumberish,
      _conditionData: Arrayish,
      arg2: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;
  };
}
