const { network } = require("hardhat")
const {
  developmentChains,
  INITIAL_SUPPLY,
} = require("../helper-hardhat-config")
const { verify } = require("../helper-functions")

// main
module.exports = async ({ getNamedAccounts, deployments }) => {
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

  //If we're not on localhost
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(bridgeToken.address, [INITIAL_SUPPLY])
  }
}

module.exports.tags = ["all", "token"]
