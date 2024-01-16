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

  BridgeToken public bridgeToken;

  constructor(address _s_bridgeToken, address _s_receiver) {
    s_owner = msg.sender;
    s_bridgeToken = _s_bridgeToken;
    s_receiver = _s_receiver;

    /// @dev Explain to a developer any extra details
    bridgeToken = BridgeToken(s_bridgeToken);
  }

  // fall back functions

  // * receive function
  receive() external payable {}

  // * fallback function
  fallback() external payable {}

  // Emit an event when ETH is received
  event EthReceived(uint256 amount, address sender);

  // Emit an event when Tokens are minted
  event TokenMinted(uint256 amount, address receiver);

  event BuyTokens(address buyer, uint amountOfETH, uint amountOfTokens);

  event SellTokens(address seller, uint256 amountOfTokens, uint256 amountOfETH);
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

    // BridgeToken bridgeToken = BridgeToken(s_bridgeToken);
    bridgeToken.mintForEthReceiverContract(msg.sender, mintedTokenAmount);

    address receiver = s_receiver;

    // //transfer function to receiver
    // bridgeToken.transferForReceiverContract(receiver, 1);

    //emit events
    emit TokenMinted(msg.value, receiver);

    // emit EthReceived(msg.value, msg.sender);
  }

  // 1 eth = 100 BG
  uint256 public tokensPerEth = 100;

  function buyTokens() public payable {
    uint totalEth = msg.value * tokensPerEth;
    bridgeToken.transfer(msg.sender, totalEth);
    emit BuyTokens(msg.sender, msg.value, totalEth);  
  }

  function sellTokens(uint amount) public {
    uint ethAmount = amount / tokensPerEth;
    bridgeToken.transferFrom(msg.sender, address(this), amount);
    (bool success, ) = payable(msg.sender).call{value: ethAmount}("");
    require(success, "Fail to sell");
    emit SellTokens(msg.sender, ethAmount, amount);
  }

  function withdrawEth() external onlyOwner {
    (bool success, ) = msg.sender.call{value: address(this).balance}("");

    if (!success) {
      revert EthReceiver_FailedToSenDEther();
    }
  }
}
