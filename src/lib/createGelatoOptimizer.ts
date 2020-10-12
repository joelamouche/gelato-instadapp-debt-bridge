import { ethers, BigNumber, Contract } from "ethers";
import { abiEncodeWithSelector } from "./utils/abiEncodeWithSelector";
import Web3 from "web3";
import { constants } from "../constants/constants";

const GelatoCoreLib = require("@gelatonetwork/core");
const DSA = require("dsa-sdk");

// Constants
const ETH_Address = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const APY_2_PERCENT_IN_SECONDS = BigNumber.from("1000000000627937192491029810");

// Contracts
const InstaAccount = require("../../pre-compiles/InstaAccount.json");
const ConnectMaker = require("../../pre-compiles/ConnectMaker.json");
const ConnectCompound = require("../../pre-compiles/ConnectCompound.json");
const ConnectAuth = require("../../pre-compiles/ConnectAuth.json");
const ConditionCompareUintsFromTwoSources = require("../../artifacts/ConditionCompareUintsFromTwoSources.json");
const ConditionHasOpenMakerVault = require("../../artifacts/ConditionHasOpenMakerVault.json");
const CustomCompoundInterface = require("../../artifacts/CustomCompoundInterface.json");
const CustomMakerInterface = require("../../artifacts/CustomMakerInterface.json");

const ConnectGelato_ABI = require("../../pre-compiles/ConnectGelato_ABI");
const ConditionBalance_ABI = require("../../pre-compiles/ConditionBalance_ABI");

interface OptimizerOptions{
  CMIAddress?: string,
  CCIAddress?: string,
  conditionCompareAddress?: string,
  conditionHasMakerVaultAddress?: string
}

// requires the user to have an open Maker Vault
// NB: it requires mock contract addresses for now but will use actual maker and compound deployed contract in next iteration

export async function createGelatoOptimizer(
  web3: Web3,
  dsaAddress: string,
  eth_amount: BigNumber,
  dai_amount: BigNumber,
  options?:OptimizerOptions
) {
  let gelatoCore; //: IGelatoCore;
  let dsa;
  let conditionCompareUints;
  let conditionBalance;
  let conditionHasOpenMakerVault;

  //setup ethers
  let provider = new ethers.providers.Web3Provider(web3.currentProvider as any);
  let userWallet: ethers.providers.JsonRpcSigner = await provider.getSigner();
  let userAddress: string = await userWallet.getAddress();

  // setup dsa-sdk
  const dsaSdk = new DSA(web3);

  // Instantiate Contracts
  gelatoCore = new Contract(
    constants.GelatoCore,
    GelatoCoreLib.GelatoCore.abi,
    userWallet
  );
  dsa = new Contract(dsaAddress, InstaAccount.abi, userWallet);
  conditionCompareUints = new Contract(
    options &&options.conditionCompareAddress?options.conditionCompareAddress:constants.ConditionCompareUintsFromTwoSources,
    ConditionCompareUintsFromTwoSources.abi,
    userWallet
  );
  conditionBalance = new Contract(
    constants.ConditionBalance,
    ConditionBalance_ABI,
    userWallet
  );
  conditionHasOpenMakerVault = new Contract(
    options &&options.conditionHasMakerVaultAddress?options.conditionHasMakerVaultAddress:constants.ConditionHasMakerVault,
    ConditionHasOpenMakerVault.abi,
    userWallet
  );

  // Add GelatoCore as auth on InstaDapp DSA, if not already done
  if (
    !(await dsaSdk.getAuthByAddress(dsaAddress)).includes(gelatoCore.address)
  ) {
    const addAuthData = abiEncodeWithSelector(ConnectAuth.abi, "add", [
      gelatoCore.address,
    ]);
    await dsa.cast([constants.ConnectAuth], [addAuthData], userAddress);
  }

  // ======= Condition setup ======
  // We instantiate the Rebalance Condition:
  // Compound APY needs to be 10000000 per second points higher than DSR
  const MIN_SPREAD = "10000000";
  const rebalanceCondition = new GelatoCoreLib.Condition({
    inst: conditionCompareUints.address,
    data: await conditionCompareUints.getConditionData(
      options &&options.CMIAddress?options.CMIAddress:constants.CustomMakerInterface,
      options &&options.CCIAddress?options.CCIAddress:constants.CustomCompoundInterface,
      abiEncodeWithSelector(CustomMakerInterface.abi, "getBorrowRate"),
      abiEncodeWithSelector(CustomCompoundInterface.abi, "getETHDAIBorrowRatePerSecond"),
      MIN_SPREAD
    ),
  });
  //Check that user has 150 DAI on their dsa
  const enoughDAICondition = new GelatoCoreLib.Condition({
    inst: conditionBalance.address,
    data: await conditionBalance.getConditionData(
      dsaAddress,
      constants.DAI,
      dai_amount,
      true
    ),
  });
  //Check that user has an open maker vault
  const hasMakerVaultCondition = new GelatoCoreLib.Condition({
    inst: conditionHasOpenMakerVault.address,
    data: await conditionHasOpenMakerVault.getConditionData(
      dsaAddress
    ),
  });


  // ======= Action/Spells setup ======
  // To assimilate to DSA SDK
  const spells: any[] = [];

  // Payback Maker Vault with all the DAI
  const connectorPaybackMakerVault = new GelatoCoreLib.Action({
    addr: constants.ConnectMaker,
    data: abiEncodeWithSelector(
      ConnectMaker.abi,
      "payback",
      [0, dai_amount, 0, 0]
    ),
    operation: GelatoCoreLib.Operation.Delegatecall,
  });
  spells.push(connectorPaybackMakerVault);

  // Withdraw ETH from Vault
  const connectorWithdrawFromMakerVault = new GelatoCoreLib.Action({
    addr: constants.ConnectMaker,
    data: abiEncodeWithSelector(
      ConnectMaker.abi,
      "withdraw",
      [0, dsaSdk.maxValue, 0, 0]
    ),
    operation: GelatoCoreLib.Operation.Delegatecall,
  });
  spells.push(connectorWithdrawFromMakerVault);

  // Deposit ETH into Compound Vault
  const connectorDepositIntoCompound = new GelatoCoreLib.Action({
    addr: constants.ConnectCompound,
    data: abiEncodeWithSelector(
      ConnectCompound.abi,
      "deposit",
      [ETH_Address, eth_amount, 0, 0]
    ),
    operation: GelatoCoreLib.Operation.Delegatecall,
  });
  spells.push(connectorDepositIntoCompound);

  // Borrow DAI from Compound vault
  const connectorBorrowFromCompound = new GelatoCoreLib.Action({
    addr: constants.ConnectCompound,
    data: abiEncodeWithSelector(
      ConnectCompound.abi,
      "borrow",
      [constants.DAI, dai_amount, 0, 0]
    ),
    operation: GelatoCoreLib.Operation.Delegatecall,
  });
  spells.push(connectorBorrowFromCompound);

  // ======= Gelato Task Setup =========
  // A Gelato Task just combines Conditions with Actions
  // You also specify how much GAS a Task consumes at max and the ceiling
  // gas price under which you are willing to auto-transact. There is only
  // one gas price in the current Gelato system: fast gwei read from Chainlink.
  const GAS_LIMIT = "4000000";
  const GAS_PRICE_CEIL = ethers.utils.parseUnits("1000", "gwei");
  const taskRefinanceMakerToCompoundIfBetter = new GelatoCoreLib.Task({
    conditions: [rebalanceCondition, enoughDAICondition, hasMakerVaultCondition],
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
    addr: dsaAddress,
    //@ts-ignore
    module: constants.ProviderModuleDSA,
  });

  // ======= Executor Setup =========
  // For local Testing purposes our test User account will play the role of the Gelato
  // Executor network because this logic is non-trivial to fork into a local instance
  await gelatoCore.stakeExecutor({
    value: await gelatoCore.minExecutorStake(),
  });

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
    [constants.ConnectGelato], // targets
    [
      abiEncodeWithSelector(ConnectGelato_ABI, "multiProvide", [
        userAddress,
        [],
        //@ts-ignore
        [constants.ProviderModuleDSA],
        TASK_AUTOMATION_FUNDS,
        0,
        0,
      ]),
    ], // datas
    userAddress, // origin
    {
      value: TASK_AUTOMATION_FUNDS,
      gasLimit: 5000000,
    }
  );

  // ======= 📣 TASK SUBMISSION 📣 =========
  // In Gelato world our DSA is the User. So we must submit the Task
  // to Gelato via our DSA and hence use ConnectGelato again.
  const expiryDate = 0;
  await dsa.cast(
    //@ts-ignore
    [constants.ConnectGelato], // targets
    [
      abiEncodeWithSelector(ConnectGelato_ABI, "submitTask", [
        gelatoSelfProvider,
        taskRefinanceMakerToCompoundIfBetter,
        expiryDate,
      ]),
    ], // datas
    userAddress, // origin
    {
      gasLimit: 5000000,
    }
  );

  // Task Receipt: a successfully submitted Task in Gelato
  // is wrapped in a TaskReceipt. For testing we instantiate the TaskReceipt
  // for our to be submitted Task.
  const taskReceiptId = await gelatoCore.currentTaskReceiptId();
  return new GelatoCoreLib.TaskReceipt({
    id: taskReceiptId,
    userProxy: dsaAddress,
    provider: gelatoSelfProvider,
    tasks: [taskRefinanceMakerToCompoundIfBetter],
    expiryDate,
  });
}
