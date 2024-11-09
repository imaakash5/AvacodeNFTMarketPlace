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

describe("Collection", function () {

  let nft;

  before(async() =>{

    const NFTFACTORY = await ethers.getContractFactory("NFTFactory");
    nftFactory = await NFTFACTORY.deploy();
    await nftFactory.deployed();

    accounts = await ethers.getSigners();
    
  })

  it ("should print contract addresses", async () => {
    console.log({
        nftFactory: nftFactory.address,
    })
  })

  it ("should set fee recipient and fee", async () => {
    await nftFactory.setFeeRecipient(accounts[5].address);
    await nftFactory.setFee("5");
  })

  it ("should deploy nft contract", async () => {
      await nftFactory.createNFTContract("Dummy nft", "DUNMS", utils.parseEther("0.01"), 10, 100)
  })

  it ("should buy nft", async () => {
    nft = await nftFactory.nftContracts(0);
    nft = await(await ethers.getContractFactory("NFTCollection")).attach(nft);

    await nft.mint(2, { value: utils.parseEther("0.02") });
  })

  it ("Should set base uri", async () => {
      await nft.setBaseURI("http://localhost:3000/");
      await nftFactory.setBaseURI(nft.address, "http://localhost:3000/");
  })

//   it ("should withdaw", async () => {
//     await nft.withdraw();
//   })
});
