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

interface ConnectGelatoInterface extends Interface {
  functions: {
    connectorID: TypedFunctionDescription<{ encode([]: []): string }>;

    multiCancelTasks: TypedFunctionDescription<{
      encode([_taskReceipts]: [
        {
          id: BigNumberish;
          userProxy: string;
          provider: { addr: string; module: string };
          index: BigNumberish;
          tasks: {
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
          }[];
          expiryDate: BigNumberish;
          cycleId: BigNumberish;
          submissionsLeft: BigNumberish;
        }[]
      ]): string;
    }>;

    multiProvide: TypedFunctionDescription<{
      encode([_executor, _taskSpecs, _modules, _ethToDeposit, _getId, _setId]: [
        string,
        {
          conditions: string[];
          actions: {
            addr: string;
            data: Arrayish;
            operation: BigNumberish;
            dataFlow: BigNumberish;
            value: BigNumberish;
            termsOkCheck: boolean;
          }[];
          gasPriceCeil: BigNumberish;
        }[],
        string[],
        BigNumberish,
        BigNumberish,
        BigNumberish
      ]): string;
    }>;

    multiUnprovide: TypedFunctionDescription<{
      encode([_withdrawAmount, _taskSpecs, _modules, _getId, _setId]: [
        BigNumberish,
        {
          conditions: string[];
          actions: {
            addr: string;
            data: Arrayish;
            operation: BigNumberish;
            dataFlow: BigNumberish;
            value: BigNumberish;
            termsOkCheck: boolean;
          }[];
          gasPriceCeil: BigNumberish;
        }[],
        string[],
        BigNumberish,
        BigNumberish
      ]): string;
    }>;

    name: TypedFunctionDescription<{ encode([]: []): string }>;

    submitTask: TypedFunctionDescription<{
      encode([_provider, _task, _expiryDate]: [
        { addr: string; module: string },
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

    submitTaskChain: TypedFunctionDescription<{
      encode([_provider, _tasks, _expiryDate, _sumOfRequestedTaskSubmits]: [
        { addr: string; module: string },
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
        }[],
        BigNumberish,
        BigNumberish
      ]): string;
    }>;

    submitTaskCycle: TypedFunctionDescription<{
      encode([_provider, _tasks, _expiryDate, _cycles]: [
        { addr: string; module: string },
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
        }[],
        BigNumberish,
        BigNumberish
      ]): string;
    }>;
  };

  events: {
    LogMultiCancelTasks: TypedEventDescription<{
      encodeTopics([taskReceipt, getId, setId]: [
        (
          | {
              id: BigNumberish;
              userProxy: string;
              provider: { addr: string; module: string };
              index: BigNumberish;
              tasks: {
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
              }[];
              expiryDate: BigNumberish;
              cycleId: BigNumberish;
              submissionsLeft: BigNumberish;
            }[]
          | null
        ),
        null,
        null
      ]): string[];
    }>;

    LogMultiProvide: TypedEventDescription<{
      encodeTopics([executor, taskspecs, modules, ethToDeposit, getId, setId]: [
        string | null,
        (
          | {
              conditions: string[];
              actions: {
                addr: string;
                data: Arrayish;
                operation: BigNumberish;
                dataFlow: BigNumberish;
                value: BigNumberish;
                termsOkCheck: boolean;
              }[];
              gasPriceCeil: BigNumberish;
            }[]
          | null
        ),
        string[] | null,
        null,
        null,
        null
      ]): string[];
    }>;

    LogMultiUnprovide: TypedEventDescription<{
      encodeTopics([taskspecs, modules, ethToWithdraw, getId, setId]: [
        (
          | {
              conditions: string[];
              actions: {
                addr: string;
                data: Arrayish;
                operation: BigNumberish;
                dataFlow: BigNumberish;
                value: BigNumberish;
                termsOkCheck: boolean;
              }[];
              gasPriceCeil: BigNumberish;
            }[]
          | null
        ),
        string[] | null,
        null,
        null,
        null
      ]): string[];
    }>;

    LogSubmitTask: TypedEventDescription<{
      encodeTopics([provider, task, expiryDate, getId, setId]: [
        { addr: string; module: string } | null,
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
        } | null,
        BigNumberish | null,
        null,
        null
      ]): string[];
    }>;

    LogSubmitTaskChain: TypedEventDescription<{
      encodeTopics([provider, tasks, expiryDate, getId, setId]: [
        { addr: string; module: string } | null,
        (
          | {
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
            }[]
          | null
        ),
        BigNumberish | null,
        null,
        null
      ]): string[];
    }>;

    LogSubmitTaskCycle: TypedEventDescription<{
      encodeTopics([provider, tasks, expiryDate, getId, setId]: [
        { addr: string; module: string } | null,
        (
          | {
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
            }[]
          | null
        ),
        BigNumberish | null,
        null,
        null
      ]): string[];
    }>;
  };
}

export class ConnectGelato extends Contract {
  connect(signerOrProvider: Signer | Provider | string): ConnectGelato;
  attach(addressOrName: string): ConnectGelato;
  deployed(): Promise<ConnectGelato>;

  on(event: EventFilter | string, listener: Listener): ConnectGelato;
  once(event: EventFilter | string, listener: Listener): ConnectGelato;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): ConnectGelato;
  removeAllListeners(eventName: EventFilter | string): ConnectGelato;
  removeListener(eventName: any, listener: Listener): ConnectGelato;

  interface: ConnectGelatoInterface;

  functions: {
    connectorID(
      overrides?: TransactionOverrides
    ): Promise<{
      _type: BigNumber;
      _id: BigNumber;
      0: BigNumber;
      1: BigNumber;
    }>;

    "connectorID()"(
      overrides?: TransactionOverrides
    ): Promise<{
      _type: BigNumber;
      _id: BigNumber;
      0: BigNumber;
      1: BigNumber;
    }>;

    multiCancelTasks(
      _taskReceipts: {
        id: BigNumberish;
        userProxy: string;
        provider: { addr: string; module: string };
        index: BigNumberish;
        tasks: {
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
        }[];
        expiryDate: BigNumberish;
        cycleId: BigNumberish;
        submissionsLeft: BigNumberish;
      }[],
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "multiCancelTasks(tuple[])"(
      _taskReceipts: {
        id: BigNumberish;
        userProxy: string;
        provider: { addr: string; module: string };
        index: BigNumberish;
        tasks: {
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
        }[];
        expiryDate: BigNumberish;
        cycleId: BigNumberish;
        submissionsLeft: BigNumberish;
      }[],
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    multiProvide(
      _executor: string,
      _taskSpecs: {
        conditions: string[];
        actions: {
          addr: string;
          data: Arrayish;
          operation: BigNumberish;
          dataFlow: BigNumberish;
          value: BigNumberish;
          termsOkCheck: boolean;
        }[];
        gasPriceCeil: BigNumberish;
      }[],
      _modules: string[],
      _ethToDeposit: BigNumberish,
      _getId: BigNumberish,
      _setId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "multiProvide(address,tuple[],address[],uint256,uint256,uint256)"(
      _executor: string,
      _taskSpecs: {
        conditions: string[];
        actions: {
          addr: string;
          data: Arrayish;
          operation: BigNumberish;
          dataFlow: BigNumberish;
          value: BigNumberish;
          termsOkCheck: boolean;
        }[];
        gasPriceCeil: BigNumberish;
      }[],
      _modules: string[],
      _ethToDeposit: BigNumberish,
      _getId: BigNumberish,
      _setId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    multiUnprovide(
      _withdrawAmount: BigNumberish,
      _taskSpecs: {
        conditions: string[];
        actions: {
          addr: string;
          data: Arrayish;
          operation: BigNumberish;
          dataFlow: BigNumberish;
          value: BigNumberish;
          termsOkCheck: boolean;
        }[];
        gasPriceCeil: BigNumberish;
      }[],
      _modules: string[],
      _getId: BigNumberish,
      _setId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "multiUnprovide(uint256,tuple[],address[],uint256,uint256)"(
      _withdrawAmount: BigNumberish,
      _taskSpecs: {
        conditions: string[];
        actions: {
          addr: string;
          data: Arrayish;
          operation: BigNumberish;
          dataFlow: BigNumberish;
          value: BigNumberish;
          termsOkCheck: boolean;
        }[];
        gasPriceCeil: BigNumberish;
      }[],
      _modules: string[],
      _getId: BigNumberish,
      _setId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    name(overrides?: TransactionOverrides): Promise<string>;

    "name()"(overrides?: TransactionOverrides): Promise<string>;

    submitTask(
      _provider: { addr: string; module: string },
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
      _expiryDate: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "submitTask(tuple,tuple,uint256)"(
      _provider: { addr: string; module: string },
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
      _expiryDate: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    submitTaskChain(
      _provider: { addr: string; module: string },
      _tasks: {
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
      }[],
      _expiryDate: BigNumberish,
      _sumOfRequestedTaskSubmits: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "submitTaskChain(tuple,tuple[],uint256,uint256)"(
      _provider: { addr: string; module: string },
      _tasks: {
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
      }[],
      _expiryDate: BigNumberish,
      _sumOfRequestedTaskSubmits: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    submitTaskCycle(
      _provider: { addr: string; module: string },
      _tasks: {
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
      }[],
      _expiryDate: BigNumberish,
      _cycles: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "submitTaskCycle(tuple,tuple[],uint256,uint256)"(
      _provider: { addr: string; module: string },
      _tasks: {
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
      }[],
      _expiryDate: BigNumberish,
      _cycles: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;
  };

  connectorID(
    overrides?: TransactionOverrides
  ): Promise<{
    _type: BigNumber;
    _id: BigNumber;
    0: BigNumber;
    1: BigNumber;
  }>;

  "connectorID()"(
    overrides?: TransactionOverrides
  ): Promise<{
    _type: BigNumber;
    _id: BigNumber;
    0: BigNumber;
    1: BigNumber;
  }>;

  multiCancelTasks(
    _taskReceipts: {
      id: BigNumberish;
      userProxy: string;
      provider: { addr: string; module: string };
      index: BigNumberish;
      tasks: {
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
      }[];
      expiryDate: BigNumberish;
      cycleId: BigNumberish;
      submissionsLeft: BigNumberish;
    }[],
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "multiCancelTasks(tuple[])"(
    _taskReceipts: {
      id: BigNumberish;
      userProxy: string;
      provider: { addr: string; module: string };
      index: BigNumberish;
      tasks: {
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
      }[];
      expiryDate: BigNumberish;
      cycleId: BigNumberish;
      submissionsLeft: BigNumberish;
    }[],
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  multiProvide(
    _executor: string,
    _taskSpecs: {
      conditions: string[];
      actions: {
        addr: string;
        data: Arrayish;
        operation: BigNumberish;
        dataFlow: BigNumberish;
        value: BigNumberish;
        termsOkCheck: boolean;
      }[];
      gasPriceCeil: BigNumberish;
    }[],
    _modules: string[],
    _ethToDeposit: BigNumberish,
    _getId: BigNumberish,
    _setId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "multiProvide(address,tuple[],address[],uint256,uint256,uint256)"(
    _executor: string,
    _taskSpecs: {
      conditions: string[];
      actions: {
        addr: string;
        data: Arrayish;
        operation: BigNumberish;
        dataFlow: BigNumberish;
        value: BigNumberish;
        termsOkCheck: boolean;
      }[];
      gasPriceCeil: BigNumberish;
    }[],
    _modules: string[],
    _ethToDeposit: BigNumberish,
    _getId: BigNumberish,
    _setId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  multiUnprovide(
    _withdrawAmount: BigNumberish,
    _taskSpecs: {
      conditions: string[];
      actions: {
        addr: string;
        data: Arrayish;
        operation: BigNumberish;
        dataFlow: BigNumberish;
        value: BigNumberish;
        termsOkCheck: boolean;
      }[];
      gasPriceCeil: BigNumberish;
    }[],
    _modules: string[],
    _getId: BigNumberish,
    _setId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "multiUnprovide(uint256,tuple[],address[],uint256,uint256)"(
    _withdrawAmount: BigNumberish,
    _taskSpecs: {
      conditions: string[];
      actions: {
        addr: string;
        data: Arrayish;
        operation: BigNumberish;
        dataFlow: BigNumberish;
        value: BigNumberish;
        termsOkCheck: boolean;
      }[];
      gasPriceCeil: BigNumberish;
    }[],
    _modules: string[],
    _getId: BigNumberish,
    _setId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  name(overrides?: TransactionOverrides): Promise<string>;

  "name()"(overrides?: TransactionOverrides): Promise<string>;

  submitTask(
    _provider: { addr: string; module: string },
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
    _expiryDate: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "submitTask(tuple,tuple,uint256)"(
    _provider: { addr: string; module: string },
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
    _expiryDate: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  submitTaskChain(
    _provider: { addr: string; module: string },
    _tasks: {
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
    }[],
    _expiryDate: BigNumberish,
    _sumOfRequestedTaskSubmits: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "submitTaskChain(tuple,tuple[],uint256,uint256)"(
    _provider: { addr: string; module: string },
    _tasks: {
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
    }[],
    _expiryDate: BigNumberish,
    _sumOfRequestedTaskSubmits: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  submitTaskCycle(
    _provider: { addr: string; module: string },
    _tasks: {
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
    }[],
    _expiryDate: BigNumberish,
    _cycles: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "submitTaskCycle(tuple,tuple[],uint256,uint256)"(
    _provider: { addr: string; module: string },
    _tasks: {
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
    }[],
    _expiryDate: BigNumberish,
    _cycles: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  filters: {
    LogMultiCancelTasks(
      taskReceipt:
        | {
            id: BigNumberish;
            userProxy: string;
            provider: { addr: string; module: string };
            index: BigNumberish;
            tasks: {
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
            }[];
            expiryDate: BigNumberish;
            cycleId: BigNumberish;
            submissionsLeft: BigNumberish;
          }[]
        | null,
      getId: null,
      setId: null
    ): EventFilter;

    LogMultiProvide(
      executor: string | null,
      taskspecs:
        | {
            conditions: string[];
            actions: {
              addr: string;
              data: Arrayish;
              operation: BigNumberish;
              dataFlow: BigNumberish;
              value: BigNumberish;
              termsOkCheck: boolean;
            }[];
            gasPriceCeil: BigNumberish;
          }[]
        | null,
      modules: string[] | null,
      ethToDeposit: null,
      getId: null,
      setId: null
    ): EventFilter;

    LogMultiUnprovide(
      taskspecs:
        | {
            conditions: string[];
            actions: {
              addr: string;
              data: Arrayish;
              operation: BigNumberish;
              dataFlow: BigNumberish;
              value: BigNumberish;
              termsOkCheck: boolean;
            }[];
            gasPriceCeil: BigNumberish;
          }[]
        | null,
      modules: string[] | null,
      ethToWithdraw: null,
      getId: null,
      setId: null
    ): EventFilter;

    LogSubmitTask(
      provider: { addr: string; module: string } | null,
      task: {
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
      } | null,
      expiryDate: BigNumberish | null,
      getId: null,
      setId: null
    ): EventFilter;

    LogSubmitTaskChain(
      provider: { addr: string; module: string } | null,
      tasks:
        | {
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
          }[]
        | null,
      expiryDate: BigNumberish | null,
      getId: null,
      setId: null
    ): EventFilter;

    LogSubmitTaskCycle(
      provider: { addr: string; module: string } | null,
      tasks:
        | {
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
          }[]
        | null,
      expiryDate: BigNumberish | null,
      getId: null,
      setId: null
    ): EventFilter;
  };

  estimate: {
    connectorID(overrides?: TransactionOverrides): Promise<BigNumber>;

    "connectorID()"(overrides?: TransactionOverrides): Promise<BigNumber>;

    multiCancelTasks(
      _taskReceipts: {
        id: BigNumberish;
        userProxy: string;
        provider: { addr: string; module: string };
        index: BigNumberish;
        tasks: {
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
        }[];
        expiryDate: BigNumberish;
        cycleId: BigNumberish;
        submissionsLeft: BigNumberish;
      }[],
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "multiCancelTasks(tuple[])"(
      _taskReceipts: {
        id: BigNumberish;
        userProxy: string;
        provider: { addr: string; module: string };
        index: BigNumberish;
        tasks: {
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
        }[];
        expiryDate: BigNumberish;
        cycleId: BigNumberish;
        submissionsLeft: BigNumberish;
      }[],
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    multiProvide(
      _executor: string,
      _taskSpecs: {
        conditions: string[];
        actions: {
          addr: string;
          data: Arrayish;
          operation: BigNumberish;
          dataFlow: BigNumberish;
          value: BigNumberish;
          termsOkCheck: boolean;
        }[];
        gasPriceCeil: BigNumberish;
      }[],
      _modules: string[],
      _ethToDeposit: BigNumberish,
      _getId: BigNumberish,
      _setId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "multiProvide(address,tuple[],address[],uint256,uint256,uint256)"(
      _executor: string,
      _taskSpecs: {
        conditions: string[];
        actions: {
          addr: string;
          data: Arrayish;
          operation: BigNumberish;
          dataFlow: BigNumberish;
          value: BigNumberish;
          termsOkCheck: boolean;
        }[];
        gasPriceCeil: BigNumberish;
      }[],
      _modules: string[],
      _ethToDeposit: BigNumberish,
      _getId: BigNumberish,
      _setId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    multiUnprovide(
      _withdrawAmount: BigNumberish,
      _taskSpecs: {
        conditions: string[];
        actions: {
          addr: string;
          data: Arrayish;
          operation: BigNumberish;
          dataFlow: BigNumberish;
          value: BigNumberish;
          termsOkCheck: boolean;
        }[];
        gasPriceCeil: BigNumberish;
      }[],
      _modules: string[],
      _getId: BigNumberish,
      _setId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "multiUnprovide(uint256,tuple[],address[],uint256,uint256)"(
      _withdrawAmount: BigNumberish,
      _taskSpecs: {
        conditions: string[];
        actions: {
          addr: string;
          data: Arrayish;
          operation: BigNumberish;
          dataFlow: BigNumberish;
          value: BigNumberish;
          termsOkCheck: boolean;
        }[];
        gasPriceCeil: BigNumberish;
      }[],
      _modules: string[],
      _getId: BigNumberish,
      _setId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    name(overrides?: TransactionOverrides): Promise<BigNumber>;

    "name()"(overrides?: TransactionOverrides): Promise<BigNumber>;

    submitTask(
      _provider: { addr: string; module: string },
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
      _expiryDate: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "submitTask(tuple,tuple,uint256)"(
      _provider: { addr: string; module: string },
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
      _expiryDate: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    submitTaskChain(
      _provider: { addr: string; module: string },
      _tasks: {
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
      }[],
      _expiryDate: BigNumberish,
      _sumOfRequestedTaskSubmits: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "submitTaskChain(tuple,tuple[],uint256,uint256)"(
      _provider: { addr: string; module: string },
      _tasks: {
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
      }[],
      _expiryDate: BigNumberish,
      _sumOfRequestedTaskSubmits: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    submitTaskCycle(
      _provider: { addr: string; module: string },
      _tasks: {
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
      }[],
      _expiryDate: BigNumberish,
      _cycles: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "submitTaskCycle(tuple,tuple[],uint256,uint256)"(
      _provider: { addr: string; module: string },
      _tasks: {
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
      }[],
      _expiryDate: BigNumberish,
      _cycles: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;
  };
}
