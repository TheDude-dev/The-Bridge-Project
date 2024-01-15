const { ethers } = require("hardhat")
const fs = require("fs")
const path = require("path")

const bridgeTokenAbiLocation = "./constants/bridgeTokenAbi.json"

module.exports = async () => {
  const updateBridgeTokenAbi = async () => {
    const bridgeToken = await ethers.getContract("BridgeToken")
    fs.writeFileSync(
      bridgeTokenAbiLocation,
      bridgeToken.interface.format(ethers.utils.FormatTypes.json)
    )
  }

  if (process.env.UPDATE_FRONT_END) {
    console.log("Updating bridgeToken ABI in EthReceiver contract")
    await updateBridgeTokenAbi()
  }
}
