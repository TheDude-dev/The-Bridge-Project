// contracts/Bridge.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

error BridgeToken_Unauthorized();
error BridgeToken_AddressAlreadySet();

contract BridgeToken is ERC20 {
  address public EthReceiverAddress;

  constructor(uint256 initialSupply) ERC20("Bridge", "BG") {
    _mint(msg.sender, initialSupply);
  }

  function mintForEthReceiverContract(address account, uint256 value) external {
    if (msg.sender != EthReceiverAddress) {
      revert BridgeToken_Unauthorized();
    }
    _mint(account, value);
  }

  function setEthReceiverAddress(address _ethReceiverAddress) external {
    if (EthReceiverAddress != address(0)) {
      revert BridgeToken_AddressAlreadySet();
    }

    EthReceiverAddress = _ethReceiverAddress;
  }
}
