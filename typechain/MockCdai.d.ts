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

interface MockCdaiInterface extends Interface {
  functions: {
    setSupplyRatePerSecond: TypedFunctionDescription<{
      encode([_rate]: [BigNumberish]): string;
    }>;

    supplyRatePerSecond: TypedFunctionDescription<{ encode([]: []): string }>;
  };

  events: {};
}

export class MockCdai extends Contract {
  connect(signerOrProvider: Signer | Provider | string): MockCdai;
  attach(addressOrName: string): MockCdai;
  deployed(): Promise<MockCdai>;

  on(event: EventFilter | string, listener: Listener): MockCdai;
  once(event: EventFilter | string, listener: Listener): MockCdai;
  addListener(eventName: EventFilter | string, listener: Listener): MockCdai;
  removeAllListeners(eventName: EventFilter | string): MockCdai;
  removeListener(eventName: any, listener: Listener): MockCdai;

  interface: MockCdaiInterface;

  functions: {
    setSupplyRatePerSecond(
      _rate: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "setSupplyRatePerSecond(uint256)"(
      _rate: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    supplyRatePerSecond(overrides?: TransactionOverrides): Promise<BigNumber>;

    "supplyRatePerSecond()"(
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;
  };

  setSupplyRatePerSecond(
    _rate: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "setSupplyRatePerSecond(uint256)"(
    _rate: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  supplyRatePerSecond(overrides?: TransactionOverrides): Promise<BigNumber>;

  "supplyRatePerSecond()"(overrides?: TransactionOverrides): Promise<BigNumber>;

  filters: {};

  estimate: {
    setSupplyRatePerSecond(
      _rate: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "setSupplyRatePerSecond(uint256)"(
      _rate: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    supplyRatePerSecond(overrides?: TransactionOverrides): Promise<BigNumber>;

    "supplyRatePerSecond()"(
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;
  };
}
