// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract TokenLockContract {
  address private s_bridgeToken;
  address private s_owner;

  constructor(address _s_bridgeToken) {
    s_owner = msg.sender;
    s_bridgeToken = _s_bridgeToken;
  }

  // Emit an event when ETH is received
  event TokenMinted(
    uint256 indexed amount,
    address[] indexed receiver,
    uint256[] indexed percentage
  );

  // Emit an event when Tokens are minted

  //function to loock and mint tokens
  function lockandMint() external payable {
    // Lock ETH

    // Mint tokens on the bridgetoken contract
    address[] memory receivers;
    uint256[] memory percentages;

    //emit events
    emit TokenMinted(msg.value, receivers, percentages);
  }
}
