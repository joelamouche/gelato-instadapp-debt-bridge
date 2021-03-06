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

interface GelatoProviderModuleStandardInterface extends Interface {
  functions: {
    execPayload: TypedFunctionDescription<{
      encode([, , , ,]: [
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

    isProvided: TypedFunctionDescription<{
      encode([, ,]: [
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

export class GelatoProviderModuleStandard extends Contract {
  connect(
    signerOrProvider: Signer | Provider | string
  ): GelatoProviderModuleStandard;
  attach(addressOrName: string): GelatoProviderModuleStandard;
  deployed(): Promise<GelatoProviderModuleStandard>;

  on(
    event: EventFilter | string,
    listener: Listener
  ): GelatoProviderModuleStandard;
  once(
    event: EventFilter | string,
    listener: Listener
  ): GelatoProviderModuleStandard;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): GelatoProviderModuleStandard;
  removeAllListeners(
    eventName: EventFilter | string
  ): GelatoProviderModuleStandard;
  removeListener(
    eventName: any,
    listener: Listener
  ): GelatoProviderModuleStandard;

  interface: GelatoProviderModuleStandardInterface;

  functions: {
    execPayload(
      arg0: BigNumberish,
      arg1: string,
      arg2: string,
      arg3: {
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
      arg3: {
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

    isProvided(
      arg0: string,
      arg1: string,
      arg2: {
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
      arg0: string,
      arg1: string,
      arg2: {
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
    arg3: {
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
    arg3: {
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

  isProvided(
    arg0: string,
    arg1: string,
    arg2: {
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
    arg0: string,
    arg1: string,
    arg2: {
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
      arg3: {
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
      arg3: {
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

    isProvided(
      arg0: string,
      arg1: string,
      arg2: {
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
      arg0: string,
      arg1: string,
      arg2: {
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
