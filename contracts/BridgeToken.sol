// contracts/Bridge.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

error BridgeToken_Unauthorized();

contract BridgeToken is ERC20 {
  address private EthReceiverAddress;

  constructor(
    uint256 initialSupply,
    address _EthReceiverAddress
  ) ERC20("Bridge", "BG") {
    _mint(msg.sender, initialSupply);
    EthReceiverAddress = _EthReceiverAddress;
  }

  function mintForEthReceiverContract(address account, uint256 value) external {
    if (msg.sender != EthReceiverAddress) {
      revert BridgeToken_Unauthorized();
    }
    _mint(account, value);
  }
}
