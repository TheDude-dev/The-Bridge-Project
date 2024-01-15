const networkConfig = {
  31337: {
    name: "localhost",
  },
  // Price Feed Address, values can be obtained at https://docs.chain.link/data-feeds/price-feeds/addresses
  11155111: {
    name: "sepolia",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
}
const INITIAL_SUPPLY = "1000000000000000000000000"
const RECEIVER_ADDRESS = "0x72986C919098b14Ad95b2fF0495A30229A9d3FEA"
const LOCALHOST_RPC_URL = "http://localhost:8545"

const developmentChains = ["hardhat", "localhost"]

module.exports = {
  networkConfig,
  developmentChains,
  INITIAL_SUPPLY,
  RECEIVER_ADDRESS,
  LOCALHOST_RPC_URL,
}
