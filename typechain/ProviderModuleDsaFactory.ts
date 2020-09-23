/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractFactory, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { UnsignedTransaction } from "ethers/utils/transaction";

import { TransactionOverrides } from ".";
import { ProviderModuleDsa } from "./ProviderModuleDsa";

export class ProviderModuleDsaFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _index: string,
    _gelatoCore: string,
    overrides?: TransactionOverrides
  ): Promise<ProviderModuleDsa> {
    return super.deploy(_index, _gelatoCore, overrides) as Promise<
      ProviderModuleDsa
    >;
  }
  getDeployTransaction(
    _index: string,
    _gelatoCore: string,
    overrides?: TransactionOverrides
  ): UnsignedTransaction {
    return super.getDeployTransaction(_index, _gelatoCore, overrides);
  }
  attach(address: string): ProviderModuleDsa {
    return super.attach(address) as ProviderModuleDsa;
  }
  connect(signer: Signer): ProviderModuleDsaFactory {
    return super.connect(signer) as ProviderModuleDsaFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ProviderModuleDsa {
    return new Contract(address, _abi, signerOrProvider) as ProviderModuleDsa;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IndexInterface",
        name: "_index",
        type: "address"
      },
      {
        internalType: "address",
        name: "_gelatoCore",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
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
        name: "",
        type: "uint256"
      }
    ],
    name: "execPayload",
    outputs: [
      {
        internalType: "bytes",
        name: "payload",
        type: "bytes"
      },
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
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    name: "execRevertCheck",
    outputs: [],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [],
    name: "gelatoCore",
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
    inputs: [],
    name: "index",
    outputs: [
      {
        internalType: "contract IndexInterface",
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
        name: "_userProxy",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
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
    name: "isProvided",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

const _bytecode =
  "0x60c060405234801561001057600080fd5b50604051610b0f380380610b0f83398101604081905261002f9161004d565b6001600160601b0319606092831b8116608052911b1660a05261009e565b6000806040838503121561005f578182fd5b825161006a81610086565b602084015190925061007b81610086565b809150509250929050565b6001600160a01b038116811461009b57600080fd5b50565b60805160601c60a05160601c610a396100d6600039806102c652806104b75280610577525080610331528061035b5250610a396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c806306fca7281461005c5780632986c0e5146100865780633e88ecf41461009b5780633f17c3df146100b0578063fe861b99146100d0575b600080fd5b61006f61006a3660046106d5565b6100d8565b60405161007d92919061089e565b60405180910390f35b61008e61032f565b60405161007d91906107d8565b6100ae6100a9366004610668565b610353565b005b6100c36100be3660046105e8565b610357565b60405161007d91906108c2565b61008e610575565b60606000816100ea60208601866108d5565b905067ffffffffffffffff8111801561010257600080fd5b5060405190808252806020026020018201604052801561012c578160200160208202803683370190505b50905060005b61013f60208701876108d5565b90508110156101ab5761015560208701876108d5565b8281811061015f57fe5b90506020028101906101719190610968565b61017f9060208101906105b0565b82828151811061018b57fe5b6001600160a01b0390921660209283029190910190910152600101610132565b5060606101bb60208701876108d5565b905067ffffffffffffffff811180156101d357600080fd5b5060405190808252806020026020018201604052801561020757816020015b60608152602001906001900390816101f25790505b50905060005b61021a60208801886108d5565b90508110156102af5761023060208801886108d5565b8281811061023a57fe5b905060200281019061024c9190610968565b61025a906020810190610923565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250508451859250849150811061029c57fe5b602090810291909101015260010161020d565b5060405163e0e90acf60e01b906102ee90849084907f0000000000000000000000000000000000000000000000000000000000000000906024016107ec565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b03199093169290921790915299929850919650505050505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b5050565b60607f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316630f560cd76040518163ffffffff1660e01b815260040160206040518083038186803b1580156103b257600080fd5b505afa1580156103c6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103ea91906105cc565b6001600160a01b0316636cfaf5e9856040518263ffffffff1660e01b815260040161041591906107d8565b60206040518083038186803b15801561042d57600080fd5b505afa158015610441573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104659190610747565b67ffffffffffffffff16610493576040518060600160405280602d81526020016109a9602d9139905061056e565b604051632520e7ff60e01b81526001600160a01b03851690632520e7ff906104df907f0000000000000000000000000000000000000000000000000000000000000000906004016107d8565b60206040518083038186803b1580156104f757600080fd5b505afa15801561050b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061052f9190610648565b610553576040518060600160405280602e81526020016109d6602e9139905061056e565b506040805180820190915260028152614f4b60f01b60208201525b9392505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b6000608082840312156105aa578081fd5b50919050565b6000602082840312156105c1578081fd5b813561056e81610990565b6000602082840312156105dd578081fd5b815161056e81610990565b6000806000606084860312156105fc578182fd5b833561060781610990565b9250602084013561061781610990565b9150604084013567ffffffffffffffff811115610632578182fd5b61063e86828701610599565b9150509250925092565b600060208284031215610659578081fd5b8151801515811461056e578182fd5b6000806020838503121561067a578182fd5b823567ffffffffffffffff80821115610691578384fd5b818501915085601f8301126106a4578384fd5b8135818111156106b2578485fd5b8660208285010111156106c3578485fd5b60209290920196919550909350505050565b600080600080600060a086880312156106ec578081fd5b8535945060208601356106fe81610990565b9350604086013561070e81610990565b9250606086013567ffffffffffffffff811115610729578182fd5b61073588828901610599565b95989497509295608001359392505050565b600060208284031215610758578081fd5b815167ffffffffffffffff8116811461056e578182fd5b6001600160a01b0316815260200190565b6001600160a01b03169052565b60008151808452815b818110156107b257602081850181015186830182015201610796565b818111156107c35782602083870101525b50601f01601f19169290920160200192915050565b6001600160a01b0391909116815260200190565b600060608201606083528086516108038184610987565b915060209250828801845b8281101561082f5761082184835161076f565b93509084019060010161080e565b505050838103828501528086516108468184610987565b91508192508381028201848901865b8381101561087f57858303855261086d83835161078d565b94870194925090860190600101610855565b505080955050505050506108966040830184610780565b949350505050565b6000604082526108b1604083018561078d565b905082151560208301529392505050565b60006020825261056e602083018461078d565b6000808335601e198436030181126108eb578283fd5b83018035915067ffffffffffffffff821115610905578283fd5b602090810192508102360382131561091c57600080fd5b9250929050565b6000808335601e19843603018112610939578283fd5b83018035915067ffffffffffffffff821115610953578283fd5b60200191503681900382131561091c57600080fd5b6000823560be1983360301811261097d578182fd5b9190910192915050565b90815260200190565b6001600160a01b03811681146109a557600080fd5b5056fe50726f76696465724d6f64756c654453412e697350726f76696465643a496e76616c69645573657250726f787950726f76696465724d6f64756c654453412e697350726f76696465643a47656c61746f436f72654e6f7441757468a26469706673582212205ae7853141ff8ec50b84bdbcdb25911d38afa0febf59f7cfeed73c3d8652faee64736f6c634300060c0033";
