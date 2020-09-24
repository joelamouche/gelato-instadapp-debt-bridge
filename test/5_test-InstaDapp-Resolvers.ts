// running `npx buidler test` automatically makes use of buidler-waffle plugin

import { createDSA } from "../lib/createDSA";
import { createGelatoOptimizer } from "../lib/createGelatoOptimizer";
import { createMakerVault } from "../lib/createMakerVault";

// => only dependency we need is "chai"
const { expect } = require("chai");
const bre = require("@nomiclabs/buidler");
const { ethers } = bre;
const GelatoCoreLib = require("@gelatonetwork/core");
const { BigNumber } = require("ethers");
const DSA = require("dsa-sdk");
const Web3 = require("web3");
export {};

// Set up dsa sdk from instaDapp to get resolvers
const web3 = new Web3("http://localhost:8545");
const dsaSdk = new DSA(web3);

// Constants
const ETH_10 = ethers.utils.parseEther("10");
const DAI_150 = ethers.utils.parseUnits("150", 18);
const APY_2_PERCENT_IN_SECONDS = BigNumber.from("1000000000627937192491029810");

// Contracts
const InstaAccount = require("../pre-compiles/InstaAccount.json");
const ConnectAuth = require("../pre-compiles/ConnectAuth.json");
const ConnectMaker = require("../pre-compiles/ConnectMaker.json");
const InstaMakerResolver = require("../pre-compiles/InstaMakerResolver.json");
const IERC20 = require("../pre-compiles/IERC20.json");
const ProviderModuleDSA_ABI = require("../pre-compiles/ProviderModuleDSA_ABI.json");

const ConnectGelato_ABI = require("../pre-compiles/ConnectGelato_ABI");

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

  // Contracts to deploy and use for local testing
  let dsa;
  let mockDSR;
  let mockCDAI;
  let conditionCompareUints;

  before(async function () {});

  it.only("#1: Get Maker Vault data from onChain contract", async function () {
    dsaAddress = await createDSA(web3);
    [userWallet] = await ethers.getSigners();

    // create vault
    let vaults = await createMakerVault(web3, dsaAddress, ETH_10, DAI_150);
    console.log("vaults", vaults);
    // Check vault debt and collateral
    let debt, col;
    Object.keys(vaults).forEach((key) => {
      debt = vaults[key].debt;
      col = vaults[key].col;
    });

    // Instantiate Maker Resolver contract
    instaMakerResolver = await ethers.getContractAt(
      InstaMakerResolver.abi,
      bre.network.config.InstaMakerResolver
    );
    console.log(
      "onchain vaults",
      await instaMakerResolver.getVaults(dsaAddress)
    );
    console.log(
      "onchain borrowrate",
      (await instaMakerResolver.getVaults(dsaAddress))[0].borrowRate.toNumber()
    );
    console.log(
      "getcolinfo",
      await instaMakerResolver.getColInfo(["ETH-A"]) //.borrowRate.toNumber()
    );
  });
});
