//import { network } from "@nomiclabs/buidler";
import { BuidlerConfig, task, types, usePlugin } from "@nomiclabs/buidler/config";
declare var ethers

// Libraries
const assert = require("assert");
const { utils } = require("ethers");

const GelatoCoreLib = require("@gelatonetwork/core");

// Process Env Variables
require("dotenv").config();
const INFURA_ID = process.env.INFURA_ID;
const INFURA_PRIVATE_KEY = process.env.INFURA_PRIVATE_KEY;
assert.ok(INFURA_ID, "no Infura ID in process.env");

// ================================= CONFIG =========================================
const config: BuidlerConfig = {
  defaultNetwork: "ganache",
  networks: {
    ganache: {
      // Standard config
      url: "http://localhost:8545",
      // @ts-ignore
      fork: `https://:${INFURA_PRIVATE_KEY}@mainnet.infura.io/v3/${INFURA_ID}`,
      // Custom
      GelatoCore: "0x1d681d76ce96E4d70a88A00EBbcfc1E47808d0b8",
      ProviderModuleDSA: "0x0C25452d20cdFeEd2983fa9b9b9Cf4E81D6f2fE2",
      DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
      DAI_UNISWAP: "0x2a1530C4C41db0B0b2bB646CB5Eb1A67b7158667",
      CDAI: "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
      // InstaDapp DSA
      InstaIndex: "0x2971AdFa57b20E5a416aE5a708A8655A9c74f723",
      InstaList: "0x4c8a1BEb8a87765788946D6B19C6C6355194AbEb",
      InstaConnectors: "0xD6A602C01a023B98Ecfb29Df02FBA380d3B21E0c",
      InstaAccount: "0x939Daad09fC4A9B8f8A9352A485DAb2df4F4B3F8",
      // Connectors
      ConnectAuth: "0xB3242e09C8E5cE6E14296b3d3AbC4C6965F49b98",
      ConnectBasic: "0x9370236a085A99Aa359f4bD2f0424b8c3bf25C99",
      ConnectMaker: "0x58Bbb677296B6d1B596288B31Abb928492400fBF",
      ConnectCompound: "0xaeCfA2c0f4bAD0Ecee46dcd1250cd0334fE28BC0",
      ConnectGelato: "0x37A7009d424951dd5D5F155fA588D9a03C455163",
      ConnectInstaPool: "0x6d11A71575C34eB7b5E22949fAfCd49A2FA2A8F9",
      // Resolvers
      InstaCompoundResolver:"0x43a041ee9ac82f4e375a67f67685b750c0c7c9af",
      InstaMakerResolver: "0x0A7008B38E7015F8C36A49eEbc32513ECA8801E5",
    },
  },
  solc: {
    version: "0.6.12",
    optimizer: { enabled: true },
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v4",
  },
};
export default config;

// ================================= PLUGINS =========================================
usePlugin("@nomiclabs/buidler-ethers");
usePlugin("@nomiclabs/buidler-ganache");
usePlugin("@nomiclabs/buidler-waffle");
usePlugin("buidler-typechain");

// ================================= TASKS =========================================
task("abi-encode-with-selector")
  .addPositionalParam(
    "abi",
    "Contract ABI in array form",
    undefined,
    types.json
  )
  .addPositionalParam("functionName")
  .addOptionalVariadicPositionalParam(
    "inputs",
    "Array of function params",
    undefined,
    types.json
  )
  .addFlag("log")
  .setAction(async (taskArgs) => {
    try {
      if (taskArgs.log) console.log(taskArgs);

      if (!taskArgs.abi)
        throw new Error("abi-encode-with-selector: no abi passed");

      const interFace = new utils.Interface(taskArgs.abi);

      let functionFragment;
      try {
        functionFragment = interFace.getFunction(taskArgs.functionName);
      } catch (error) {
        throw new Error(
          `\n ❌ abi-encode-with-selector: functionName "${taskArgs.functionName}" not found`
        );
      }

      let payloadWithSelector;

      if (taskArgs.inputs) {
        let iterableInputs;
        try {
          iterableInputs = [...taskArgs.inputs];
        } catch (error) {
          iterableInputs = [taskArgs.inputs];
        }
        payloadWithSelector = interFace.encodeFunctionData(
          functionFragment,
          iterableInputs
        );
      } else {
        payloadWithSelector = interFace.encodeFunctionData(
          functionFragment,
          []
        );
      }

      if (taskArgs.log)
        console.log(`\nEncodedPayloadWithSelector:\n${payloadWithSelector}\n`);
      return payloadWithSelector;
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

task(
  "fetchGelatoGasPrice",
  `Returns the current gelato gas price used for calling canExec and exec`
)
  .addOptionalParam("gelatocoreaddress")
  .addFlag("log", "Logs return values to stdout")
  .setAction(async (taskArgs) => {
    try {
      //@ts-ignore
      const gelatoCore = await ethers.getContractAt(
        GelatoCoreLib.GelatoCore.abi,
        taskArgs.gelatocoreaddress
          ? taskArgs.gelatocoreaddress
          //@ts-ignore
          : network.config.GelatoCore
      );

      const oracleAbi = ["function latestAnswer() view returns (int256)"];

      const gelatoGasPriceOracleAddress = await gelatoCore.gelatoGasPriceOracle();

      // Get gelatoGasPriceOracleAddress
      //@ts-ignore
      const gelatoGasPriceOracle = await ethers.getContractAt(
        oracleAbi,
        gelatoGasPriceOracleAddress
      );

      // lastAnswer is used by GelatoGasPriceOracle as well as the Chainlink Oracle
      const gelatoGasPrice = await gelatoGasPriceOracle.latestAnswer();

      if (taskArgs.log) {
        console.log(
          `\ngelatoGasPrice: ${utils.formatUnits(
            gelatoGasPrice.toString(),
            "gwei"
          )} gwei\n`
        );
      }

      return gelatoGasPrice;
    } catch (error) {
      console.error(error, "\n");
      process.exit(1);
    }
  });