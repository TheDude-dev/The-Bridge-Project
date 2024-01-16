// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./BridgeToken.sol";

error EthReceiver_NotEnoughEthSent();
error EthReceiver_NotOwner();
error EthReceiver_FailedToSenDEther();

contract EthReceiver {
  address private s_bridgeToken;
  address private s_owner;
  address private s_receiver;
  uint256 private constant VALUE_MULTIPLIER = 4000;

  constructor(address _s_bridgeToken, address _s_receiver) {
    s_owner = msg.sender;
    s_bridgeToken = _s_bridgeToken;
    s_receiver = _s_receiver;
  }

  // fall back functions

  // * receive function
  receive() external payable {}

  // * fallback function
  fallback() external payable {}

  // Emit an event when ETH is received
  event EthReceived(uint256 indexed amount, address indexed sender);

  // // Emit an event when Tokens are minted
  // event TokenMinted(uint256 indexed amount, address indexed receiver);

  // Modifier only owner
  modifier onlyOwner() {
    if (msg.sender != s_owner) {
      revert EthReceiver_NotOwner();
    }
    _;
  }

  //function to lock and mint tokens
  function receiveAndMint() external payable {
    //Check if owner
    if (msg.value <= 0) {
      revert EthReceiver_NotEnoughEthSent();
    }

    // Mint tokens on the bridgetoken contract
    uint256 mintedTokenAmount = msg.value * VALUE_MULTIPLIER;

    BridgeToken bridgeToken = BridgeToken(s_bridgeToken);
    address receiver = s_receiver;
    bridgeToken.mintForEthReceiverContract(receiver, mintedTokenAmount);
    emit EthReceived(msg.value, msg.sender);
  }

  function withdrawEth() external onlyOwner {
    (bool success, ) = msg.sender.call{value: address(this).balance}("");

    if (!success) {
      revert EthReceiver_FailedToSenDEther();
    }
  }
}
