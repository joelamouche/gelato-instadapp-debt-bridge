// "SPDX-License-Identifier: UNLICENSED"
pragma solidity 0.6.12;

// Mock Custom Maker Interface
contract MockCMI {
    uint256 public borrowRatePerSecond;
    constructor(uint256 _sRPS) public {  borrowRatePerSecond = _sRPS; }

    /// @dev Use this during tests to simulate changing CDAI.borrowRatePerBlock conditions
    /// @param _rate CDAI.borrowRatePerBlock but in seconds and 10**27 precision
    function setBorrowRatePerSecond(uint256 _rate) external virtual {
        borrowRatePerSecond = _rate;
    }
    function getBorrowRate() public view returns (uint256)  {
        return borrowRatePerSecond;
    }
}