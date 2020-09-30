import { createDSA } from "../lib/createDSA";
import { createGelatoOptimizer } from "../lib/createGelatoOptimizer";
import { createMakerVault } from "../lib/createMakerVault";

// => only dependency we need is "chai"
const { expect } = require("chai");
const bre = require("@nomiclabs/buidler");
const { ethers } = bre;
const GelatoCoreLib = require("@gelatonetwork/core");
import { BigNumber } from "ethers"
const DSA = require("dsa-sdk");
const Web3 = require("web3");
import { constants } from "../constants/constants";
export { };

// Set up dsa sdk from instaDapp to get resolvers
const web3 = new Web3("http://localhost:8545");
const ETH_Address = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const dsaSdk = new DSA(web3);

// Constants
const ETH_10 = ethers.utils.parseEther("10");
const DAI_150 = ethers.utils.parseUnits("150", 18);
const APY_2_PERCENT_IN_SECONDS = BigNumber.from("1000000000627937192491029810");

// Contracts
const InstaMakerResolver = require("../../pre-compiles/InstaMakerResolver.json");
const InstaCompoundResolver = require("../../pre-compiles/InstaCompoundResolver.json");

const CETH_ABI = require("../../pre-compiles/CETH_ABI");
const CDAI_ABI = require("../../pre-compiles/CDAI_ABI");

describe("Test our condition source contracts", function () {
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
  let instaMakerResolver;
  let instaCompoundResolver;

  // Contracts to deploy and use for local testing
  let dsa;
  let mockDSR;
  let mockCDAI;
  let conditionCompareUints;

  function calRate(_ilkRate: BigNumber): number {
    let ilkRate = Number(_ilkRate) / 10 ** 27;
    return ilkRate ** 31545000 - 1;
  }
  function calRateFromRate(_ilkRate: BigNumber): number {
    let ilkRate = Number(_ilkRate) / 10 ** 27;
    return (1 + ilkRate) ** 31545000 - 1;
  }
  function truncate5digits(n: number): number {
    return 0.00001 * Math.trunc(n * 100000)
  }
  function truncate1digits(n: number): number {
    return 0.1 * Math.trunc(n * 10)
  }


  before(async function () { });

  it("#1: Get Maker Vault data from onChain contract", async function () {
    //verify here https://oasis.app/borrow/markets

    dsaAddress = await createDSA(web3);
    [userWallet] = await ethers.getSigners();

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
    let borrowRatePerYear = calRate(colInfo.borrowRate) * 100
    console.log("borrowRatePerYear", borrowRatePerYear)
    //if (borrowRate == 1e+27) { borrowRate = 0 }
    expect(borrowRatePerYear).to.eq(lastVaultFromDSASDK)
  });
  it.only("#2: Get Compound data from onChain contract", async function () {
    // In compound, the interest paid is the borrow rate of DAI minus the supply rate of ETH

    dsaAddress = await createDSA(web3);
    [userWallet] = await ethers.getSigners();

    const ethSupplyRate = (await dsaSdk.compound.getPosition(dsaAddress)).eth.supplyRate
    const daiBorrowRate = (await dsaSdk.compound.getPosition(dsaAddress)).dai.borrowRate
    console.log('ethSupplyRate', ethSupplyRate, 'daiBorrowRate', daiBorrowRate)
    const totalBorrowRate = daiBorrowRate - ethSupplyRate
    console.log('totalBorrowRate', totalBorrowRate)

    const cDai = await ethers.getContractAt(
      CDAI_ABI,
      constants.CDAI
    );

    const cEth = await ethers.getContractAt(
      CETH_ABI,
      constants.CETH
    );
    let supplyRatePerBlock = await cEth.supplyRatePerBlock()
    let borrowRatePerBlock = await cDai.borrowRatePerBlock()
    console.log('supplyRatePerBlock', Number(supplyRatePerBlock))
    console.log('borrowRatePerBlock', Number(borrowRatePerBlock))

    //NB: use Cdai to get borrow rate??
    //cETH:0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5
    //https://github.com/compound-developers/compound-supply-examples/blob/master/web3-js-examples/supply-eth-via-web3.js
    //call supplyRatePerBlock()

    // from https://github.com/InstaDApp/dsa-sdk/blob/master/src/resolvers/compound.js
    //with res5 and 6 supply and borrow rates per block 2102400 is number of block per year if 15sec block
    // _position[_key].supplyRate = _supplyRate * 100; // Multiply with 100 to make it in percent
    // var _supplyYield = (1 + _supplyRate / 365) ** 365 - 1;
    // _position[_key].supplyYield = _supplyYield * 100; // Multiply with 100 to make it in percent
    // var _borrowRate = (_res[6] * 2102400) / 1e18;
    // _position[_key].borrowRate = _borrowRate * 100; // Multiply with 100 to make it in percent
    // var _borrowYield = (1 + _borrowRate / 365) ** 365 - 1;
    // _position[_key].borrowYield = _borrowYield * 100; // Multiply with 100 to make it in percent
  });

  it.only("#3: Test CustomMakerInterface", async function () {
    // Instantiate Maker Resolver contract
    let CustomMakerinterface = await ethers.getContractFactory("CustomMakerInterface");
    let customMakerinterface = await CustomMakerinterface.deploy();
    await customMakerinterface.deployed();
    // gets borrow rate per second from contract, 18 digits
    let borrowRatePerSec: BigNumber = await customMakerinterface.getBorrowRate()
    //console.log(borrowRatePerSec)
    // gets borrow rate per second from IMR contract, 27 digits
    instaMakerResolver = await ethers.getContractAt(
      InstaMakerResolver.abi,
      constants.InstaMakerResolver
    );
    let colInfo = (await instaMakerResolver.getColInfo(["ETH-A"]))[0]
    let borrowRatePerYearIMR = calRate(colInfo.borrowRate) * 100
    let borrowRatePerYearCustom = calRateFromRate(borrowRatePerSec.mul(1e9)) * 100
    console.log(Number(colInfo.borrowRate), Number(borrowRatePerSec.mul(1e9)))
    console.log(borrowRatePerYearIMR, borrowRatePerYearCustom)
    expect(truncate5digits(borrowRatePerYearIMR)).to.eq(truncate5digits(borrowRatePerYearCustom))
  });
  it.only("#4: Test CustomCompoundInterface", async function () {
    // Instantiate Maker Resolver contract
    let CustomCompoundInterface = await ethers.getContractFactory("CustomCompoundInterface");
    let customCompoundInterface = await CustomCompoundInterface.deploy();
    await customCompoundInterface.deployed();
    // gets borrow rate per second from contract, 18 digits
    let borrowRatePerSec: BigNumber = await customCompoundInterface.getETHDAIBorrowRatePerSecond()
    console.log('borrowRatePerSec', Number(borrowRatePerSec.mul(1e9)), calRateFromRate(borrowRatePerSec.mul(1e9)) * 100)
    // 
    dsaAddress = await createDSA(web3);
    [userWallet] = await ethers.getSigners();

    const ethSupplyRate = (await dsaSdk.compound.getPosition(dsaAddress)).eth.supplyRate
    const daiBorrowRate = (await dsaSdk.compound.getPosition(dsaAddress)).dai.borrowRate
    console.log('ethSupplyRate', ethSupplyRate, 'daiBorrowRate', daiBorrowRate)
    const totalBorrowRate = daiBorrowRate - ethSupplyRate
    console.log('totalBorrowRate', totalBorrowRate)
    expect(truncate1digits(calRateFromRate(borrowRatePerSec.mul(1e9)) * 100)).to.eq(truncate1digits(totalBorrowRate))
  });
});
