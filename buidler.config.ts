import {
    BuidlerConfig,
    task,
    types,
    usePlugin,
} from "@nomiclabs/buidler/config";
declare var ethers;

// Libraries
const assert = require("assert");
const { utils } = require("ethers");

const GelatoCoreLib = require("@gelatonetwork/core");
import { constants } from "./src/constants/constants";
import { writeFileSync } from "fs";

// Process Env Variables
require("dotenv").config();
const INFURA_ID = process.env.INFURA_ID;
const INFURA_PRIVATE_KEY = process.env.INFURA_PRIVATE_KEY;
assert.ok(INFURA_ID, "no Infura ID in process.env");

import { BigNumber } from "ethers";

const APY_2_PERCENT_IN_SECONDS = BigNumber.from("1000000000627937192491029810");

// ================================= CONFIG =========================================
const config: BuidlerConfig = {
    defaultNetwork: "ganache",
    networks: {
        ganache: {
            // Standard config
            url: "http://localhost:8545",
            // @ts-ignore
            fork: `https://:${INFURA_PRIVATE_KEY}@mainnet.infura.io/v3/${INFURA_ID}`,

            defaultBalanceEther: 1000,
            GelatoCore: "0x1d681d76ce96E4d70a88A00EBbcfc1E47808d0b8",
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

    paths: {
        tests: "./src/test",
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
                console.log(
                    `\nEncodedPayloadWithSelector:\n${payloadWithSelector}\n`
                );
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
                    : constants.GelatoCore
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

task(
    "deployContracts",
    `Returns the current gelato gas price used for calling canExec and exec`
).setAction(async () => {
    const MockCDAI = await ethers.getContractFactory("MockCDAI");
    const mockCDAI = await MockCDAI.deploy(APY_2_PERCENT_IN_SECONDS);
    await mockCDAI.deployed();
    const MockDSR = await ethers.getContractFactory("MockDSR");
    const mockDSR = await MockDSR.deploy(APY_2_PERCENT_IN_SECONDS);
    await mockDSR.deployed();
    const ConditionCompareUintsFromTwoSources = await ethers.getContractFactory(
        "ConditionCompareUintsFromTwoSources"
    );
    const conditionCompareUints = await ConditionCompareUintsFromTwoSources.deploy();
    await conditionCompareUints.deployed();
    const ConditionHasMakerVault = await ethers.getContractFactory(
        "ConditionHasOpenMakerVault"
    );
    const conditionHasMakerVault = await ConditionHasMakerVault.deploy();
    await conditionHasMakerVault.deployed();
    const addresses = {
        mockCDAI: mockCDAI.address,
        mockDSR: mockDSR.address,
        conditionAddress: conditionCompareUints.address,
        conditionHasMakerVault: conditionHasMakerVault.address,
    };
    writeFileSync("addresses.txt", JSON.stringify(addresses));
});
