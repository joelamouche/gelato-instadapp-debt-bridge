// running `npx buidler test` automatically makes use of buidler-waffle plugin

import { createDSA } from "../lib/createDSA";
import { createGelatoOptimizer } from "../lib/createGelatoOptimizer";
import { createMakerVault } from "../lib/createMakerVault";

const { expect } = require("chai");
const bre = require("@nomiclabs/buidler");
const { ethers } = bre;
const GelatoCoreLib = require("@gelatonetwork/core");
const { BigNumber } = require("ethers");
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

describe("Move DAI Debt from Maker to Compound WITH LIBS", function () {
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
  let mockCCI;
  let mockCMI;
  let conditionCompareUints;
  let conditionHasMakerVault;

  before(async function () {
    // Get Test Wallet for local testnet
    [userWallet] = await ethers.getSigners();
    userAddress = await userWallet.getAddress();

    // Ganache default accounts prefilled with at least 10eth (100 ETH)
    expect(await userWallet.getBalance()).to.be.gt(ETH_10);

    // ===== DSA SETUP ==================
    // Instantiate the InstaDapp DSA
    dsaAddress = await createDSA(web3);
    dsa = await ethers.getContractAt(InstaAccount.abi, dsaAddress);

    // ===== GELATO SETUP ==================
    gelatoCore = await ethers.getContractAt(
      GelatoCoreLib.GelatoCore.abi,
      constants.GelatoCore
    );

    // Add GelatoCore as auth on InstaDapp DSA
    const addAuthData = await bre.run("abi-encode-with-selector", {
      abi: ConnectAuth.abi,
      functionName: "add",
      inputs: [gelatoCore.address],
    });
    await dsa.cast([constants.ConnectAuth], [addAuthData], userAddress);
    expect(await dsa.isAuth(gelatoCore.address)).to.be.true;

    // Instantiate ConnectGelato from mainnet
    connectGelato = await ethers.getContractAt(
      ConnectGelato_ABI,
      constants.ConnectGelato
    );

    // get DSA from mainnet
    providerModuleDSA = await ethers.getContractAt(
      ProviderModuleDSA_ABI,
      //@ts-ignore
      constants.ProviderModuleDSA
    );

    // Deploy Mocks for Testing
    const MockCMI = await ethers.getContractFactory("MockCMI");
    mockCMI = await MockCMI.deploy(APY_2_PERCENT_IN_SECONDS);
    await mockCMI.deployed();

    const MockCCI = await ethers.getContractFactory("MockCCI");
    mockCCI = await MockCCI.deploy(APY_2_PERCENT_IN_SECONDS);
    await mockCCI.deployed();

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

    // ===== Dapp Dependencies SETUP ==================

    // Let's get open a maker vault with 10 eth, using instaDapp
    const initialWalletBalance = await ethers.provider.getBalance(userAddress);

    const vaults = await createMakerVault(web3, dsaAddress, ETH_10, DAI_150);

    // Check that 10 eth was transferred to the vault
    let debt, col;
    Object.keys(vaults).forEach((key) => {
      debt = vaults[key].debt;
      col = vaults[key].col;
    });
    expect(debt).to.eq(150);
    expect(col).to.eq(10);

    // Check that user has 10 eth less
    expect(await ethers.provider.getBalance(userAddress)).to.be.lt(
      initialWalletBalance.sub(ETH_10)
    );

    // Check that user's dsa received 150 DAI
    dai = await ethers.getContractAt(IERC20.abi, constants.DAI);
    expect(Number(await dai.balanceOf(dsaAddress))).to.eq(Number(DAI_150));

    console.log("Vault setup with 150 DAI Debt");
  });

  it("#1: Gelato refinances DAI from Maker vault=>Compound, if better rate", async function () {
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
      dsa.address,
      ETH_10,
      DAI_150,
      {CMIAddress:mockCMI.address,CCIAddress:mockCCI.address}
    );

    expect(await gelatoCore.isExecutorMinStaked(userAddress)).to.be.true;

    expect(await gelatoCore.providerFunds(dsa.address)).to.be.gte(
      TASK_AUTOMATION_FUNDS
    );
    expect(
      await gelatoCore.isProviderLiquid(dsa.address, GAS_LIMIT, GAS_PRICE_CEIL)
    );
    expect(await gelatoCore.executorByProvider(dsa.address)).to.be.equal(
      userAddress
    );
    expect(
      await gelatoCore.isModuleProvided(
        dsa.address,
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
});
