// running `npx buidler test` automatically makes use of buidler-waffle plugin

import { createDSA } from "../lib/createDSA";
import { createGelatoOptimizer } from "../lib/createGelatoOptimizer";
import { createMakerVault } from "../lib/createMakerVault";

// => only dependency we need is "chai"
const { expect } = require("chai");
const bre = require("@nomiclabs/buidler");
const { ethers } = bre;
const GelatoCoreLib = require("@gelatonetwork/core");
import { BigNumber } from "ethers";
const DSA = require("dsa-sdk");
const Web3 = require("web3");
import { constants } from "../constants/constants";
export { };

// Set up dsa sdk from instaDapp to get resolvers
const web3 = new Web3("http://localhost:8545");
const dsaSdk = new DSA(web3);

// Constants
const ETH_10 = ethers.utils.parseEther("10");
const DAI_150 = ethers.utils.parseUnits("150", 18);
const APY_2_PERCENT_IN_SECONDS = BigNumber.from("1000000000627937192491029810");

// Contracts
const InstaAccount = require("../../pre-compiles/InstaAccount.json");
const ConnectAuth = require("../../pre-compiles/ConnectAuth.json");
const IERC20 = require("../../pre-compiles/IERC20.json");
const ProviderModuleDSA_ABI = require("../../pre-compiles/ProviderModuleDSA_ABI.json");

const ConnectGelato_ABI = require("../../pre-compiles/ConnectGelato_ABI");

describe("Test interface contracts for edge cases", function () {
    this.timeout(0);
    if (bre.network.name !== "ganache") {
        console.error("Test Suite is meant to be run on ganache only");
        process.exit(1);
    }
    // Wallet to use for local testing
    let userWallet;
    let userAddress: string;
    let dsaAddress: string;

    // Deployed instances
    let gelatoCore;
    let dai;
    let connectGelato;
    let providerModuleDSA;

    // Contracts to deploy and use for local testing
    let dsa;
    let testCCI;
    let testCMI;
    let conditionCompareUints;
    let conditionHasMakerVault;

    before(async function () {
        // Get Test Wallet for local testnet
        [userWallet] = await ethers.getSigners();
        userAddress = await userWallet.getAddress();

        // Deploy Tests for Testing
        const TestCMI = await ethers.getContractFactory("TestCMI");
        testCMI = await TestCMI.deploy(0);
        await testCMI.deployed();

        const TestCCI = await ethers.getContractFactory("TestCCI");
        testCCI = await TestCCI.deploy(0, 0);
        await testCCI.deployed();
    });

    it("#1: Check no error for zero rate", async function () {
        expect(await testCMI.getBorrowRate()).to.eq(0)
        expect(await testCCI.getETHDAIBorrowRatePerSecond()).to.eq(0)
    });

    it("#2: CMI: any negative rate should return zero", async function () {
        let underOne: string = "999999999999999999999999999"
        await testCMI.setFee(BigNumber.from(underOne))
        expect(await testCMI.getBorrowRate()).to.eq(0)
    });

    it("#3: CMI: regular 2% case", async function () {
        let twoPercent: BigNumber = BigNumber.from("1020000000000000000000000000")
        await testCMI.setFee(BigNumber.from(twoPercent))
        expect(await testCMI.fee()).to.eq("1020000000000000000000000000")
        expect(Number(await testCMI.getBorrowRate())).to.eq(20000000000000000)
    });

    it("#4: CMI: very big borrow rate", async function () {
        let veryBig: BigNumber = BigNumber.from("2000000000000000000000000000")
        await testCMI.setFee(veryBig)
        expect(await testCMI.getBorrowRate()).to.eq("1000000000000000000")
    });

    it("#5: CCI: any negative rate should return zero", async function () {
        let supplyRate: string = "1000"
        await testCCI.setSupplyRate(BigNumber.from(supplyRate))
        expect(await testCCI.getETHDAIBorrowRatePerSecond()).to.eq(0)
    });

    it("#6: CCI: any negative rate should return zero (2)", async function () {
        let supplyRate: string = "3000"
        let borrowRate: string = "1000"
        await testCCI.setSupplyRate(BigNumber.from(supplyRate))
        await testCCI.setBorrowRate(BigNumber.from(borrowRate))
        expect(Number(await testCCI.getETHDAIBorrowRatePerSecond())).to.eq(0)
    });

    it("#7: CCI: regular case", async function () {
        let supplyRate: string = "1000"
        let borrowRate: string = "2000"
        await testCCI.setSupplyRate(BigNumber.from(supplyRate))
        await testCCI.setBorrowRate(BigNumber.from(borrowRate))
        expect(Number(await testCCI.getETHDAIBorrowRatePerSecond())).to.eq(66)
    });

    it("#8: CCI: regular case with zero supply", async function () {
        let supplyRate: string = "0"
        let borrowRate: string = "1000"
        await testCCI.setSupplyRate(BigNumber.from(supplyRate))
        await testCCI.setBorrowRate(BigNumber.from(borrowRate))
        expect(Number(await testCCI.getETHDAIBorrowRatePerSecond())).to.eq(66)
    });

    it("#9: CCI: regular case with borrow = supply", async function () {
        let supplyRate: string = "1000"
        let borrowRate: string = "1000"
        await testCCI.setSupplyRate(BigNumber.from(supplyRate))
        await testCCI.setBorrowRate(BigNumber.from(borrowRate))
        expect(Number(await testCCI.getETHDAIBorrowRatePerSecond())).to.eq(0)
    });

    it("#10: CCI: very big borrow rate", async function () {
        let supplyRate: string = "0"
        let borrowRate: string = "20000000000000000000"
        await testCCI.setSupplyRate(BigNumber.from(supplyRate))
        await testCCI.setBorrowRate(BigNumber.from(borrowRate))
        expect(Number(await testCCI.getETHDAIBorrowRatePerSecond())).to.eq(1333333333333333200)
    });
});
