const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")
require("dotenv").config()
const { LOCALHOST_RPC_URL } = require("../helper-hardhat-config")

const sendEth = async () => {
  const ethReceiver = await ethers.getContract("EthReceiver")
  const contractAddress = ethReceiver.address
  let wallet, provider

  // get a provider
  if (network.config.chainId === 31337) {
    provider = new ethers.providers.JsonRpcProvider(LOCALHOST_RPC_URL)
    // connect wallet with provider
    wallet = new ethers.Wallet(process.env.LOCALHOST_PRIVATE_KEY, provider)
  } else {
    provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL)
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
  }

  // create a transaction
  const transaction = {
    to: contractAddress,
    value: ethers.utils.parseEther("0.1"),
  }

  // sign and send transaction
  const txResponse = await wallet.sendTransaction(transaction)
  console.log("Transaction hash:", txResponse.hash)

  // wait for the tx to be mined
  const receipt = await txResponse.wait(1)
  console.log("Transaction receipt:", receipt)

  if (network.config.chainId === 31337) {
    await moveBlocks(1, (sleepAmount = 1000))
  }
  console.log("ETH sent")
}

sendEth()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
