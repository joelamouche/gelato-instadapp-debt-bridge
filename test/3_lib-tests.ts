import { BigNumber } from "ethers";
// running `npx buidler test` automatically makes use of buidler-waffle plugin

import { createDSA } from "../lib/createDSA";
import { createMakerVault } from "../lib/createMakerVault";
import { AccountInterface } from "../typechain/AccountInterface";
import { Ierc20 } from "../typechain/Ierc20";

// => only dependency we need is "chai"
const { expect } = require("chai");
const bre = require("@nomiclabs/buidler");
const { ethers } = bre;
const Web3 = require("web3");
export {};

const IERC20 = require("../pre-compiles/IERC20.json");

// Set up dsa sdk from instaDapp to get resolvers
const web3 = new Web3("http://localhost:8545");
// Contracts
const InstaIndex = require("../pre-compiles/InstaIndex.json");
const InstaList = require("../pre-compiles/InstaList.json");
const InstaAccount = require("../pre-compiles/InstaAccount.json");
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
        bre.network.config.InstaList
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
      //userAddress = await userWallet.getAddress();
    });
    it("creates a Maker vault with 10ETH", async () => {
      const ETH_10 = ethers.utils.parseEther("10");
      const DAI_150 = ethers.utils.parseUnits("150", 18);
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
      dai = await ethers.getContractAt(IERC20.abi, bre.network.config.DAI);
      expect(await dai.balanceOf(dsaAddress)).to.eq(
        ethers.utils.parseUnits("150", 18)
      );
    });
  });
});
