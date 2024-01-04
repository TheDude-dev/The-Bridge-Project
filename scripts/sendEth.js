const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")
require("dotenv").config()

const sendEth = async () => {
  const ethReceiver = await ethers.getContract("EthReceiver")
  const contractAddress = ethReceiver.address

  // get a provider
  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545")

  // connect wallet with provider
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  // create a transaction
  const transaction = {
    to: contractAddress,
    value: ethers.utils.parseEther("1.0"),
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
