// "SPDX-License-Identifier: UNLICENSED"
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;
import {SafeMath} from "@gelatonetwork/core/contracts/external/SafeMath.sol";

/// @notice This contract is used to get a formatted 18 digits borrow rate per second for ETH vaults in MakerDao
contract TestCMI {
    
    using SafeMath for uint256;

    uint public fee;
    constructor(uint _fee) public {  fee = _fee; }

    /**
     * @dev get maker borrow rate for a collateral
     */
    function getFee(bytes32 ilk) internal view returns (uint) {
        return fee;
    }

    function setFee(uint _fee) public {
        fee = _fee;
    }

    /// @dev Get current Maker borrow rate for ETH collateral
    // returns rate per second,18 digits instead of 27 digits
    function getBorrowRate() public view returns (uint256)  {
        uint256 _fee=getFee("ETH-A");
        if (_fee<uint256(1000000000000000000000000000)){
            // Fee is not supposed to be under 1 (e27) (fee=1+rate)
            return 0;
        } else {
            return _fee.div(1000000000).sub(1000000000000000000);
        }
    }
}