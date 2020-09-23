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

interface AccountInterfaceInterface extends Interface {
  functions: {
    cast: TypedFunctionDescription<{
      encode([_targets, _datas, _origin]: [
        string[],
        Arrayish[],
        string
      ]): string;
    }>;

    isAuth: TypedFunctionDescription<{ encode([user]: [string]): string }>;

    shield: TypedFunctionDescription<{ encode([]: []): string }>;

    version: TypedFunctionDescription<{ encode([]: []): string }>;
  };

  events: {};
}

export class AccountInterface extends Contract {
  connect(signerOrProvider: Signer | Provider | string): AccountInterface;
  attach(addressOrName: string): AccountInterface;
  deployed(): Promise<AccountInterface>;

  on(event: EventFilter | string, listener: Listener): AccountInterface;
  once(event: EventFilter | string, listener: Listener): AccountInterface;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): AccountInterface;
  removeAllListeners(eventName: EventFilter | string): AccountInterface;
  removeListener(eventName: any, listener: Listener): AccountInterface;

  interface: AccountInterfaceInterface;

  functions: {
    cast(
      _targets: string[],
      _datas: Arrayish[],
      _origin: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "cast(address[],bytes[],address)"(
      _targets: string[],
      _datas: Arrayish[],
      _origin: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    isAuth(user: string, overrides?: TransactionOverrides): Promise<boolean>;

    "isAuth(address)"(
      user: string,
      overrides?: TransactionOverrides
    ): Promise<boolean>;

    shield(overrides?: TransactionOverrides): Promise<boolean>;

    "shield()"(overrides?: TransactionOverrides): Promise<boolean>;

    version(overrides?: TransactionOverrides): Promise<BigNumber>;

    "version()"(overrides?: TransactionOverrides): Promise<BigNumber>;
  };

  cast(
    _targets: string[],
    _datas: Arrayish[],
    _origin: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "cast(address[],bytes[],address)"(
    _targets: string[],
    _datas: Arrayish[],
    _origin: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  isAuth(user: string, overrides?: TransactionOverrides): Promise<boolean>;

  "isAuth(address)"(
    user: string,
    overrides?: TransactionOverrides
  ): Promise<boolean>;

  shield(overrides?: TransactionOverrides): Promise<boolean>;

  "shield()"(overrides?: TransactionOverrides): Promise<boolean>;

  version(overrides?: TransactionOverrides): Promise<BigNumber>;

  "version()"(overrides?: TransactionOverrides): Promise<BigNumber>;

  filters: {};

  estimate: {
    cast(
      _targets: string[],
      _datas: Arrayish[],
      _origin: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "cast(address[],bytes[],address)"(
      _targets: string[],
      _datas: Arrayish[],
      _origin: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    isAuth(user: string, overrides?: TransactionOverrides): Promise<BigNumber>;

    "isAuth(address)"(
      user: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    shield(overrides?: TransactionOverrides): Promise<BigNumber>;

    "shield()"(overrides?: TransactionOverrides): Promise<BigNumber>;

    version(overrides?: TransactionOverrides): Promise<BigNumber>;

    "version()"(overrides?: TransactionOverrides): Promise<BigNumber>;
  };
}
