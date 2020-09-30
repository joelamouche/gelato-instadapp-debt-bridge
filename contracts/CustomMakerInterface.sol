// "SPDX-License-Identifier: UNLICENSED"
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import {InstaMakerResolver, InstaMcdAddress,CdpsLike,Helpers} from "./InstaMakerResolver.sol";
import {SafeMath} from "@gelatonetwork/core/contracts/external/SafeMath.sol";

contract CustomMakerInterface is InstaMakerResolver {
    
    using SafeMath for uint256;

    /// @dev Uget current Maker borrow rate
    // returns rate per second,18 digits instead of 27 digits
    function getBorrowRate() public view returns (uint256)  {
        uint256 fee=getFee("ETH-A");
        return fee.div(1000000000); //.sub(1000000000000000000000000000);
    }
}