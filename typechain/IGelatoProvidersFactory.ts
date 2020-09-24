/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, Signer } from "ethers";
import { Provider } from "ethers/providers";

import { IGelatoProviders } from "./IGelatoProviders";

export class IGelatoProvidersFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IGelatoProviders {
    return new Contract(address, _abi, signerOrProvider) as IGelatoProviders;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "oldExecutor",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newExecutor",
        type: "address"
      }
    ],
    name: "LogExecutorAssignedExecutor",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newProviderFunds",
        type: "uint256"
      }
    ],
    name: "LogFundsProvided",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "realWithdrawAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newProviderFunds",
        type: "uint256"
      }
    ],
    name: "LogFundsUnprovided",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "oldExecutor",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newExecutor",
        type: "address"
      }
    ],
    name: "LogProviderAssignedExecutor",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address"
      },
      {
        indexed: true,
        internalType: "contract IGelatoProviderModule",
        name: "module",
        type: "address"
      }
    ],
    name: "LogProviderModuleAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address"
      },
      {
        indexed: true,
        internalType: "contract IGelatoProviderModule",
        name: "module",
        type: "address"
      }
    ],
    name: "LogProviderModuleRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "taskSpecHash",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "oldTaskSpecGasPriceCeil",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newTaskSpecGasPriceCeil",
        type: "uint256"
      }
    ],
    name: "LogTaskSpecGasPriceCeilSet",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address"
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "taskSpecHash",
        type: "bytes32"
      }
    ],
    name: "LogTaskSpecProvided",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address"
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "taskSpecHash",
        type: "bytes32"
      }
    ],
    name: "LogTaskSpecUnprovided",
    type: "event"
  },
  {
    inputs: [],
    name: "NO_CEIL",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IGelatoProviderModule[]",
        name: "_modules",
        type: "address[]"
      }
    ],
    name: "addProviderModules",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_provider",
        type: "address"
      },
      {
        internalType: "address",
        name: "_newExecutor",
        type: "address"
      }
    ],
    name: "executorAssignsExecutor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_provider",
        type: "address"
      }
    ],
    name: "executorByProvider",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_executor",
        type: "address"
      }
    ],
    name: "executorProvidersCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_executor",
        type: "address"
      }
    ],
    name: "executorStake",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "contract IGelatoCondition[]",
            name: "conditions",
            type: "address[]"
          },
          {
            components: [
              {
                internalType: "address",
                name: "addr",
                type: "address"
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes"
              },
              {
                internalType: "enum Operation",
                name: "operation",
                type: "uint8"
              },
              {
                internalType: "enum DataFlow",
                name: "dataFlow",
                type: "uint8"
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256"
              },
              {
                internalType: "bool",
                name: "termsOkCheck",
                type: "bool"
              }
            ],
            internalType: "struct Action[]",
            name: "actions",
            type: "tuple[]"
          },
          {
            internalType: "uint256",
            name: "gasPriceCeil",
            type: "uint256"
          }
        ],
        internalType: "struct TaskSpec",
        name: "_taskSpec",
        type: "tuple"
      }
    ],
    name: "hashTaskSpec",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_executor",
        type: "address"
      }
    ],
    name: "isExecutorAssigned",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_executor",
        type: "address"
      }
    ],
    name: "isExecutorMinStaked",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_provider",
        type: "address"
      },
      {
        internalType: "contract IGelatoProviderModule",
        name: "_module",
        type: "address"
      }
    ],
    name: "isModuleProvided",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_provider",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_gelatoMaxGas",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_gelatoGasPrice",
        type: "uint256"
      }
    ],
    name: "isProviderLiquid",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_userProxy",
        type: "address"
      },
      {
        components: [
          {
            internalType: "address",
            name: "addr",
            type: "address"
          },
          {
            internalType: "contract IGelatoProviderModule",
            name: "module",
            type: "address"
          }
        ],
        internalType: "struct Provider",
        name: "_provider",
        type: "tuple"
      },
      {
        components: [
          {
            components: [
              {
                internalType: "contract IGelatoCondition",
                name: "inst",
                type: "address"
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes"
              }
            ],
            internalType: "struct Condition[]",
            name: "conditions",
            type: "tuple[]"
          },
          {
            components: [
              {
                internalType: "address",
                name: "addr",
                type: "address"
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes"
              },
              {
                internalType: "enum Operation",
                name: "operation",
                type: "uint8"
              },
              {
                internalType: "enum DataFlow",
                name: "dataFlow",
                type: "uint8"
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256"
              },
              {
                internalType: "bool",
                name: "termsOkCheck",
                type: "bool"
              }
            ],
            internalType: "struct Action[]",
            name: "actions",
            type: "tuple[]"
          },
          {
            internalType: "uint256",
            name: "selfProviderGasLimit",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "selfProviderGasPriceCeil",
            type: "uint256"
          }
        ],
        internalType: "struct Task",
        name: "_task",
        type: "tuple"
      }
    ],
    name: "isTaskProvided",
    outputs: [
      {
        internalType: "string",
        name: "res",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_provider",
        type: "address"
      },
      {
        components: [
          {
            internalType: "contract IGelatoCondition[]",
            name: "conditions",
            type: "address[]"
          },
          {
            components: [
              {
                internalType: "address",
                name: "addr",
                type: "address"
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes"
              },
              {
                internalType: "enum Operation",
                name: "operation",
                type: "uint8"
              },
              {
                internalType: "enum DataFlow",
                name: "dataFlow",
                type: "uint8"
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256"
              },
              {
                internalType: "bool",
                name: "termsOkCheck",
                type: "bool"
              }
            ],
            internalType: "struct Action[]",
            name: "actions",
            type: "tuple[]"
          },
          {
            internalType: "uint256",
            name: "gasPriceCeil",
            type: "uint256"
          }
        ],
        internalType: "struct TaskSpec",
        name: "_taskSpec",
        type: "tuple"
      }
    ],
    name: "isTaskSpecProvided",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_gelatoMaxGas",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_gelatoGasPrice",
        type: "uint256"
      }
    ],
    name: "minExecProviderFunds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_executor",
        type: "address"
      },
      {
        components: [
          {
            internalType: "contract IGelatoCondition[]",
            name: "conditions",
            type: "address[]"
          },
          {
            components: [
              {
                internalType: "address",
                name: "addr",
                type: "address"
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes"
              },
              {
                internalType: "enum Operation",
                name: "operation",
                type: "uint8"
              },
              {
                internalType: "enum DataFlow",
                name: "dataFlow",
                type: "uint8"
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256"
              },
              {
                internalType: "bool",
                name: "termsOkCheck",
                type: "bool"
              }
            ],
            internalType: "struct Action[]",
            name: "actions",
            type: "tuple[]"
          },
          {
            internalType: "uint256",
            name: "gasPriceCeil",
            type: "uint256"
          }
        ],
        internalType: "struct TaskSpec[]",
        name: "_taskSpecs",
        type: "tuple[]"
      },
      {
        internalType: "contract IGelatoProviderModule[]",
        name: "_modules",
        type: "address[]"
      }
    ],
    name: "multiProvide",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_withdrawAmount",
        type: "uint256"
      },
      {
        components: [
          {
            internalType: "contract IGelatoCondition[]",
            name: "conditions",
            type: "address[]"
          },
          {
            components: [
              {
                internalType: "address",
                name: "addr",
                type: "address"
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes"
              },
              {
                internalType: "enum Operation",
                name: "operation",
                type: "uint8"
              },
              {
                internalType: "enum DataFlow",
                name: "dataFlow",
                type: "uint8"
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256"
              },
              {
                internalType: "bool",
                name: "termsOkCheck",
                type: "bool"
              }
            ],
            internalType: "struct Action[]",
            name: "actions",
            type: "tuple[]"
          },
          {
            internalType: "uint256",
            name: "gasPriceCeil",
            type: "uint256"
          }
        ],
        internalType: "struct TaskSpec[]",
        name: "_taskSpecs",
        type: "tuple[]"
      },
      {
        internalType: "contract IGelatoProviderModule[]",
        name: "_modules",
        type: "address[]"
      }
    ],
    name: "multiUnprovide",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_provider",
        type: "address"
      }
    ],
    name: "provideFunds",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "contract IGelatoCondition[]",
            name: "conditions",
            type: "address[]"
          },
          {
            components: [
              {
                internalType: "address",
                name: "addr",
                type: "address"
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes"
              },
              {
                internalType: "enum Operation",
                name: "operation",
                type: "uint8"
              },
              {
                internalType: "enum DataFlow",
                name: "dataFlow",
                type: "uint8"
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256"
              },
              {
                internalType: "bool",
                name: "termsOkCheck",
                type: "bool"
              }
            ],
            internalType: "struct Action[]",
            name: "actions",
            type: "tuple[]"
          },
          {
            internalType: "uint256",
            name: "gasPriceCeil",
            type: "uint256"
          }
        ],
        internalType: "struct TaskSpec[]",
        name: "_taskSpecs",
        type: "tuple[]"
      }
    ],
    name: "provideTaskSpecs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_executor",
        type: "address"
      }
    ],
    name: "providerAssignsExecutor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_userProxy",
        type: "address"
      },
      {
        components: [
          {
            internalType: "address",
            name: "addr",
            type: "address"
          },
          {
            internalType: "contract IGelatoProviderModule",
            name: "module",
            type: "address"
          }
        ],
        internalType: "struct Provider",
        name: "_provider",
        type: "tuple"
      },
      {
        components: [
          {
            components: [
              {
                internalType: "contract IGelatoCondition",
                name: "inst",
                type: "address"
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes"
              }
            ],
            internalType: "struct Condition[]",
            name: "conditions",
            type: "tuple[]"
          },
          {
            components: [
              {
                internalType: "address",
                name: "addr",
                type: "address"
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes"
              },
              {
                internalType: "enum Operation",
                name: "operation",
                type: "uint8"
              },
              {
                internalType: "enum DataFlow",
                name: "dataFlow",
                type: "uint8"
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256"
              },
              {
                internalType: "bool",
                name: "termsOkCheck",
                type: "bool"
              }
            ],
            internalType: "struct Action[]",
            name: "actions",
            type: "tuple[]"
          },
          {
            internalType: "uint256",
            name: "selfProviderGasLimit",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "selfProviderGasPriceCeil",
            type: "uint256"
          }
        ],
        internalType: "struct Task",
        name: "_task",
        type: "tuple"
      },
      {
        internalType: "uint256",
        name: "_gelatoGasPrice",
        type: "uint256"
      }
    ],
    name: "providerCanExec",
    outputs: [
      {
        internalType: "string",
        name: "res",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_provider",
        type: "address"
      }
    ],
    name: "providerFunds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_userProxy",
        type: "address"
      },
      {
        components: [
          {
            internalType: "address",
            name: "addr",
            type: "address"
          },
          {
            internalType: "contract IGelatoProviderModule",
            name: "module",
            type: "address"
          }
        ],
        internalType: "struct Provider",
        name: "_provider",
        type: "tuple"
      },
      {
        components: [
          {
            components: [
              {
                internalType: "contract IGelatoCondition",
                name: "inst",
                type: "address"
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes"
              }
            ],
            internalType: "struct Condition[]",
            name: "conditions",
            type: "tuple[]"
          },
          {
            components: [
              {
                internalType: "address",
                name: "addr",
                type: "address"
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes"
              },
              {
                internalType: "enum Operation",
                name: "operation",
                type: "uint8"
              },
              {
                internalType: "enum DataFlow",
                name: "dataFlow",
                type: "uint8"
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256"
              },
              {
                internalType: "bool",
                name: "termsOkCheck",
                type: "bool"
              }
            ],
            internalType: "struct Action[]",
            name: "actions",
            type: "tuple[]"
          },
          {
            internalType: "uint256",
            name: "selfProviderGasLimit",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "selfProviderGasPriceCeil",
            type: "uint256"
          }
        ],
        internalType: "struct Task",
        name: "_task",
        type: "tuple"
      }
    ],
    name: "providerModuleChecks",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_provider",
        type: "address"
      }
    ],
    name: "providerModules",
    outputs: [
      {
        internalType: "contract IGelatoProviderModule[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IGelatoProviderModule[]",
        name: "_modules",
        type: "address[]"
      }
    ],
    name: "removeProviderModules",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_taskSpecHash",
        type: "bytes32"
      },
      {
        internalType: "uint256",
        name: "_gasPriceCeil",
        type: "uint256"
      }
    ],
    name: "setTaskSpecGasPriceCeil",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_provider",
        type: "address"
      },
      {
        internalType: "bytes32",
        name: "_taskSpecHash",
        type: "bytes32"
      }
    ],
    name: "taskSpecGasPriceCeil",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_withdrawAmount",
        type: "uint256"
      }
    ],
    name: "unprovideFunds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "contract IGelatoCondition[]",
            name: "conditions",
            type: "address[]"
          },
          {
            components: [
              {
                internalType: "address",
                name: "addr",
                type: "address"
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes"
              },
              {
                internalType: "enum Operation",
                name: "operation",
                type: "uint8"
              },
              {
                internalType: "enum DataFlow",
                name: "dataFlow",
                type: "uint8"
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256"
              },
              {
                internalType: "bool",
                name: "termsOkCheck",
                type: "bool"
              }
            ],
            internalType: "struct Action[]",
            name: "actions",
            type: "tuple[]"
          },
          {
            internalType: "uint256",
            name: "gasPriceCeil",
            type: "uint256"
          }
        ],
        internalType: "struct TaskSpec[]",
        name: "_taskSpecs",
        type: "tuple[]"
      }
    ],
    name: "unprovideTaskSpecs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
