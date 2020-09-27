const { ethers } = require("@nomiclabs/buidler");
import { BigNumber } from "ethers";

const APY_2_PERCENT_IN_SECONDS = BigNumber.from("1000000000627937192491029810");

async function deployContracts() {
    const MockCDAI = await ethers.getContractFactory("MockCDAI");
    const mockCDAI = await MockCDAI.deploy(APY_2_PERCENT_IN_SECONDS);
    await mockCDAI.deployed();
    const MockDSR = await ethers.getContractFactory("MockDSR");
    const mockDSR = await MockDSR.deploy(APY_2_PERCENT_IN_SECONDS);
    await mockDSR.deployed();
    const ConditionCompareUintsFromTwoSources = await ethers.getContractFactory(
        "ConditionCompareUintsFromTwoSources"
    );
    const conditionCompareUints = await ConditionCompareUintsFromTwoSources.deploy();
    await conditionCompareUints.deployed();
}

deployContracts().then(console.log).catch(console.log);
