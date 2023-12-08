const { network, ethers } = require("hardhat")
const {
  developmentChains,
  INITIAL_SUPPLY,
  RECEIVER_ADDRESS,
} = require("../helper-hardhat-config")
const { verify } = require("../helper-functions")

// main
module.exports = async ({ getNamedAccounts, deployments }) => {
  // Deploy the token contract first
  //we need an account, the deploy function and log
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const bridgeToken = await deploy("BridgeToken", {
    from: deployer,
    log: true,
    args: [INITIAL_SUPPLY],
    waitforconfirmations: network.config.blockConfirmations || 1,
  })
  log(`Bridge Token deployed at ${bridgeToken.address}`)

  log("---------------------------------------------")

  /*Deploy the Eth contract second and set 
  the ETHRECEIVER ADDRESS to the address of the deployed Eth contract*/
  const tokenAddress = bridgeToken.address

  const ethReceiver = await deploy("EthReceiver", {
    from: deployer,
    log: true,
    args: [tokenAddress, RECEIVER_ADDRESS],
    waitforconfirmations: network.config.blockConfirmations || 1,
  })

  log(`Eth reciever contract deployed at ${ethReceiver.address}`)

  log(" Setting Eth Receiver address................")

  // Set address
  const BridgeToken = await ethers.getContractFactory("BridgeToken")
  const bridgeTokenInstance = await BridgeToken.attach(bridgeToken.address)
  await bridgeTokenInstance.setEthReceiverAddress(ethReceiver.address)

  log("EthReceiver address set!")

  log("---------------------------------------------")
  //If we're not on localhost
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(bridgeToken.address, [INITIAL_SUPPLY])
    await verify(ethReceiver.address, [tokenAddress, RECEIVER_ADDRESS])
  }
}

module.exports.tags = ["all", "tokenAndReceiver"]
