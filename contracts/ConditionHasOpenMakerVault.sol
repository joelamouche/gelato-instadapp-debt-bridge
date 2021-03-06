// "SPDX-License-Identifier: UNLICENSED"
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import {
    GelatoConditionsStandard
} from "@gelatonetwork/core/contracts/conditions/GelatoConditionsStandard.sol";
import {
    IGelatoCore
} from "@gelatonetwork/core/contracts/gelato_core/interfaces/IGelatoCore.sol";
import {GelatoBytes} from "./GelatoBytes.sol";

interface InstaMcdAddress {
    function manager() external view returns (address);
    function vat() external view returns (address);
    function jug() external view returns (address);
    function spot() external view returns (address);
    function pot() external view returns (address);
    function getCdps() external view returns (address);
}

interface CdpsLike {
    function getCdpsAsc(address, address) external view returns (uint[] memory, address[] memory, bytes32[] memory);
}

/// @notice A contract to check if maker has an open vault. This is a standard gelato condition contract
contract ConditionHasOpenMakerVault is GelatoConditionsStandard {

    /// @notice Helper to encode the Condition data field off-chain
    function getConditionData(
        address owner
    )
        public
        pure
        virtual
        returns (bytes memory)
    {
        return abi.encode(owner);
    }

    /// @notice Gelato Standard Condition function.
    /// @dev Every Gelato Condition must have this function selector as entry point.
    /// @param _conditionData The encoded data from getConditionData()
     function ok(uint256, bytes calldata _conditionData, uint256)
        public
        view
        virtual
        override
        returns (string memory)
    {
        (address owner) = abi.decode(
            _conditionData,
            (address)
        );
        return hasMakerVaultOpen(owner);
    }
    
    /**
     * @dev get MakerDAO MCD Address contract
     */
    function getMcdAddresses() public pure returns (address) {
        return 0xF23196DF1C440345DE07feFbe556a5eF0dcD29F0;
    }

    
    /**
     * @dev tests if the user has an open maker vault
     */
    function hasMakerVaultOpen(
        address owner
    )
        public
        view
        virtual
        returns (string memory)
    {
        // TODO: add more conditions
        address manager = InstaMcdAddress(getMcdAddresses()).manager();
        address cdpManger = InstaMcdAddress(getMcdAddresses()).getCdps();

        (uint[] memory ids, , ) = CdpsLike(cdpManger).getCdpsAsc(manager, owner);
        if (ids.length==0){return "No open vault";} else {return OK;}
    }
}