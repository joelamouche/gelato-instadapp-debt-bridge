// "SPDX-License-Identifier: UNLICENSED"
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;
import {SafeMath} from "@gelatonetwork/core/contracts/external/SafeMath.sol";


interface JugLike {
    function ilks(bytes32) external view returns (uint, uint);
    function base() external view returns (uint);
}

interface InstaMcdAddress {
    function manager() external view returns (address);
    function vat() external view returns (address);
    function jug() external view returns (address);
    function spot() external view returns (address);
    function pot() external view returns (address);
    function getCdps() external view returns (address);
}

/// @notice This contract is used to get a formatted 18 digits borrow rate per second for ETH vaults in MakerDao
contract CustomMakerInterface {
    
    using SafeMath for uint256;

    /**
     * @dev get MakerDAO MCD Address contract
     */
    function getMcdAddresses() public pure returns (address) {
        return 0xF23196DF1C440345DE07feFbe556a5eF0dcD29F0;
    }

    /**
     * @dev get maker borrow rate for a collateral
     */
    function getFee(bytes32 ilk) internal view returns (uint fee) {
        address jug = InstaMcdAddress(getMcdAddresses()).jug();
        (uint duty,) = JugLike(jug).ilks(ilk);
        uint base = JugLike(jug).base();
        fee = duty.add(base);
    }

    /// @dev Get current Maker borrow rate for ETH collateral
    // returns rate per second,18 digits instead of 27 digits
    function getBorrowRate() public view returns (uint256)  {
        uint256 fee=getFee("ETH-A");
        if (fee<uint256(1000000000000000000000000000)){
            // Fee is not supposed to be under 1 (e27) (fee=1+rate)
            return 0;
        } else {
            return fee.div(1000000000).sub(1000000000000000000);
        }
    }
}