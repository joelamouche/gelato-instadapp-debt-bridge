// "SPDX-License-Identifier: UNLICENSED"
pragma solidity 0.6.12;

// Mock Custom Compound Interface
contract MockCCI {

    uint256 public borrowRatePerSecond;
    constructor(uint256 _borrowRatePerSecond) public { borrowRatePerSecond = _borrowRatePerSecond; }

    /// @dev Use this during tests to simulate changing borrowRatePerSecond conditions
    /// @param _borrowRatePerSecond The borrowRatePerSecond to set.
    function setBorrowRatePerSecond(uint256 _borrowRatePerSecond) external virtual {
        borrowRatePerSecond = _borrowRatePerSecond;
    }
    function getETHDAIBorrowRatePerSecond() public view returns (uint256)  {
        return borrowRatePerSecond;
    }
}