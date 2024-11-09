const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber, utils } = require("ethers")
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545"); 
// const nftABI = require("../artifacts/contracts/NFT.sol/NFT.json").abi;

const advanceBlock = () => new Promise((resolve, reject) => {
  web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_mine',
      id: new Date().getTime(),
  }, async (err, result) => {
      if (err) { return reject(err) }
      // const newBlockhash =await web3.eth.getBlock('latest').hash
      return resolve()
  })
})

const advanceBlocks = async (num) => {
  let resp = []
  for (let i = 0; i < num; i += 1) {
      resp.push(advanceBlock())
  }
  await Promise.all(resp)
}

const advancetime = (time) => new Promise((resolve, reject) => {
  web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      id: new Date().getTime(),
      params: [time],
  }, async (err, result) => {
      if (err) { return reject(err) }
      const newBlockhash = (await web3.eth.getBlock('latest')).hash

      return resolve(newBlockhash)
  })
})

describe("NFT", function () {

  before(async() =>{

    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy("TEST NFT", "TFT", 1000, 10, utils.parseEther("1"), utils.parseEther("2"));
    await nft.deployed();

    accounts = await ethers.getSigners();
    
  })

  it ("should print contract addresses", async () => {
    console.log({
        nft: nft.address,
    })
  })

  it ("should mint tokens", async () => {
      await nft.mint(5, { value: utils.parseEther("5") });
      await advancetime(15*60)
      await advanceBlock
      await nft.mint(5, { value: utils.parseEther("10") });

  })

  it ("should withdraw ether", async () => {
      await nft.withdraw();
  })
});
