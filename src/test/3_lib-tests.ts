import { BigNumber, Contract } from "ethers";
// running `npx buidler test` automatically makes use of buidler-waffle plugin

import { createDSA } from "../lib/createDSA";
import { createGelatoOptimizer } from "../lib/createGelatoOptimizer";
import { createGelatoAutoLiquidator } from "../lib/createGelatoAutoLiquidator";
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
export { };

const IERC20 = require("../../pre-compiles/IERC20.json");
const ConnectBasic = require("../../pre-compiles/ConnectBasic.json");
const ConnectMaker = require("../../pre-compiles/ConnectMaker.json");

// Set up dsa sdk from instaDapp to get resolvers
const web3 = new Web3("http://localhost:8545");
const dsaSdk = new DSA(web3);

// Contracts
const InstaList = require("../../pre-compiles/InstaList.json");
const InstaAccount = require("../../pre-compiles/InstaAccount.json");
const IUniswapExchange = require("../../pre-compiles/IUniswapExchange.json");

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
    let mockCMI;
    let mockCCI;
    let conditionCompareUints;
    let conditionHasMakerVault;
    let gelatoCore;

    beforeEach(async function () {
      // Deploy Mocks for Testing
      const MockCMI = await ethers.getContractFactory("MockCMI");
      mockCMI = await MockCMI.deploy(APY_2_PERCENT_IN_SECONDS);
      await mockCMI.deployed();

      const MockCCI = await ethers.getContractFactory("MockCCI");
      mockCCI = await MockCCI.deploy(APY_2_PERCENT_IN_SECONDS);
      await mockCCI.deployed();

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
      const ConditionHasMakerVault = await ethers.getContractFactory(
        "ConditionHasOpenMakerVault"
      );
      conditionHasMakerVault = await ConditionHasMakerVault.deploy();
      await conditionHasMakerVault.deployed();

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
        DAI_150,
        {CMIAddress:mockCMI.address,CCIAddress:mockCCI.address}
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

      // Let's first check if our Task is executable. Since both MockCCI and MockCMI
      // start with a normalized per second rate of APY_2_PERCENT_IN_SECONDS
      // (1000000000627937192491029810 in 10**27 precision) in both of them, we
      // expect ConditionNotOk because ANotGreaterOrEqualToBbyMinspread.
      // Check out contracts/ConditionCompareUintsFromTwoSources.sol to see how
      // how the comparison of MockCCI and MockCMI is implemented in Condition code.
      expect(
        await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
      ).to.be.equal("ConditionNotOk:ANotGreaterOrEqualToBbyMinspread");

      // We defined a MIN_SPREAD of 10000000 points in the per second rate
      // for our ConditionCompareUintsFromTwoSources. So we now
      // set the Maker.borrowRatePerSecond to be 10000000 higher than MockCCI.borrowRatePerSecond
      // and expect it to mean that our Task becomes executable.
      await mockCMI.setBorrowRatePerSecond(
        (await mockCCI.borrowRatePerSecond()).add(MIN_SPREAD)
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

    it("refinancing shouldn't happen if not enough DAi in the DSA", async () => {
      // ======= Condition setup ======
      // We instantiate the Rebalance Condition:
      // Compound APY needs to be 10000000 per second points higher than DSR
      const MIN_SPREAD = "10000000";

      // ======= Gelato Task Setup =========
      // For testing purpose
      const GAS_LIMIT = "4000000";
      const GAS_PRICE_CEIL = ethers.utils.parseUnits("1000", "gwei");

      // Create Gelato Optimizer
      const taskReceipt = await createGelatoOptimizer(
        web3,
        dsaAddress,
        ETH_10,
        DAI_150,
        {CMIAddress:mockCMI.address,CCIAddress:mockCCI.address}
      );

      // ======= 📣 TASK EXECUTION 📣 =========

      // First we fetch the gelatoGasPrice as fed by ChainLink oracle. Gelato
      // allows Users to specify a maximum fast gwei gas price for their Tasks
      // to remain executable up until.
      const gelatoGasPrice = await bre.run("fetchGelatoGasPrice");
      expect(gelatoGasPrice).to.be.lte(GAS_PRICE_CEIL);

      // We defined a MIN_SPREAD of 10000000 points in the per second rate
      // for our ConditionCompareUintsFromTwoSources. So we now
      // set the Maker.borrowRatePerSecond to be 10000000 higher than MockCCI.borrowRatePerSecond
      // and expect it to mean that our Task becomes executable.
      await mockCMI.setBorrowRatePerSecond(
        (await mockCCI.borrowRatePerSecond()).add(MIN_SPREAD)
      );

      // Check that with 150 DAI, the task is executable
      expect(
        await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
      ).to.be.equal("OK");

      // Withdraw the DAI
      const withdrawData = await bre.run("abi-encode-with-selector", {
        abi: ConnectBasic.abi,
        functionName: "withdraw",
        inputs: [constants.DAI, DAI_150, userAddress, 0, 0],
      });
      let dsa = new Contract(dsaAddress, InstaAccount.abi, userWallet);
      const gasLimit = ethers.BigNumber.from(1000000);
      const gasPrice = ethers.utils.parseUnits("20", "gwei");
      await dsa.cast([constants.ConnectBasic], [withdrawData], userAddress, {
        gasLimit,
        gasPrice,
      })

      // Now the task shouldn't be executable anymore
      expect(
        await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
      ).to.be.equal("ConditionNotOk:NotOkERC20BalanceIsNotGreaterThanRefBalance");
    });

    it("refinancing shouldn't happen if user has no open maker vault", async () => {
      // ======= Condition setup ======
      // We instantiate the Rebalance Condition:
      // Compound APY needs to be 10000000 per second points higher than DSR
      const MIN_SPREAD = "10000000";

      // ======= Gelato Task Setup =========
      // For testing purpose
      const GAS_LIMIT = "4000000";
      const GAS_PRICE_CEIL = ethers.utils.parseUnits("1000", "gwei");

      // Create Gelato Optimizer
      const taskReceipt = await createGelatoOptimizer(
        web3,
        dsaAddress,
        ETH_10,
        DAI_150,
        {CMIAddress:mockCMI.address,CCIAddress:mockCCI.address}
      );

      // ======= 📣 TASK EXECUTION 📣 =========

      // First we fetch the gelatoGasPrice as fed by ChainLink oracle. Gelato
      // allows Users to specify a maximum fast gwei gas price for their Tasks
      // to remain executable up until.
      const gelatoGasPrice = await bre.run("fetchGelatoGasPrice");
      expect(gelatoGasPrice).to.be.lte(GAS_PRICE_CEIL);

      // We defined a MIN_SPREAD of 10000000 points in the per second rate
      // for our ConditionCompareUintsFromTwoSources. So we now
      // set the Maker.borrowRatePerSecond to be 10000000 higher than MockCCI.borrowRatePerSecond
      // and expect it to mean that our Task becomes executable.
      await mockCMI.setBorrowRatePerSecond(
        (await mockCCI.borrowRatePerSecond()).add(MIN_SPREAD)
      );

      // Check that with an open maker vault, the task is executable
      expect(
        await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
      ).to.be.equal("OK");

      // Payback Maker Vault with all the DAI
      const connectorPaybackMakerVault = await bre.run("abi-encode-with-selector", {
        abi: ConnectMaker.abi,
        functionName: "payback",
        inputs: [0, DAI_150, 0, 0],
      });
      // // Withdraw ETH from Vault
      const connectorWithdrawFromMakerVault = await bre.run("abi-encode-with-selector", {
        abi: ConnectMaker.abi,
        functionName: "withdraw",
        inputs: [0, ETH_10, 0, 0],
      });
      const connectorCloseMakerVault = await bre.run("abi-encode-with-selector", {
        abi: ConnectMaker.abi,
        functionName: "close",
        inputs: [0],
      });
      let dsa = new Contract(dsaAddress, InstaAccount.abi, userWallet);
      const gasLimit = ethers.BigNumber.from(1000000);
      const gasPrice = ethers.utils.parseUnits("20", "gwei");
      await dsa.cast([constants.ConnectMaker, constants.ConnectMaker, constants.ConnectMaker], [connectorPaybackMakerVault, connectorWithdrawFromMakerVault, connectorCloseMakerVault], userAddress, {
        gasLimit,
        gasPrice,
      })

      // Let's get the test user 100 DAI++ from Uniswap
      // TODO use instadapp connector for this
      const daiUniswapExchange = await ethers.getContractAt(
        IUniswapExchange.abi,
        // @ts-ignore
        constants.DAI_UNISWAP
      );
      await daiUniswapExchange.ethToTokenTransferInput(
        1,
        2525644800, // random timestamp in the future (year 2050)
        userAddress,
        {
          value: ethers.utils.parseEther("2"),
        }
      );
      let dai = await ethers.getContractAt(IERC20.abi, constants.DAI);
      await dai.transfer(dsaAddress, DAI_150);
      expect(await dai.balanceOf(dsaAddress)).to.be.gte(DAI_150);

      // Now the task shouldn't be executable anymore
      expect(
        await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
      ).to.be.equal("ConditionNotOk:No open vault");
    });
  });

  describe("Test createGelatoAutoLiquidator", function () {
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
    let mockCMI;
    let mockAggregator;
    let conditionCompareUints;
    let conditionHasMakerVault;
    let gelatoCore;

    beforeEach(async function () {
      // Deploy Mocks for Testing
      const MockCMI = await ethers.getContractFactory("MockCMI");
      mockCMI = await MockCMI.deploy(APY_2_PERCENT_IN_SECONDS);
      await mockCMI.deployed();

      const MockAggregator = await ethers.getContractFactory("MockAggregator");
      mockAggregator = await MockAggregator.deploy(APY_2_PERCENT_IN_SECONDS);
      await mockAggregator.deployed();

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
      const ConditionHasMakerVault = await ethers.getContractFactory(
        "ConditionHasOpenMakerVault"
      );
      conditionHasMakerVault = await ConditionHasMakerVault.deploy();
      await conditionHasMakerVault.deployed();

      // Create DSA for user
      dsaAddress = await createDSA(web3);
      [userWallet] = await ethers.getSigners();
      userAddress = await userWallet.getAddress();
      // deploy Maker vault for user
      await createMakerVault(web3, dsaAddress, ETH_10, DAI_150);
    });

    it("creates a Gelato autoliquidator for the latest Maker Vault", async () => {
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
      const taskReceipt = await createGelatoAutoLiquidator(
        web3,
        dsaAddress,
        ETH_10,
        DAI_150,
        mockCMI.address,
        mockAggregator.address,
        conditionCompareUints.address,
        conditionHasMakerVault.address
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

      // Let's first check if our Task is executable. Since both MockCCI and MockCMI
      // start with a normalized per second rate of APY_2_PERCENT_IN_SECONDS
      // (1000000000627937192491029810 in 10**27 precision) in both of them, we
      // expect ConditionNotOk because ANotGreaterOrEqualToBbyMinspread.
      // Check out contracts/ConditionCompareUintsFromTwoSources.sol to see how
      // how the comparison of MockCCI and MockCMI is implemented in Condition code.
      expect(
        await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
      ).to.be.equal("ConditionNotOk:ANotGreaterOrEqualToBbyMinspread");

      // We defined a MIN_SPREAD of 10000000 points in the per second rate
      // for our ConditionCompareUintsFromTwoSources. So we now
      // set the CDAI.supplyRatePerSecond to be 10000000 higher than MockCCI.dsr
      // and expect it to mean that our Task becomes executable.
      await mockCMI.setBorrowRatePerSecond(
        (await mockAggregator.ethusd()).add(MIN_SPREAD)
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

      // Checking that the Maker flash loan has been closed
      const vault = await dsaSdk.maker.getVaults(dsaAddress);
      let debt;
      Object.keys(vault).forEach((key) => {
        debt = vault[key].debt;
      });
      expect(debt).to.eq(0);
    });

    it("liquidation shouldn't happen if not enough DAi in the DSA", async () => {
      // ======= Condition setup ======
      // We instantiate the Rebalance Condition:
      // Compound APY needs to be 10000000 per second points higher than DSR
      const MIN_SPREAD = "10000000";

      // ======= Gelato Task Setup =========
      // For testing purpose
      const GAS_LIMIT = "4000000";
      const GAS_PRICE_CEIL = ethers.utils.parseUnits("1000", "gwei");

      // Create Gelato Optimizer
      const taskReceipt = await createGelatoAutoLiquidator(
        web3,
        dsaAddress,
        ETH_10,
        DAI_150,
        mockCMI.address,
        mockAggregator.address,
        conditionCompareUints.address,
        conditionHasMakerVault.address
      );

      // ======= 📣 TASK EXECUTION 📣 =========

      // First we fetch the gelatoGasPrice as fed by ChainLink oracle. Gelato
      // allows Users to specify a maximum fast gwei gas price for their Tasks
      // to remain executable up until.
      const gelatoGasPrice = await bre.run("fetchGelatoGasPrice");
      expect(gelatoGasPrice).to.be.lte(GAS_PRICE_CEIL);

      // We defined a MIN_SPREAD of 10000000 points in the per second rate
      // for our ConditionCompareUintsFromTwoSources. So we now
      // set the CDAI.supplyRatePerSecond to be 10000000 higher than MockCCI.dsr
      // and expect it to mean that our Task becomes executable.
      await mockCMI.setBorrowRatePerSecond(
        (await mockAggregator.ethusd()).add(MIN_SPREAD)
      );

      // Check that with 150 DAI, the task is executable
      expect(
        await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
      ).to.be.equal("OK");

      // Withdraw the DAI
      const withdrawData = await bre.run("abi-encode-with-selector", {
        abi: ConnectBasic.abi,
        functionName: "withdraw",
        inputs: [constants.DAI, DAI_150, userAddress, 0, 0],
      });
      let dsa = new Contract(dsaAddress, InstaAccount.abi, userWallet);
      const gasLimit = ethers.BigNumber.from(1000000);
      const gasPrice = ethers.utils.parseUnits("20", "gwei");
      await dsa.cast([constants.ConnectBasic], [withdrawData], userAddress, {
        gasLimit,
        gasPrice,
      })

      // Now the task shouldn't be executable anymore
      expect(
        await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
      ).to.be.equal("ConditionNotOk:NotOkERC20BalanceIsNotGreaterThanRefBalance");
    });

    it("liquidation shouldn't happen if user has no open maker vault", async () => {
      // ======= Condition setup ======
      // We instantiate the Rebalance Condition:
      // Compound APY needs to be 10000000 per second points higher than DSR
      const MIN_SPREAD = "10000000";

      // ======= Gelato Task Setup =========
      // For testing purpose
      const GAS_LIMIT = "4000000";
      const GAS_PRICE_CEIL = ethers.utils.parseUnits("1000", "gwei");

      // Create Gelato Optimizer
      const taskReceipt = await createGelatoAutoLiquidator(
        web3,
        dsaAddress,
        ETH_10,
        DAI_150,
        mockCMI.address,
        mockAggregator.address,
        conditionCompareUints.address,
        conditionHasMakerVault.address
      );

      // ======= 📣 TASK EXECUTION 📣 =========

      // First we fetch the gelatoGasPrice as fed by ChainLink oracle. Gelato
      // allows Users to specify a maximum fast gwei gas price for their Tasks
      // to remain executable up until.
      const gelatoGasPrice = await bre.run("fetchGelatoGasPrice");
      expect(gelatoGasPrice).to.be.lte(GAS_PRICE_CEIL);

      // We defined a MIN_SPREAD of 10000000 points in the per second rate
      // for our ConditionCompareUintsFromTwoSources. So we now
      // set the CDAI.supplyRatePerSecond to be 10000000 higher than MockCCI.dsr
      // and expect it to mean that our Task becomes executable.
      await mockCMI.setBorrowRatePerSecond(
        (await mockAggregator.ethusd()).add(MIN_SPREAD)
      );

      // Check that with an open maker vault, the task is executable
      expect(
        await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
      ).to.be.equal("OK");

      // Payback Maker Vault with all the DAI
      const connectorPaybackMakerVault = await bre.run("abi-encode-with-selector", {
        abi: ConnectMaker.abi,
        functionName: "payback",
        inputs: [0, DAI_150, 0, 0],
      });
      // // Withdraw ETH from Vault
      const connectorWithdrawFromMakerVault = await bre.run("abi-encode-with-selector", {
        abi: ConnectMaker.abi,
        functionName: "withdraw",
        inputs: [0, ETH_10, 0, 0],
      });
      const connectorCloseMakerVault = await bre.run("abi-encode-with-selector", {
        abi: ConnectMaker.abi,
        functionName: "close",
        inputs: [0],
      });
      let dsa = new Contract(dsaAddress, InstaAccount.abi, userWallet);
      const gasLimit = ethers.BigNumber.from(1000000);
      const gasPrice = ethers.utils.parseUnits("20", "gwei");
      await dsa.cast([constants.ConnectMaker, constants.ConnectMaker, constants.ConnectMaker], [connectorPaybackMakerVault, connectorWithdrawFromMakerVault, connectorCloseMakerVault], userAddress, {
        gasLimit,
        gasPrice,
      })

      // Let's get the test user 100 DAI++ from Uniswap
      // TODO use instadapp connector for this
      const daiUniswapExchange = await ethers.getContractAt(
        IUniswapExchange.abi,
        // @ts-ignore
        constants.DAI_UNISWAP
      );
      await daiUniswapExchange.ethToTokenTransferInput(
        1,
        2525644800, // random timestamp in the future (year 2050)
        userAddress,
        {
          value: ethers.utils.parseEther("2"),
        }
      );
      let dai = await ethers.getContractAt(IERC20.abi, constants.DAI);
      await dai.transfer(dsaAddress, DAI_150);
      expect(await dai.balanceOf(dsaAddress)).to.be.gte(DAI_150);

      // Now the task shouldn't be executable anymore
      expect(
        await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
      ).to.be.equal("ConditionNotOk:No open vault");
    });
  });

  // describe("Test createGelatoOptimizerAave (refinance to Aave)", function () {
  //   this.timeout(0);
  //   if (bre.network.name !== "ganache") {
  //     console.error("Test Suite is meant to be run on ganache only");
  //     process.exit(1);
  //   }
  //   // Wallet to use for local testing
  //   let dsaAddress: string;
  //   let userWallet;
  //   let userAddress: string;

  //   // Contracts
  //   let mockCMI;
  //   let mockCCI;
  //   let conditionCompareUints;
  //   let conditionHasMakerVault;
  //   let gelatoCore;

  //   beforeEach(async function () {
  //     // Deploy Mocks for Testing
  //     const MockCMI = await ethers.getContractFactory("MockCMI");
  //     mockCMI = await MockCMI.deploy(APY_2_PERCENT_IN_SECONDS);
  //     await mockCMI.deployed();

  //     const MockCCI = await ethers.getContractFactory("MockCCI");
  //     mockCCI = await MockCCI.deploy(APY_2_PERCENT_IN_SECONDS);
  //     await mockCCI.deployed();

  //     // ===== GELATO SETUP for testing ==================
  //     gelatoCore = await ethers.getContractAt(
  //       GelatoCoreLib.GelatoCore.abi,
  //       constants.GelatoCore
  //     );

  //     // Deploy Gelato Conditions for Testing
  //     const ConditionCompareUintsFromTwoSources = await ethers.getContractFactory(
  //       "ConditionCompareUintsFromTwoSources"
  //     );
  //     conditionCompareUints = await ConditionCompareUintsFromTwoSources.deploy();
  //     await conditionCompareUints.deployed();
  //     const ConditionHasMakerVault = await ethers.getContractFactory(
  //       "ConditionHasOpenMakerVault"
  //     );
  //     conditionHasMakerVault = await ConditionHasMakerVault.deploy();
  //     await conditionHasMakerVault.deployed();

  //     // Create DSA for user
  //     dsaAddress = await createDSA(web3);
  //     [userWallet] = await ethers.getSigners();
  //     userAddress = await userWallet.getAddress();
  //     // deploy Maker vault for user
  //     await createMakerVault(web3, dsaAddress, ETH_10, DAI_150);
  //   });

  //   it("creates a Gelato optimizer for the latest Maker Vault", async () => {
  //     // ======= Condition setup ======
  //     // We instantiate the Rebalance Condition:
  //     // Compound APY needs to be 10000000 per second points higher than DSR
  //     const MIN_SPREAD = "10000000";

  //     // ======= Gelato Task Setup =========
  //     // For testing purpose
  //     const GAS_LIMIT = "4000000";
  //     const GAS_PRICE_CEIL = ethers.utils.parseUnits("1000", "gwei");

  //     // ======= Gelato Task Provision =========
  //     // For testing purpose
  //     const TASK_AUTOMATION_FUNDS = await gelatoCore.minExecProviderFunds(
  //       GAS_LIMIT,
  //       GAS_PRICE_CEIL
  //     );

  //     // Create Gelato Optimizer
  //     const taskReceipt = await createGelatoOptimizerAave(
  //       web3,
  //       dsaAddress,
  //       ETH_10,
  //       DAI_150,
  //       mockCMI.address,
  //       mockCCI.address,
  //       conditionCompareUints.address,
  //       conditionHasMakerVault.address
  //     );

  //     expect(await gelatoCore.isExecutorMinStaked(userAddress)).to.be.true;

  //     expect(await gelatoCore.providerFunds(dsaAddress)).to.be.gte(
  //       TASK_AUTOMATION_FUNDS
  //     );
  //     expect(
  //       await gelatoCore.isProviderLiquid(dsaAddress, GAS_LIMIT, GAS_PRICE_CEIL)
  //     );
  //     expect(await gelatoCore.executorByProvider(dsaAddress)).to.be.equal(
  //       userAddress
  //     );
  //     expect(
  //       await gelatoCore.isModuleProvided(
  //         dsaAddress,
  //         // @ts-ignore
  //         constants.ProviderModuleDSA
  //       )
  //     ).to.be.true;

  //     // ======= 📣 TASK EXECUTION 📣 =========
  //     // This stuff is normally automated by the Gelato Network and Dapp Developers
  //     // and their Users don't have to take care of it. However, for local testing
  //     // we simulate the Gelato Execution logic.

  //     // First we fetch the gelatoGasPrice as fed by ChainLink oracle. Gelato
  //     // allows Users to specify a maximum fast gwei gas price for their Tasks
  //     // to remain executable up until.
  //     const gelatoGasPrice = await bre.run("fetchGelatoGasPrice");
  //     expect(gelatoGasPrice).to.be.lte(GAS_PRICE_CEIL);

  //     // Let's first check if our Task is executable. Since both MockCCI and MockCMI
  //     // start with a normalized per second rate of APY_2_PERCENT_IN_SECONDS
  //     // (1000000000627937192491029810 in 10**27 precision) in both of them, we
  //     // expect ConditionNotOk because ANotGreaterOrEqualToBbyMinspread.
  //     // Check out contracts/ConditionCompareUintsFromTwoSources.sol to see how
  //     // how the comparison of MockCCI and MockCMI is implemented in Condition code.
  //     expect(
  //       await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
  //     ).to.be.equal("ConditionNotOk:ANotGreaterOrEqualToBbyMinspread");

  //     // We defined a MIN_SPREAD of 10000000 points in the per second rate
  //     // for our ConditionCompareUintsFromTwoSources. So we now
  //     // set the CDAI.supplyRatePerSecond to be 10000000 higher than MockCCI.dsr
  //     // and expect it to mean that our Task becomes executable.
  //     await mockCMI.setSupplyRatePerSecond(
  //       (await mockCCI.dsr()).add(MIN_SPREAD)
  //     );

  //     expect(
  //       await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
  //     ).to.be.equal("OK");

  //     // For testing we now simulate automatic Task Execution ❗
  //     // await expect(
  //     await gelatoCore.exec(taskReceipt, {
  //       gasPrice: gelatoGasPrice, // Executor must use gelatoGasPrice (Chainlink fast gwei)
  //       gasLimit: GAS_LIMIT,
  //     })
  //     // ).to.emit(gelatoCore, "LogExecSuccess");
  //     console.log((await dsaSdk.aave.getPosition(dsaAddress)).dai)
  //     console.log((await dsaSdk.aave.getPosition(dsaAddress)).eth)
  //     console.log(await dsaSdk.maker.getVaults(dsaAddress))

  //     let dsa = new Contract(dsaAddress, InstaAccount.abi, userWallet);
  //     // Open vault
  //     const depositAave = abiEncodeWithSelector(ConnectAave_ABI, "deposit", [
  //       "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", ETH_10, 0, 0]);

  //     // await spells.add({
  //     //   connector: "aave",
  //     //   method: "deposit",
  //     //   args: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee ", ETH_10, 0, 0]
  //     // });
  //     console.log(await dsa.cast(
  //       [
  //         //@ts-ignore
  //         constants.ConnectAave,
  //       ],
  //       [depositAave],
  //       userAddress
  //     ))

  //     console.log((await dsaSdk.aave.getPosition(dsaAddress)).dai)
  //     console.log((await dsaSdk.aave.getPosition(dsaAddress)).eth)
  //     console.log(await dsaSdk.maker.getVaults(dsaAddress))

  //     // Checking that a 150 DAI borrow position is open on Aave
  //     expect((await dsaSdk.aave.getPosition(dsaAddress)).dai.borrow).to.eq(
  //       150
  //     );
  //     // Checking that the Maker flash loan has been closed
  //     const vault = await dsaSdk.maker.getVaults(dsaAddress);
  //     let debt;
  //     Object.keys(vault).forEach((key) => {
  //       debt = vault[key].debt;
  //     });
  //     expect(debt).to.eq(0);
  //   });

  //   it("refinancing shouldn't happen if not enough DAi in the DSA", async () => {
  //     // ======= Condition setup ======
  //     // We instantiate the Rebalance Condition:
  //     // Compound APY needs to be 10000000 per second points higher than DSR
  //     const MIN_SPREAD = "10000000";

  //     // ======= Gelato Task Setup =========
  //     // For testing purpose
  //     const GAS_LIMIT = "4000000";
  //     const GAS_PRICE_CEIL = ethers.utils.parseUnits("1000", "gwei");

  //     // Create Gelato Optimizer
  //     const taskReceipt = await createGelatoOptimizerAave(
  //       web3,
  //       dsaAddress,
  //       ETH_10,
  //       DAI_150,
  //       mockCMI.address,
  //       mockCCI.address,
  //       conditionCompareUints.address,
  //       conditionHasMakerVault.address
  //     );

  //     // ======= 📣 TASK EXECUTION 📣 =========

  //     // First we fetch the gelatoGasPrice as fed by ChainLink oracle. Gelato
  //     // allows Users to specify a maximum fast gwei gas price for their Tasks
  //     // to remain executable up until.
  //     const gelatoGasPrice = await bre.run("fetchGelatoGasPrice");
  //     expect(gelatoGasPrice).to.be.lte(GAS_PRICE_CEIL);

  //     // We defined a MIN_SPREAD of 10000000 points in the per second rate
  //     // for our ConditionCompareUintsFromTwoSources. So we now
  //     // set the CDAI.supplyRatePerSecond to be 10000000 higher than MockCCI.dsr
  //     // and expect it to mean that our Task becomes executable.
  //     await mockCMI.setSupplyRatePerSecond(
  //       (await mockCCI.dsr()).add(MIN_SPREAD)
  //     );

  //     // Check that with 150 DAI, the task is executable
  //     expect(
  //       await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
  //     ).to.be.equal("OK");

  //     // Withdraw the DAI
  //     const withdrawData = await bre.run("abi-encode-with-selector", {
  //       abi: ConnectBasic.abi,
  //       functionName: "withdraw",
  //       inputs: [constants.DAI, DAI_150, userAddress, 0, 0],
  //     });
  //     let dsa = new Contract(dsaAddress, InstaAccount.abi, userWallet);
  //     const gasLimit = ethers.BigNumber.from(1000000);
  //     const gasPrice = ethers.utils.parseUnits("20", "gwei");
  //     await dsa.cast([constants.ConnectBasic], [withdrawData], userAddress, {
  //       gasLimit,
  //       gasPrice,
  //     })

  //     // Now the task shouldn't be executable anymore
  //     expect(
  //       await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
  //     ).to.be.equal("ConditionNotOk:NotOkERC20BalanceIsNotGreaterThanRefBalance");
  //   });

  //   it("refinancing shouldn't happen if user has no open maker vault", async () => {
  //     // ======= Condition setup ======
  //     // We instantiate the Rebalance Condition:
  //     // Compound APY needs to be 10000000 per second points higher than DSR
  //     const MIN_SPREAD = "10000000";

  //     // ======= Gelato Task Setup =========
  //     // For testing purpose
  //     const GAS_LIMIT = "4000000";
  //     const GAS_PRICE_CEIL = ethers.utils.parseUnits("1000", "gwei");

  //     // Create Gelato Optimizer
  //     const taskReceipt = await createGelatoOptimizerAave(
  //       web3,
  //       dsaAddress,
  //       ETH_10,
  //       DAI_150,
  //       mockCMI.address,
  //       mockCCI.address,
  //       conditionCompareUints.address,
  //       conditionHasMakerVault.address
  //     );

  //     // ======= 📣 TASK EXECUTION 📣 =========

  //     // First we fetch the gelatoGasPrice as fed by ChainLink oracle. Gelato
  //     // allows Users to specify a maximum fast gwei gas price for their Tasks
  //     // to remain executable up until.
  //     const gelatoGasPrice = await bre.run("fetchGelatoGasPrice");
  //     expect(gelatoGasPrice).to.be.lte(GAS_PRICE_CEIL);

  //     // We defined a MIN_SPREAD of 10000000 points in the per second rate
  //     // for our ConditionCompareUintsFromTwoSources. So we now
  //     // set the CDAI.supplyRatePerSecond to be 10000000 higher than MockCCI.dsr
  //     // and expect it to mean that our Task becomes executable.
  //     await mockCMI.setSupplyRatePerSecond(
  //       (await mockCCI.dsr()).add(MIN_SPREAD)
  //     );

  //     // Check that with an open maker vault, the task is executable
  //     expect(
  //       await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
  //     ).to.be.equal("OK");

  //     // Payback Maker Vault with all the DAI
  //     const connectorPaybackMakerVault = await bre.run("abi-encode-with-selector", {
  //       abi: ConnectMaker.abi,
  //       functionName: "payback",
  //       inputs: [0, DAI_150, 0, 0],
  //     });
  //     // // Withdraw ETH from Vault
  //     const connectorWithdrawFromMakerVault = await bre.run("abi-encode-with-selector", {
  //       abi: ConnectMaker.abi,
  //       functionName: "withdraw",
  //       inputs: [0, ETH_10, 0, 0],
  //     });
  //     const connectorCloseMakerVault = await bre.run("abi-encode-with-selector", {
  //       abi: ConnectMaker.abi,
  //       functionName: "close",
  //       inputs: [0],
  //     });
  //     let dsa = new Contract(dsaAddress, InstaAccount.abi, userWallet);
  //     const gasLimit = ethers.BigNumber.from(1000000);
  //     const gasPrice = ethers.utils.parseUnits("20", "gwei");
  //     await dsa.cast([constants.ConnectMaker, constants.ConnectMaker, constants.ConnectMaker], [connectorPaybackMakerVault, connectorWithdrawFromMakerVault, connectorCloseMakerVault], userAddress, {
  //       gasLimit,
  //       gasPrice,
  //     })

  //     // Let's get the test user 100 DAI++ from Uniswap
  //     // TODO use instadapp connector for this
  //     const daiUniswapExchange = await ethers.getContractAt(
  //       IUniswapExchange.abi,
  //       // @ts-ignore
  //       constants.DAI_UNISWAP
  //     );
  //     await daiUniswapExchange.ethToTokenTransferInput(
  //       1,
  //       2525644800, // random timestamp in the future (year 2050)
  //       userAddress,
  //       {
  //         value: ethers.utils.parseEther("2"),
  //       }
  //     );
  //     let dai = await ethers.getContractAt(IERC20.abi, constants.DAI);
  //     await dai.transfer(dsaAddress, DAI_150);
  //     expect(await dai.balanceOf(dsaAddress)).to.be.gte(DAI_150);

  //     // Now the task shouldn't be executable anymore
  //     expect(
  //       await gelatoCore.canExec(taskReceipt, GAS_LIMIT, gelatoGasPrice)
  //     ).to.be.equal("ConditionNotOk:No open vault");
  //   });
  // });
});
