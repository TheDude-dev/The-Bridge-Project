const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const sentEth = async () => {
  const ethReceiver = await ethers.getContract("EthReceiver")
  const contractAddress = ethReceiver.address

  if (network.config.chainId === 31337) {
    await moveBlocks(1, (sleepAmount = 1000))
  }
}
