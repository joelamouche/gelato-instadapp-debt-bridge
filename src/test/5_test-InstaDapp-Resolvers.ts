import { createDSA } from "../lib/createDSA";
import { createMakerVault } from "../lib/createMakerVault";

// => only dependency we need is "chai"
const { expect } = require("chai");
const bre = require("@nomiclabs/buidler");
const { ethers } = bre;
import { BigNumber } from "ethers"
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

// Contracts
const InstaMakerResolver = require("../../pre-compiles/InstaMakerResolver.json");

const CETH_ABI = require("../../pre-compiles/CETH_ABI");
const CDAI_ABI = require("../../pre-compiles/CDAI_ABI");

const CustomMakerInterface = require("../../artifacts/CustomMakerInterface.json")
const CustomCompoundInterface = require("../../artifacts/CustomCompoundInterface.json")

describe("Test our condition source contracts", function () {
  this.timeout(0);
  if (bre.network.name !== "ganache") {
    console.error("Test Suite is meant to be run on ganache only");
    process.exit(1);
  }
  // Wallet to use for local testing
  let dsaAddress: string;

  // Deployed instances
  let instaMakerResolver;
  let addresses;

  // Rates
  let borrowRatePerYearIMR: number;
  let borrowRatePerSecCMI: BigNumber
  let totalBorrowRatePerBlockCTokenContracts: BigNumber

  function calRate(_ilkRate: BigNumber): number {
    let ilkRate = Number(_ilkRate) / 10 ** 27;
    return ilkRate ** 31545000 - 1;
  }
  function calRateFromRate(_ilkRate: BigNumber): number {
    let ilkRate = Number(_ilkRate) / 10 ** 27;
    return (1 + ilkRate) ** 31545000 - 1;
  }
  function round5digits(n: number): number {
    return 0.00001 * Math.round(n * 100000)
  }
  function round1digits(n: number): number {
    return 0.1 * Math.round(n * 10)
  }


  before(async function () {
    dsaAddress = await createDSA(web3);
    addresses = await bre.run("deployContractsMainNet")
    console.log('Contracts Deployed !')
  });

  it("#1: Get Maker Vault data from onChain contract", async function () {
    //verify here https://oasis.app/borrow/markets
    // create vault
    let vaults = await createMakerVault(web3, dsaAddress, ETH_10, DAI_150);

    // Check vault debt and collateral
    let lastVaultFromDSASDK;
    Object.keys(vaults).forEach((key) => {
      lastVaultFromDSASDK = vaults[key].rate;
    });

    // Instantiate Maker Resolver contract
    instaMakerResolver = await ethers.getContractAt(
      InstaMakerResolver.abi,
      constants.InstaMakerResolver
    );

    // gets borrow rate per seconde
    let colInfo = (await instaMakerResolver.getColInfo(["ETH-A"]))[0]
    borrowRatePerYearIMR = calRate(colInfo.borrowRate) * 100
    console.log("borrowRatePerYearIMR", borrowRatePerYearIMR)
    //if (borrowRate == 1e+27) { borrowRate = 0 }
    expect(borrowRatePerYearIMR).to.eq(lastVaultFromDSASDK)
  });
  it("#2: Get Compound data from onChain contract", async function () {
    // In compound, the interest paid is the borrow rate of DAI minus the supply rate of ETH

    const ethSupplyRate: number = (await dsaSdk.compound.getPosition(dsaAddress)).eth.supplyRate
    const daiBorrowRate: number = (await dsaSdk.compound.getPosition(dsaAddress)).dai.borrowRate
    const totalBorrowRateCompoundSDK: number = daiBorrowRate - ethSupplyRate
    console.log('totalBorrowRateCompoundSDK', totalBorrowRateCompoundSDK)

    const cDai = await ethers.getContractAt(
      CDAI_ABI,
      constants.CDAI
    );

    const cEth = await ethers.getContractAt(
      CETH_ABI,
      constants.CETH
    );

    // 18digits?
    let supplyRatePerBlock: BigNumber = await cEth.supplyRatePerBlock()
    let borrowRatePerBlock: BigNumber = await cDai.borrowRatePerBlock()
    totalBorrowRatePerBlockCTokenContracts = borrowRatePerBlock.sub(supplyRatePerBlock)
    let totalBorrowRatePerYearCTokenContracts: number = calRateFromRate(totalBorrowRatePerBlockCTokenContracts.mul(1e9).div(15)) * 100
    console.log('totalBorrowRatePerYearCTokenContracts', totalBorrowRatePerYearCTokenContracts, "totalBorrowRateCompoundSDK", totalBorrowRateCompoundSDK)
    // the borrow rate from the contract and from the sdk are the same to a 0.1 precision due to block=>second approx conversion
    expect(round1digits(totalBorrowRatePerYearCTokenContracts - round1digits(totalBorrowRateCompoundSDK))).to.be.lte(0.1)
  });

  it("#3: Test CustomMakerInterface", async function () {
    // Instantiate Maker Resolver contract
    let customMakerInterface = await ethers.getContractAt(
      CustomMakerInterface.abi,
      addresses.customMakerInterface
    );

    // gets borrow rate per second from contract, 18 digits
    borrowRatePerSecCMI = await customMakerInterface.getBorrowRate()

    // gets borrow rate per second from IMR contract, 27 digits
    let borrowRatePerYearCustom = calRateFromRate(borrowRatePerSecCMI.mul(1e9)) * 100

    // expect a 0.00001 precision with IMR result
    expect(round5digits(borrowRatePerYearIMR)).to.eq(round5digits(borrowRatePerYearCustom))
  });
  it("#4: Test CustomCompoundInterface", async function () {
    // Instantiate Maker Resolver contract
    let customCompoundInterface = await ethers.getContractAt(
      CustomCompoundInterface.abi,
      addresses.customCompoundInterface
    );

    // gets borrow rate per second from contract, 18 digits
    let borrowRatePerSecCCI: BigNumber = await customCompoundInterface.getETHDAIBorrowRatePerSecond()

    const ethSupplyRateSDK = (await dsaSdk.compound.getPosition(dsaAddress)).eth.supplyRate
    const daiBorrowRateSDK = (await dsaSdk.compound.getPosition(dsaAddress)).dai.borrowRate
    const totalBorrowRateSDK = daiBorrowRateSDK - ethSupplyRateSDK
    console.log('totalBorrowRateSDK', totalBorrowRateSDK)
    // expect a 0.1 precision between onchain approx and sdk approx
    expect(round1digits(calRateFromRate(borrowRatePerSecCCI.mul(1e9)) * 100) - round1digits(totalBorrowRateSDK)).to.be.lte(0.11)
  });
});
