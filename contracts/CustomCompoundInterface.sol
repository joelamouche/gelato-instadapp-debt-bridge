// "SPDX-License-Identifier: UNLICENSED"
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import {InstaMakerResolver, InstaMcdAddress,CdpsLike,Helpers} from "./InstaMakerResolver.sol";
import {SafeMath} from "@gelatonetwork/core/contracts/external/SafeMath.sol";

interface ICToken {
    function borrowRatePerBlock() external view returns (uint);
    function supplyRatePerBlock() external view returns (uint);
}

/// @notice This contract is used to get a formatted 18 digits borrow rate per second for ETH deposit and DAI borrow on Compound
contract CustomCompoundInterface {
    
    using SafeMath for uint256;
    
    /**
     * @dev get CDai Address contract
     */
    function getCDaiAddress() public pure returns (address) {
        return 0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643;
    }

    /**
     * @dev get CEth Address contract
     */
    function getCEthAddress() public pure returns (address) {
        return 0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5;
    }


    /// @dev Get current Compound borrow rate for ETH deposit and DAI borrow
    // returns rate per second, assuming 15 second blocks
    function getETHDAIBorrowRatePerSecond() public view returns (uint256)  {
        //get supply and borrow rates
        ICToken cDai=ICToken(getCDaiAddress());
        ICToken cEth=ICToken(getCEthAddress());
        uint256 cDaiBorrowRatePerBlock=cDai.borrowRatePerBlock();
        uint256 cEthSupplyRatePerBlock=cEth.supplyRatePerBlock();
        uint256 totalBorrowratePerBlock;
        if (cEthSupplyRatePerBlock>cDaiBorrowRatePerBlock){
            totalBorrowratePerBlock=0;
        } else {
            totalBorrowratePerBlock=cDaiBorrowRatePerBlock.sub(cEthSupplyRatePerBlock);
        }

        //divide by 15 (assuming an avergae 15sec eth block and small enough for linearization)
        return totalBorrowratePerBlock.div(15);
    }
}