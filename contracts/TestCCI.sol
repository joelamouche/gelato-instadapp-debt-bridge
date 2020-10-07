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
contract TestCCI {
    
    using SafeMath for uint256;

    uint256 public supplyRate;
    uint256 public borrowRate;
    constructor(uint256 _supplyRate, uint256 _borrowRate) public {  
        supplyRate = _supplyRate; 
        borrowRate = _borrowRate; 
        }
    
    /**
     * @dev get ceth supply rate
     */
    function getSupplyRate() internal view returns (uint256) {
        return supplyRate;
    }
    
    /**
     * @dev get cdai borrow rate
     */
    function getBorrowRate() internal view returns (uint256) {
        return borrowRate;
    }
    
    /**
     * @dev set ceth supply rate
     */
    function setSupplyRate(uint256 _supplyRate) public {
        supplyRate = _supplyRate; 
    }
    
    /**
     * @dev set ceth supply rate
     */
    function setBorrowRate(uint256 _borrowRate) public {
        borrowRate = _borrowRate; 
    }


    /// @dev Get current Compound borrow rate for ETH deposit and DAI borrow
    // returns rate per second, 18 digits instead of 27 digits
    function getETHDAIBorrowRatePerSecond() public view returns (uint256)  {
        //get supply and borrow rates
        uint256 cDaiBorrowRatePerBlock=getBorrowRate();
        uint256 cEthSupplyRatePerBlock=getSupplyRate();
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