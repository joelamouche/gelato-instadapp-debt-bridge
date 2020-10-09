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
const PRIVATE_KEY = process.env.PRIVATE_KEY;
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
        mainnet: {
            // Standard config
            url: `https://:${INFURA_PRIVATE_KEY}@mainnet.infura.io/v3/${INFURA_ID}`,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
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
    "deployContractsTestNet",
    `Returns the current gelato gas price used for calling canExec and exec`
).setAction(async () => {
    //MockCCI
    const MockCCI = await ethers.getContractFactory("MockCCI");
    const mockCCI = await MockCCI.deploy(APY_2_PERCENT_IN_SECONDS);
    await mockCCI.deployed();
    //MockCMI
    const MockCMI = await ethers.getContractFactory("MockCMI");
    const mockCMI = await MockCMI.deploy(APY_2_PERCENT_IN_SECONDS);
    await mockCMI.deployed();
    //conditionCompareUints
    const ConditionCompareUintsFromTwoSources = await ethers.getContractFactory(
        "ConditionCompareUintsFromTwoSources"
    );
    const conditionCompareUints = await ConditionCompareUintsFromTwoSources.deploy();
    await conditionCompareUints.deployed();
    //conditionHasMakerVault
    const ConditionHasMakerVault = await ethers.getContractFactory(
        "ConditionHasOpenMakerVault"
    );
    const conditionHasMakerVault = await ConditionHasMakerVault.deploy();
    await conditionHasMakerVault.deployed();
    const addresses = {
        mockCCI: mockCCI.address,
        mockCMI: mockCMI.address,
        conditionAddress: conditionCompareUints.address,
        conditionHasMakerVault: conditionHasMakerVault.address,
    };
    writeFileSync("addresses.txt", JSON.stringify(addresses));
});

task(
    "deployContractsMainNet",
    `Returns the current gelato gas price used for calling canExec and exec`
).setAction(async () => {
    console.log("network : ", await ethers.provider.getNetwork())
    let userWallet;
    [userWallet] = await ethers.getSigners();
    let initialBalance: number = Number(await userWallet.getBalance()) / 1e18
    console.log('initial balance', initialBalance)

    //CustomCompoundInterface
    const CustomCompoundInterface = await ethers.getContractFactory("CustomCompoundInterface");
    const customCompoundInterface = await CustomCompoundInterface.deploy();
    await customCompoundInterface.deployed();
    console.log('customCompoundInterface deployed at :', customCompoundInterface.address)

    //CustomMakerInterface
    const CustomMakerInterface = await ethers.getContractFactory("CustomMakerInterface");
    const customMakerInterface = await CustomMakerInterface.deploy();
    await customMakerInterface.deployed();
    console.log('customMakerInterface deployed at :', customMakerInterface.address)

    //conditionCompareUints
    const ConditionCompareUintsFromTwoSources = await ethers.getContractFactory(
        "ConditionCompareUintsFromTwoSources"
    );
    const conditionCompareUints = await ConditionCompareUintsFromTwoSources.deploy();
    await conditionCompareUints.deployed();
    console.log('conditionCompareUints deployed at :', conditionCompareUints.address)

    //conditionHasMakerVault
    const ConditionHasMakerVault = await ethers.getContractFactory(
        "ConditionHasOpenMakerVault"
    );
    const conditionHasMakerVault = await ConditionHasMakerVault.deploy();
    await conditionHasMakerVault.deployed();
    console.log('conditionHasMakerVault deployed at :', conditionHasMakerVault.address)

    console.log('total cost', initialBalance - Number(await userWallet.getBalance()) / 1e18, " ETH")

    const addresses = {
        customCompoundInterface: customCompoundInterface.address,
        customMakerInterface: customMakerInterface.address,
        conditionAddress: conditionCompareUints.address,
        conditionHasMakerVault: conditionHasMakerVault.address,
    };
    writeFileSync("addresses.txt", JSON.stringify(addresses));
    return addresses
});
