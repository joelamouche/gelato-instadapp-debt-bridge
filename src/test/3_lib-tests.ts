import { BigNumber } from "ethers";
// running `npx buidler test` automatically makes use of buidler-waffle plugin

import { createDSA } from "../lib/createDSA";
import { createGelatoOptimizer } from "../lib/createGelatoOptimizer";
import { createMakerVault } from "../lib/createMakerVault";
import { AccountInterface } from "../../typechain/AccountInterface";
import { Ierc20 } from "../../typechain/Ierc20";
import { constants } from "../constants/constants";
const GelatoCoreLib = require("@gelatonetwork/core");

// => only dependency we need is "chai"
const { expect } = require("chai");
const bre = require("@nomiclabs/buidler");
const { ethers } = bre;
const Web3 = require("web3");
const DSA = require("dsa-sdk");
export {};

const IERC20 = require("../../pre-compiles/IERC20.json");

// Set up dsa sdk from instaDapp to get resolvers
const web3 = new Web3("http://localhost:8545");
const dsaSdk = new DSA(web3);

// Contracts
const InstaList = require("../../pre-compiles/InstaList.json");
const InstaAccount = require("../../pre-compiles/InstaAccount.json");

const ETH_10 = ethers.utils.parseEther("10");
const DAI_150 = ethers.utils.parseUnits("150", 18);
const APY_2_PERCENT_IN_SECONDS = BigNumber.from("1000000000627937192491029810");

describe("Test Lib functions", function () {
  describe("Test createDSA", function () {
    this.timeout(0);
    if (bre.network.name !== "ganache") {
      console.error("Test Suite is meant to be run on ganache only");
      process.exit(1);
    }
    // Wallet to use for local testing
    let dsaAddress;

    it("creates a DSA", async () => {
      const instaList = await ethers.getContractAt(
        InstaList.abi,
        constants.InstaList
      );
      const dsaIDPrevious = await instaList.accounts();
      dsaAddress = await createDSA(web3);
      const dsaID = dsaIDPrevious.add(1);
      await expect(await instaList.accounts()).to.be.equal(dsaID);

      let dsa: AccountInterface = await ethers.getContractAt(
        InstaAccount.abi,
        dsaAddress
      );
      expect(await dsa.version()).to.be.equal(1);
    });
  });

  describe("Test createMakerVault", function () {
    this.timeout(0);
    if (bre.network.name !== "ganache") {
      console.error("Test Suite is meant to be run on ganache only");
      process.exit(1);
    }
    // Wallet to use for local testing
    let dsaAddress: string;
    let userWallet;
    let dai: Ierc20;

    before(async function () {
      dsaAddress = await createDSA(web3);
      [userWallet] = await ethers.getSigners();
    });
    it("creates a Maker vault with 10ETH", async () => {
      const initialWalletBalance: BigNumber = await userWallet.getBalance();

      // create vault
      let vaults = await createMakerVault(web3, dsaAddress, ETH_10, DAI_150);

      // Check vault debt and collateral
      let debt, col;
      Object.keys(vaults).forEach((key) => {
        debt = vaults[key].debt;
        col = vaults[key].col;
      });
      expect(debt).to.eq(150);
      expect(col).to.eq(10);

      // Check that user has 10 eth less
      expect(await userWallet.getBalance()).to.be.lt(
        initialWalletBalance.sub(ETH_10)
      );
      // Check that user's dsa received 150 DAI
      dai = await ethers.getContractAt(IERC20.abi, constants.DAI);
      expect(await dai.balanceOf(dsaAddress)).to.eq(
        ethers.utils.parseUnits("150", 18)
      );
    });
  });

  describe("Test createGelatoOptimizer", function () {
    this.timeout(0);
    if (bre.network.name !== "ganache") {
      console.error("Test Suite is meant to be run on ganache only");
      process.exit(1);
    }
    // Wallet to use for local testing
    let dsaAddress: string;
    let userWallet;
    let userAddress: string;

    // Contracts
    let mockCDAI;
    let mockDSR;
    let conditionCompareUints;
    let gelatoCore;

    before(async function () {
      // Deploy Mocks for Testing
      const MockCDAI = await ethers.getContractFactory("MockCDAI");
      mockCDAI = await MockCDAI.deploy(APY_2_PERCENT_IN_SECONDS);
      await mockCDAI.deployed();

      const MockDSR = await ethers.getContractFactory("MockDSR");
      mockDSR = await MockDSR.deploy(APY_2_PERCENT_IN_SECONDS);
      await mockDSR.deployed();

      // ===== GELATO SETUP for testing ==================
      gelatoCore = await ethers.getContractAt(
        GelatoCoreLib.GelatoCore.abi,
        constants.GelatoCore
      );

      // Deploy Gelato Conditions for Testing
      const ConditionCompareUintsFromTwoSources = await ethers.getContractFactory(
        "ConditionCompareUintsFromTwoSources"
      );
      conditionCompareUints = await ConditionCompareUintsFromTwoSources.deploy();
      await conditionCompareUints.deployed();

      // Create DSA for user
      dsaAddress = await createDSA(web3);
      [userWallet] = await ethers.getSigners();
      userAddress = await userWallet.getAddress();
      // deploy Maker vault for user
      await createMakerVault(web3, dsaAddress, ETH_10, DAI_150);
    });

    it("creates a Gelato optimizer for the latest Maker Vault", async () => {
      // ======= Condition setup ======
      // We instantiate the Rebalance Condition:
      // Compound APY needs to be 10000000 per second points higher than DSR
      const MIN_SPREAD = "10000000";

      // ======= Gelato Task Setup =========
      // For testing purpose
      const GAS_LIMIT = "4000000";
      const GAS_PRICE_CEIL = ethers.utils.parseUnits("1000", "gwei");

      // ======= Gelato Task Provision =========
      // For testing purpose
      const TASK_AUTOMATION_FUNDS = await gelatoCore.minExecProviderFunds(
        GAS_LIMIT,
        GAS_PRICE_CEIL
      );

      // Create Gelato Optimizer
      const taskReceipt = await createGelatoOptimizer(
        web3,
        dsaAddress,
        ETH_10,
        mockCDAI.address,
        mockDSR.address,
        conditionCompareUints.address
      );

      expect(await gelatoCore.isExecutorMinStaked(userAddress)).to.be.true;

      expect(await gelatoCore.providerFunds(dsaAddress)).to.be.gte(
        TASK_AUTOMATION_FUNDS
      );
      expect(
        await gelatoCore.isProviderLiquid(dsaAddress, GAS_LIMIT, GAS_PRICE_CEIL)
      );
      expect(await gelatoCore.executorByProvider(dsaAddress)).to.be.equal(
        userAddress
      );
      expect(
        await gelatoCore.isModuleProvided(
          dsaAddress,
          // @ts-ignore
          constants.ProviderModuleDSA
        )
      ).to.be.true;

      // ======= 📣 TASK EXECUTION 📣 =========
      // This stuff is normally automated by the Gelato Network and Dapp Developers
      // and their Users don't have to take care of it. However, for local testing
      // we simulate the Gelato Execution logic.

      // First we fetch the gelatoGasPrice as fed by ChainLink oracle. Gelato
      // allows Users to specify a maximum fast gwei gas price for their Tasks
      // to remain executable up until.
      const gelatoGasPrice = await bre.run("fetchGelatoGasPrice");
      expect(gelatoGasPrice).to.be.lte(GAS_PRICE_CEIL);

      // Let's first check if our Task is executable. Since both MockDSR and MockCDAI
      // start with a normalized per second rate of APY_2_PERCENT_IN_SECONDS
      // (1000000000627937192491029810 in 10**27 precision) in both of them, we
      // expect ConditionNotOk because ANotGreaterOrEqualToBbyMinspread.
      // Check out contracts/ConditionCompareUintsFromTwoSources.sol to see how
      // how the comparison of MockDSR and MockCDAI is implemented in Condition code.
      expect(
        await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
      ).to.be.equal("ConditionNotOk:ANotGreaterOrEqualToBbyMinspread");

      // We defined a MIN_SPREAD of 10000000 points in the per second rate
      // for our ConditionCompareUintsFromTwoSources. So we now
      // set the CDAI.supplyRatePerSecond to be 10000000 higher than MockDSR.dsr
      // and expect it to mean that our Task becomes executable.
      await mockCDAI.setSupplyRatePerSecond(
        (await mockDSR.dsr()).add(MIN_SPREAD)
      );

      expect(
        await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
      ).to.be.equal("OK");

      // For testing we now simulate automatic Task Execution ❗
      await expect(
        gelatoCore.exec(taskReceipt, {
          gasPrice: gelatoGasPrice, // Executor must use gelatoGasPrice (Chainlink fast gwei)
          gasLimit: GAS_LIMIT,
        })
      ).to.emit(gelatoCore, "LogExecSuccess");

      // Checking that a 150 DAI borrow position is open on Compound
      expect((await dsaSdk.compound.getPosition(dsaAddress)).dai.borrow).to.eq(
        150
      );

      // Checking that the Maker flash loan has been closed
      const vault = await dsaSdk.maker.getVaults(dsaAddress);
      let debt;
      Object.keys(vault).forEach((key) => {
        debt = vault[key].debt;
      });
      expect(debt).to.eq(0);
    });
  });
});
