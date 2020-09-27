// "SPDX-License-Identifier: UNLICENSED"
pragma solidity 0.6.12;

contract MockAggregator {
    uint256 public ethusd;
    constructor(uint256 _ethusd) public { ethusd = _ethusd; }

    /// @dev Use this during tests to simulate changing ETHUSD conditions
    /// @param _ethusd The ethusd to set.
    function setETHUSD(uint256 _ethusd) external virtual {
        ethusd = _ethusd;
    }
}