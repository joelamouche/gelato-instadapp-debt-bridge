// running `npx buidler test` automatically makes use of buidler-waffle plugin
// => only dependency we need is "chai"
const { expect } = require("chai");
const bre = require("@nomiclabs/buidler");
const { ethers } = bre;
const GelatoCoreLib = require("@gelatonetwork/core");
const { BigNumber } = require("ethers");
const DSA = require("dsa-sdk");
const Web3 = require("web3");
const { sleep } = GelatoCoreLib;
export {};

// Set up dsa sdk from instaDapp to get resolvers
const web3 = new Web3("http://localhost:8545");
const dsaSdk = new DSA(web3);

// Constants
const ETH_Address = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const ETH_10 = ethers.utils.parseEther("10");
const DAI_150 = ethers.utils.parseUnits("150", 18);
const APY_2_PERCENT_IN_SECONDS = BigNumber.from("1000000000627937192491029810");

// Contracts
const InstaIndex = require("../pre-compiles/InstaIndex.json");
const InstaList = require("../pre-compiles/InstaList.json");
const InstaAccount = require("../pre-compiles/InstaAccount.json");
const ConnectAuth = require("../pre-compiles/ConnectAuth.json");
const ConnectMaker = require("../pre-compiles/ConnectMaker.json");
const ConnectInstaPool = require("../pre-compiles/ConnectInstaPool.json");
const ConnectCompound = require("../pre-compiles/ConnectCompound.json");
const IERC20 = require("../pre-compiles/IERC20.json");
const ProviderModuleDSA_ABI = require("../pre-compiles/ProviderModuleDSA_ABI.json");

const ConnectGelato_ABI = require("../pre-compiles/ConnectGelato_ABI");

describe("Move DAI Debt from Maker to Compound", function () {
  this.timeout(0);
  if (bre.network.name !== "ganache") {
    console.error("Test Suite is meant to be run on ganache only");
    process.exit(1);
  }
  // Wallet to use for local testing
  let userWallet;
  let userAddress;
  let dsaAddress;

  // Deployed instances
  let connectMaker;
  let connectCompound;
  let gelatoCore;
  let dai;
  let connectGelato;
  let providerModuleDSA;

  // Contracts to deploy and use for local testing
  let dsa;
  let mockDSR;
  let mockCDAI;
  let conditionCompareUints;

  before(async function () {
    // Get Test Wallet for local testnet
    [userWallet] = await ethers.getSigners();
    userAddress = await userWallet.getAddress();

    // Ganache default accounts prefilled with at least 10eth (100 ETH)
    expect(await userWallet.getBalance()).to.be.gt(ETH_10);

    // ===== DSA SETUP ==================
    const instaIndex = await ethers.getContractAt(
      InstaIndex.abi,
      bre.network.config.InstaIndex
    );
    const instaList = await ethers.getContractAt(
      InstaList.abi,
      bre.network.config.InstaList
    );
    connectMaker = await ethers.getContractAt(
      ConnectMaker.abi,
      bre.network.config.ConnectMaker
    );
    connectCompound = await ethers.getContractAt(
      ConnectCompound.abi,
      bre.network.config.ConnectCompound
    );

    // Deploy DSA and get and verify ID of newly deployed DSA
    const dsaIDPrevious = await instaList.accounts();
    await expect(instaIndex.build(userAddress, 1, userAddress)).to.emit(
      instaIndex,
      "LogAccountCreated"
    );
    const dsaID = dsaIDPrevious.add(1);
    await expect(await instaList.accounts()).to.be.equal(dsaID);

    // Instantiate the InstaDapp DSA
    dsaAddress = await instaList.accountAddr(dsaID);
    dsa = await ethers.getContractAt(InstaAccount.abi, dsaAddress);

    // ===== GELATO SETUP ==================
    gelatoCore = await ethers.getContractAt(
      GelatoCoreLib.GelatoCore.abi,
      bre.network.config.GelatoCore
    );

    // Add GelatoCore as auth on InstaDapp DSA
    const addAuthData = await bre.run("abi-encode-with-selector", {
      abi: ConnectAuth.abi,
      functionName: "add",
      inputs: [gelatoCore.address],
    });
    await dsa.cast(
      [bre.network.config.ConnectAuth],
      [addAuthData],
      userAddress
    );
    expect(await dsa.isAuth(gelatoCore.address)).to.be.true;

    // Instantiate ConnectGelato from mainnet
    connectGelato = await ethers.getContractAt(
      ConnectGelato_ABI,
      bre.network.config.ConnectGelato
    );

    // get DSA from mainnet
    providerModuleDSA = await ethers.getContractAt(
      ProviderModuleDSA_ABI,
      //@ts-ignore
      bre.network.config.ProviderModuleDSA
    );

    // Deploy Mocks for Testing
    const MockCDAI = await ethers.getContractFactory("MockCDAI");
    mockCDAI = await MockCDAI.deploy(APY_2_PERCENT_IN_SECONDS);
    await mockCDAI.deployed();

    const MockDSR = await ethers.getContractFactory("MockDSR");
    mockDSR = await MockDSR.deploy(APY_2_PERCENT_IN_SECONDS);
    await mockDSR.deployed();

    // Deploy Gelato Conditions for Testing
    const ConditionCompareUintsFromTwoSources = await ethers.getContractFactory(
      "ConditionCompareUintsFromTwoSources"
    );
    conditionCompareUints = await ConditionCompareUintsFromTwoSources.deploy();
    await conditionCompareUints.deployed();

    // ===== Dapp Dependencies SETUP ==================

    // Let's get open a maker vault with 10 eth, using instaDapp

    // First transfer 20 eth to the DSA
    const gasLimit = ethers.BigNumber.from(1000000);
    const gasPrice = ethers.utils.parseUnits("20", "gwei");

    const initialWalletBalance = await userWallet.getBalance();
    expect(await ethers.provider.getBalance(dsaAddress)).to.be.equal(0);
    await userWallet.sendTransaction({
      to: dsaAddress,
      value: ethers.utils.parseEther("20"),
      gasLimit,
      gasPrice,
    });
    expect(await userWallet.getBalance()).to.be.lt(
      initialWalletBalance.sub(ethers.utils.parseEther("20"))
    );
    expect(await ethers.provider.getBalance(dsaAddress)).to.be.equal(
      ethers.utils.parseEther("20")
    );

    // Open vault
    const openVaultData = await bre.run("abi-encode-with-selector", {
      abi: ConnectMaker.abi,
      functionName: "open",
      inputs: ["ETH-A"],
    });

    // Deposit 10 eth
    const depositEthData = await bre.run("abi-encode-with-selector", {
      abi: ConnectMaker.abi,
      functionName: "deposit",
      inputs: [0, ETH_10, 0, 0],
    });

    // Borrow max DAI amount (-1 is maximum) //TODO: get max amount
    const borrowDaiData = await bre.run("abi-encode-with-selector", {
      abi: ConnectMaker.abi,
      functionName: "borrow",
      inputs: [0, DAI_150, 0, 0],
    });

    // Casting it twice makes it easier for the network
    await dsa.cast(
      [bre.network.config.ConnectMaker, bre.network.config.ConnectMaker],
      [openVaultData, depositEthData],
      userAddress
    );

    await dsa.cast(
      [bre.network.config.ConnectMaker],
      [borrowDaiData],
      userAddress
    );

    // Check that 10 eth was trasnfered to the vaultv
    expect(Number(await ethers.provider.getBalance(dsaAddress))).to.be.equal(
      Number(ETH_10)
    );

    // Check that user's dsa received 150 DAI
    dai = await ethers.getContractAt(IERC20.abi, bre.network.config.DAI);
    expect(Number(await dai.balanceOf(dsaAddress))).to.eq(Number(DAI_150));

    console.log("Vault setup with 150 DAI Debt");
  });

  it("#1: Gelato refinances DAI from Maker vault=>Compound, if better rate", async function () {
    // ======= Condition setup ======
    // We instantiate the Rebalance Condition:
    // Compound APY needs to be 10000000 per second points higher than DSR
    const MIN_SPREAD = "10000000";
    const rebalanceCondition = new GelatoCoreLib.Condition({
      inst: conditionCompareUints.address,
      data: await conditionCompareUints.getConditionData(
        mockCDAI.address, // We are in DSR so we compare against CDAI => SourceA=CDAI
        mockDSR.address, // SourceB=DSR
        await bre.run("abi-encode-with-selector", {
          abi: require("../artifacts/MockCDAI.json").abi,
          functionName: "supplyRatePerSecond",
        }), // CDAI data feed first (sourceAData)
        await bre.run("abi-encode-with-selector", {
          abi: require("../artifacts/MockDSR.json").abi,
          functionName: "dsr",
        }), // DSR data feed second (sourceBData)
        MIN_SPREAD
      ),
    });

    // ======= Action/Spells setup ======
    // To assimilate to DSA SDK
    const spells: any[] = [];

    let borrowAmount = dsaSdk.tokens.fromDecimal(200000, "dai");
    // Borrow DAI from InstaPool
    const connectorBorrowFromInstaPool = new GelatoCoreLib.Action({
      addr: bre.network.config.ConnectInstaPool,
      data: await bre.run("abi-encode-with-selector", {
        abi: ConnectInstaPool.abi,
        functionName: "flashBorrow",
        inputs: [bre.network.config.DAI, borrowAmount, 0, 0],
      }),
      operation: GelatoCoreLib.Operation.Delegatecall,
    });
    // spells.push(connectorBorrowFromInstaPool); //TODO: fix flashloan from instapool

    // Payback Maker Vault with 150 DAI
    const connectorPaybackMakerVault = new GelatoCoreLib.Action({
      addr: bre.network.config.ConnectMaker,
      data: await bre.run("abi-encode-with-selector", {
        abi: ConnectMaker.abi,
        functionName: "payback",
        inputs: [0, dsaSdk.maxValue, 0, "534"], //TODO: use max payback and save it with setId
      }),
      operation: GelatoCoreLib.Operation.Delegatecall,
    });
    spells.push(connectorPaybackMakerVault);

    // Withdraw ETH from Vault
    const connectorWithdrawFromMakerVault = new GelatoCoreLib.Action({
      addr: bre.network.config.ConnectMaker,
      data: await bre.run("abi-encode-with-selector", {
        abi: ConnectMaker.abi,
        functionName: "withdraw",
        inputs: [0, dsaSdk.maxValue, 0, "987"], //TODO: use max withdraw and save it with setId
      }),
      operation: GelatoCoreLib.Operation.Delegatecall,
    });
    spells.push(connectorWithdrawFromMakerVault);

    // Deposit ETH into Compound Vault
    const connectorDepositIntoCompound = new GelatoCoreLib.Action({
      addr: bre.network.config.ConnectCompound,
      data: await bre.run("abi-encode-with-selector", {
        abi: ConnectCompound.abi,
        functionName: "deposit",
        inputs: [ETH_Address, ETH_10, "987", 0], //TODO: use saved withdrawn amount and save it with setId
      }),
      operation: GelatoCoreLib.Operation.Delegatecall,
    });
    spells.push(connectorDepositIntoCompound);

    // Borrow DAI from Compound vault
    const connectorBorrowFromCompound = new GelatoCoreLib.Action({
      addr: bre.network.config.ConnectCompound,
      data: await bre.run("abi-encode-with-selector", {
        abi: ConnectCompound.abi,
        functionName: "borrow",
        inputs: [bre.network.config.DAI, dsaSdk.maxValue, "534", 0], //TODO: use saved withdrawn amount and save it with setId
      }),
      operation: GelatoCoreLib.Operation.Delegatecall,
    });
    spells.push(connectorBorrowFromCompound);

    // Payback DAI InstaPool
    const connectorPaybackInstaPool = new GelatoCoreLib.Action({
      addr: bre.network.config.ConnectInstaPool,
      data: await bre.run("abi-encode-with-selector", {
        abi: ConnectInstaPool.abi,
        functionName: "flashPayback",
        inputs: [bre.network.config.DAI, 0, 0],
      }),
      operation: GelatoCoreLib.Operation.Delegatecall,
    });
    // spells.push(connectorPaybackInstaPool);

    // ======= Gelato Task Setup =========
    // A Gelato Task just combines Conditions with Actions
    // You also specify how much GAS a Task consumes at max and the ceiling
    // gas price under which you are willing to auto-transact. There is only
    // one gas price in the current Gelato system: fast gwei read from Chainlink.
    const GAS_LIMIT = "4000000";
    const GAS_PRICE_CEIL = ethers.utils.parseUnits("1000", "gwei");
    const taskRefinanceMakerToCompoundIfBetter = new GelatoCoreLib.Task({
      conditions: [rebalanceCondition],
      actions: spells,
      selfProviderGasLimit: GAS_LIMIT,
      selfProviderGasPriceCeil: GAS_PRICE_CEIL,
    });

    // ======= Gelato Provider setup ======
    // Someone needs to pay for gas for automatic Task execution on Gelato.
    // Gelato has the concept of a "Provider" to denote who is providing (depositing)
    // ETH on Gelato in order to pay for automation gas. In our case, the User
    // is paying for his own automation gas. Therefore, the User is a "Self-Provider".
    // But since Gelato only talks to smart contract accounts, the User's DSA proxy
    // plays the part of the "Self-Provider" on behalf of the User behind the DSA.
    // A GelatoProvider is an object with the address of the provider - in our case
    // the DSA address - and the address of the "ProviderModule". This module
    // fulfills certain functions like encoding the execution payload for the Gelato
    // protocol. Check out ./contracts/ProviderModuleDSA.sol to see what it does.
    const gelatoSelfProvider = new GelatoCoreLib.GelatoProvider({
      addr: dsa.address,
      //@ts-ignore
      module: bre.network.config.ProviderModuleDSA,
    });

    // ======= Executor Setup =========
    // For local Testing purposes our test User account will play the role of the Gelato
    // Executor network because this logic is non-trivial to fork into a local instance
    await gelatoCore.stakeExecutor({
      value: await gelatoCore.minExecutorStake(),
    });
    expect(await gelatoCore.isExecutorMinStaked(userAddress)).to.be.true;

    // ======= Gelato Task Provision =========
    // Gelato requires some initial setup via its multiProvide API
    // We must 1) provide ETH to pay for future automation gas, 2) we must
    // assign an Executor network to the Task, 3) we must tell Gelato what
    // "ProviderModule" we want to use for our Task.
    // Since our DSA proxy is the one through which we interact with Gelato,
    // we must do this setup via the DSA proxy by using ConnectGelato
    const TASK_AUTOMATION_FUNDS = await gelatoCore.minExecProviderFunds(
      GAS_LIMIT,
      GAS_PRICE_CEIL
    );

    await dsa.cast(
      //@ts-ignore
      [bre.network.config.ConnectGelato], // targets
      [
        await bre.run("abi-encode-with-selector", {
          abi: ConnectGelato_ABI,
          functionName: "multiProvide",
          inputs: [
            userAddress,
            [],
            //@ts-ignore
            [bre.network.config.ProviderModuleDSA],
            TASK_AUTOMATION_FUNDS,
            0,
            0,
          ],
        }),
      ], // datas
      userAddress, // origin
      {
        value: TASK_AUTOMATION_FUNDS,
        gasLimit: 5000000,
      }
    );

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
        bre.network.config.ProviderModuleDSA
      )
    ).to.be.true;

    // ======= 📣 TASK SUBMISSION 📣 =========
    // In Gelato world our DSA is the User. So we must submit the Task
    // to Gelato via our DSA and hence use ConnectGelato again.
    const expiryDate = 0;
    await expect(
      dsa.cast(
        //@ts-ignore
        [bre.network.config.ConnectGelato], // targets
        [
          await bre.run("abi-encode-with-selector", {
            abi: ConnectGelato_ABI,
            functionName: "submitTask",
            inputs: [
              gelatoSelfProvider,
              taskRefinanceMakerToCompoundIfBetter,
              expiryDate,
            ],
          }),
        ], // datas
        userAddress, // origin
        {
          gasLimit: 5000000,
        }
      )
    ).to.emit(gelatoCore, "LogTaskSubmitted");

    // Task Receipt: a successfully submitted Task in Gelato
    // is wrapped in a TaskReceipt. For testing we instantiate the TaskReceipt
    // for our to be submitted Task.
    const taskReceiptId = await gelatoCore.currentTaskReceiptId();
    const taskReceipt = new GelatoCoreLib.TaskReceipt({
      id: taskReceiptId,
      userProxy: dsa.address,
      provider: gelatoSelfProvider,
      tasks: [taskRefinanceMakerToCompoundIfBetter],
      expiryDate,
    });

    // ======= 📣 TASK EXECUTION 📣 =========
    // This stuff is normally automated by the Gelato Network and Dapp Developers
    // and their Users don't have to take care of it. However, for local testing
    // we simulate the Gelato Execution logic.

    // First we fetch the gelatoGasPrice as fed by ChainLink oracle. Gelato
    // allows Users to specify a maximum fast gwei gas price for their Tasks
    // to remain executable up until.
    const gelatoGasPrice = await bre.run("fetchGelatoGasPrice");
    expect(gelatoGasPrice).to.be.lte(
      taskRefinanceMakerToCompoundIfBetter.selfProviderGasPriceCeil
    );

    // Let's first check if our Task is executable. Since both MockDSR and MockCDAI
    // start with a normalized per second rate of APY_2_PERCENT_IN_SECONDS
    // (1000000000627937192491029810 in 10**27 precision) in both of them, we
    // expect ConditionNotOk because ANotGreaterOrEqualToBbyMinspread.
    // Check out contracts/ConditionCompareUintsFromTwoSources.sol to see how
    // how the comparison of MockDSR and MockCDAI is implemented in Condition code.
    expect(
      await gelatoCore.canExec(
        taskReceipt,
        taskRefinanceMakerToCompoundIfBetter.selfProviderGasLimit,
        gelatoGasPrice
      )
    ).to.be.equal("ConditionNotOk:ANotGreaterOrEqualToBbyMinspread");

    // We defined a MIN_SPREAD of 10000000 points in the per second rate
    // for our ConditionCompareUintsFromTwoSources. So we now
    // set the CDAI.supplyRatePerSecond to be 10000000 higher than MockDSR.dsr
    // and expect it to mean that our Task becomes executable.
    await mockCDAI.setSupplyRatePerSecond(
      (await mockDSR.dsr()).add(MIN_SPREAD)
    );
    expect(
      await gelatoCore.canExec(
        taskReceipt,
        taskRefinanceMakerToCompoundIfBetter.selfProviderGasLimit,
        gelatoGasPrice
      )
    ).to.be.equal("OK");

    // For testing we now simulate automatic Task Execution ❗
    await expect(
      gelatoCore.exec(taskReceipt, {
        gasPrice: gelatoGasPrice, // Executor must use gelatoGasPrice (Chainlink fast gwei)
        gasLimit: taskRefinanceMakerToCompoundIfBetter.selfProviderGasLimit,
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
