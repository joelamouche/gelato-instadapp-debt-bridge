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

interface ProviderModuleDsaInterface extends Interface {
  functions: {
    execPayload: TypedFunctionDescription<{
      encode([, , , _task]: [
        BigNumberish,
        string,
        string,
        {
          conditions: { inst: string; data: Arrayish }[];
          actions: {
            addr: string;
            data: Arrayish;
            operation: BigNumberish;
            dataFlow: BigNumberish;
            value: BigNumberish;
            termsOkCheck: boolean;
          }[];
          selfProviderGasLimit: BigNumberish;
          selfProviderGasPriceCeil: BigNumberish;
        },
        BigNumberish
      ]): string;
    }>;

    execRevertCheck: TypedFunctionDescription<{
      encode([]: [Arrayish]): string;
    }>;

    gelatoCore: TypedFunctionDescription<{ encode([]: []): string }>;

    index: TypedFunctionDescription<{ encode([]: []): string }>;

    isProvided: TypedFunctionDescription<{
      encode([_userProxy, , _task]: [
        string,
        string,
        {
          conditions: { inst: string; data: Arrayish }[];
          actions: {
            addr: string;
            data: Arrayish;
            operation: BigNumberish;
            dataFlow: BigNumberish;
            value: BigNumberish;
            termsOkCheck: boolean;
          }[];
          selfProviderGasLimit: BigNumberish;
          selfProviderGasPriceCeil: BigNumberish;
        }
      ]): string;
    }>;
  };

  events: {};
}

export class ProviderModuleDsa extends Contract {
  connect(signerOrProvider: Signer | Provider | string): ProviderModuleDsa;
  attach(addressOrName: string): ProviderModuleDsa;
  deployed(): Promise<ProviderModuleDsa>;

  on(event: EventFilter | string, listener: Listener): ProviderModuleDsa;
  once(event: EventFilter | string, listener: Listener): ProviderModuleDsa;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): ProviderModuleDsa;
  removeAllListeners(eventName: EventFilter | string): ProviderModuleDsa;
  removeListener(eventName: any, listener: Listener): ProviderModuleDsa;

  interface: ProviderModuleDsaInterface;

  functions: {
    execPayload(
      arg0: BigNumberish,
      arg1: string,
      arg2: string,
      _task: {
        conditions: { inst: string; data: Arrayish }[];
        actions: {
          addr: string;
          data: Arrayish;
          operation: BigNumberish;
          dataFlow: BigNumberish;
          value: BigNumberish;
          termsOkCheck: boolean;
        }[];
        selfProviderGasLimit: BigNumberish;
        selfProviderGasPriceCeil: BigNumberish;
      },
      arg4: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<{
      payload: string;
      0: string;
      1: boolean;
    }>;

    "execPayload(uint256,address,address,tuple,uint256)"(
      arg0: BigNumberish,
      arg1: string,
      arg2: string,
      _task: {
        conditions: { inst: string; data: Arrayish }[];
        actions: {
          addr: string;
          data: Arrayish;
          operation: BigNumberish;
          dataFlow: BigNumberish;
          value: BigNumberish;
          termsOkCheck: boolean;
        }[];
        selfProviderGasLimit: BigNumberish;
        selfProviderGasPriceCeil: BigNumberish;
      },
      arg4: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<{
      payload: string;
      0: string;
      1: boolean;
    }>;

    execRevertCheck(
      arg0: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<void>;

    "execRevertCheck(bytes)"(
      arg0: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<void>;

    gelatoCore(overrides?: TransactionOverrides): Promise<string>;

    "gelatoCore()"(overrides?: TransactionOverrides): Promise<string>;

    index(overrides?: TransactionOverrides): Promise<string>;

    "index()"(overrides?: TransactionOverrides): Promise<string>;

    isProvided(
      _userProxy: string,
      arg1: string,
      _task: {
        conditions: { inst: string; data: Arrayish }[];
        actions: {
          addr: string;
          data: Arrayish;
          operation: BigNumberish;
          dataFlow: BigNumberish;
          value: BigNumberish;
          termsOkCheck: boolean;
        }[];
        selfProviderGasLimit: BigNumberish;
        selfProviderGasPriceCeil: BigNumberish;
      },
      overrides?: TransactionOverrides
    ): Promise<string>;

    "isProvided(address,address,tuple)"(
      _userProxy: string,
      arg1: string,
      _task: {
        conditions: { inst: string; data: Arrayish }[];
        actions: {
          addr: string;
          data: Arrayish;
          operation: BigNumberish;
          dataFlow: BigNumberish;
          value: BigNumberish;
          termsOkCheck: boolean;
        }[];
        selfProviderGasLimit: BigNumberish;
        selfProviderGasPriceCeil: BigNumberish;
      },
      overrides?: TransactionOverrides
    ): Promise<string>;
  };

  execPayload(
    arg0: BigNumberish,
    arg1: string,
    arg2: string,
    _task: {
      conditions: { inst: string; data: Arrayish }[];
      actions: {
        addr: string;
        data: Arrayish;
        operation: BigNumberish;
        dataFlow: BigNumberish;
        value: BigNumberish;
        termsOkCheck: boolean;
      }[];
      selfProviderGasLimit: BigNumberish;
      selfProviderGasPriceCeil: BigNumberish;
    },
    arg4: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<{
    payload: string;
    0: string;
    1: boolean;
  }>;

  "execPayload(uint256,address,address,tuple,uint256)"(
    arg0: BigNumberish,
    arg1: string,
    arg2: string,
    _task: {
      conditions: { inst: string; data: Arrayish }[];
      actions: {
        addr: string;
        data: Arrayish;
        operation: BigNumberish;
        dataFlow: BigNumberish;
        value: BigNumberish;
        termsOkCheck: boolean;
      }[];
      selfProviderGasLimit: BigNumberish;
      selfProviderGasPriceCeil: BigNumberish;
    },
    arg4: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<{
    payload: string;
    0: string;
    1: boolean;
  }>;

  execRevertCheck(
    arg0: Arrayish,
    overrides?: TransactionOverrides
  ): Promise<void>;

  "execRevertCheck(bytes)"(
    arg0: Arrayish,
    overrides?: TransactionOverrides
  ): Promise<void>;

  gelatoCore(overrides?: TransactionOverrides): Promise<string>;

  "gelatoCore()"(overrides?: TransactionOverrides): Promise<string>;

  index(overrides?: TransactionOverrides): Promise<string>;

  "index()"(overrides?: TransactionOverrides): Promise<string>;

  isProvided(
    _userProxy: string,
    arg1: string,
    _task: {
      conditions: { inst: string; data: Arrayish }[];
      actions: {
        addr: string;
        data: Arrayish;
        operation: BigNumberish;
        dataFlow: BigNumberish;
        value: BigNumberish;
        termsOkCheck: boolean;
      }[];
      selfProviderGasLimit: BigNumberish;
      selfProviderGasPriceCeil: BigNumberish;
    },
    overrides?: TransactionOverrides
  ): Promise<string>;

  "isProvided(address,address,tuple)"(
    _userProxy: string,
    arg1: string,
    _task: {
      conditions: { inst: string; data: Arrayish }[];
      actions: {
        addr: string;
        data: Arrayish;
        operation: BigNumberish;
        dataFlow: BigNumberish;
        value: BigNumberish;
        termsOkCheck: boolean;
      }[];
      selfProviderGasLimit: BigNumberish;
      selfProviderGasPriceCeil: BigNumberish;
    },
    overrides?: TransactionOverrides
  ): Promise<string>;

  filters: {};

  estimate: {
    execPayload(
      arg0: BigNumberish,
      arg1: string,
      arg2: string,
      _task: {
        conditions: { inst: string; data: Arrayish }[];
        actions: {
          addr: string;
          data: Arrayish;
          operation: BigNumberish;
          dataFlow: BigNumberish;
          value: BigNumberish;
          termsOkCheck: boolean;
        }[];
        selfProviderGasLimit: BigNumberish;
        selfProviderGasPriceCeil: BigNumberish;
      },
      arg4: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "execPayload(uint256,address,address,tuple,uint256)"(
      arg0: BigNumberish,
      arg1: string,
      arg2: string,
      _task: {
        conditions: { inst: string; data: Arrayish }[];
        actions: {
          addr: string;
          data: Arrayish;
          operation: BigNumberish;
          dataFlow: BigNumberish;
          value: BigNumberish;
          termsOkCheck: boolean;
        }[];
        selfProviderGasLimit: BigNumberish;
        selfProviderGasPriceCeil: BigNumberish;
      },
      arg4: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    execRevertCheck(
      arg0: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "execRevertCheck(bytes)"(
      arg0: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    gelatoCore(overrides?: TransactionOverrides): Promise<BigNumber>;

    "gelatoCore()"(overrides?: TransactionOverrides): Promise<BigNumber>;

    index(overrides?: TransactionOverrides): Promise<BigNumber>;

    "index()"(overrides?: TransactionOverrides): Promise<BigNumber>;

    isProvided(
      _userProxy: string,
      arg1: string,
      _task: {
        conditions: { inst: string; data: Arrayish }[];
        actions: {
          addr: string;
          data: Arrayish;
          operation: BigNumberish;
          dataFlow: BigNumberish;
          value: BigNumberish;
          termsOkCheck: boolean;
        }[];
        selfProviderGasLimit: BigNumberish;
        selfProviderGasPriceCeil: BigNumberish;
      },
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "isProvided(address,address,tuple)"(
      _userProxy: string,
      arg1: string,
      _task: {
        conditions: { inst: string; data: Arrayish }[];
        actions: {
          addr: string;
          data: Arrayish;
          operation: BigNumberish;
          dataFlow: BigNumberish;
          value: BigNumberish;
          termsOkCheck: boolean;
        }[];
        selfProviderGasLimit: BigNumberish;
        selfProviderGasPriceCeil: BigNumberish;
      },
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;
  };
}