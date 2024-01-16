const { assert, expect } = require("chai")
const { getNamedAccounts, network, deployments, ethers } = require("hardhat")
const {
  developmentChains,
  INITIAL_SUPPLY,
} = require("../../helper-hardhat-config")

// If we're not on localhost skip, if yes describe
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("BridgeToken unit test", function () {
      //multiplier to facilitate the math
      const multiplier = 10 ** 18
      // set params
      let bridgeToken, user1, deployer
      // get accounts
      beforeEach(async () => {
        const accounts = await getNamedAccounts()

        deployer = accounts.deployer
        user1 = accounts.user1

        await deployments.fixture("all")
        bridgeToken = await ethers.getContract("BridgeToken", deployer)
        ethReceiver = await ethers.getContract("EthReceiver", deployer)
      })
      it("Both contracts were deployed", async () => {
        assert(bridgeToken.address)
        assert(ethReceiver.address)
      })

      describe("Constructor", () => {
        it("it sets the initial supply correctly", async () => {
          const supply = (await bridgeToken.totalSupply()).toString()
          assert.equal(supply, INITIAL_SUPPLY)
        })
        it("Sets the name and the symbol correctly", async () => {
          const tokenName = (await bridgeToken.name()).toString()
          const tokenSymbol = (await bridgeToken.symbol()).toString()
          assert.equal(tokenName, "Bridge")
          assert.equal(tokenSymbol, "BG")
        })
      })
      describe("Transfers", () => {
        it("Sends tokens to another address successfully", async () => {
          const amountToSend = ethers.utils.parseEther("30")
          await bridgeToken.transfer(user1, amountToSend)
          expect(await bridgeToken.balanceOf(user1)).to.equal(amountToSend)
        })
        it("emits a transfer event when a transfer occurs", async () => {
          const amountToSend = ethers.utils.parseEther("30")
          expect(await bridgeToken.transfer(user1, amountToSend)).to.emit(
            bridgeToken,
            "Transfer"
          )
        })
      })
      describe("allowances", () => {
        const amount = (20 * multiplier).toString()
        beforeEach(async () => {
          newToken = await ethers.getContract("BridgeToken", user1)
        })
        it("Approves other addresses to spend tokens", async () => {
          const tokenToSpend = ethers.utils.parseEther("5")
          await bridgeToken.approve(user1, tokenToSpend)
          await newToken.transferFrom(deployer, user1, tokenToSpend)
          expect(await newToken.balanceOf(user1)).to.equal(tokenToSpend)
        })
        it("disaproves not allowed allowances transfers", async () => {
          await expect(
            newToken.transferFrom(deployer, user1, amount)
          ).to.be.revertedWith(
            `ERC20InsufficientAllowance("${user1.toString()}", 0, ${amount})`
          )
        })
        it("emits an event when an account is approved", async () => {
          expect(await bridgeToken.approve(user1, amount)).to.emit(
            bridgeToken,
            "Approval"
          )
        })
        it("The allowance is accurate", async () => {
          await bridgeToken.approve(user1, amount)
          expect(await bridgeToken.allowance(deployer, user1)).to.equal(amount)
        })
      })
      describe("mintingForEthReceiver", async () => {
        it.only("should allow EthReceiver to call the mint function", async () => {
          // await bridgeToken.setEthReceiverAddress(ethReceiver.address)
          const tx = await ethReceiver.receiveAndMint({
            value: ethers.utils.parseEther("1"),
          })
          await tx.wait()
          // const deployerBalance = await bridgeToken.balanceOf(deployer.address);

          const totalSupply = await bridgeToken.totalSupply()
          const totalSupplyInt = parseInt(ethers.utils.formatEther(totalSupply))
          // console.log("💥 Deployer Balance:", deployerBalance.toNumber());
          console.log("💥 BridgeToken Actual Balance:", totalSupplyInt)

          
        })
        it("reverts if msg.sender is not EthreceiverAddress", async () => {
          // get another contract address and call the mintfunction on bridgeToken and expect a revert
          // get contract address
          await expect(
            bridgeToken.mintForEthReceiverContract(user1, 1)
          ).to.be.revertedWith("BridgeToken_Unauthorized()")
        })
      })
    })
