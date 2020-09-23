// running `npx buidler test` automatically makes use of buidler-waffle plugin

import { createDSA } from "../lib/createDSA";
import { AccountInterface } from "../typechain/AccountInterface";

// => only dependency we need is "chai"
const { expect } = require("chai");
const bre = require("@nomiclabs/buidler");
const { ethers } = bre;
const Web3 = require("web3");
export {};

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

    before(async function () {});
    it("creates a DSA", async () => {
      const instaIndex = await ethers.getContractAt(
        InstaIndex.abi,
        bre.network.config.InstaIndex
      );
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
});
