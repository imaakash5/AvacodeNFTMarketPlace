const fs = require('fs');
const truffleContract = require('@truffle/contract');
const truffleAssert = require('truffle-assertions');

const CONFIG = require("../credentials");
const { web3, ethers } = require('hardhat');
const { BigNumber, utils } = require("ethers")

const data = require('./WL.json');
// const NFTABI = (JSON.parse(fs.readFileSync('./artifacts/contracts/NFT.sol/NFT.json', 'utf8'))).abi;
const NFTFACTORYABI = (JSON.parse(fs.readFileSync('./artifacts/contracts/NFTFactory.sol/NFTFactory.json', 'utf8'))).abi;
const NFTCOLLECTIONABI = (JSON.parse(fs.readFileSync('./artifacts/contracts/NFTCollection.sol/NFTCollection.json', 'utf8'))).abi;

contract("NFT deploy", () => {
    // const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
    // const provider = new ethers.providers.JsonRpcProvider("https://rinkeby-light.eth.linkpool.io/");
    const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
    const signer = new ethers.Wallet(CONFIG.wallet.PKEY);
    const account = signer.connect(provider);
    

    before(async () => {
        // nftAddress = "0x129e71ebc1fb7b5e28e517a0a45fec445cdf9800"
        const NFTFACTORY = artifacts.require("NFTFactory");

        nftFactory = await NFTFACTORY.new()
        NFTFACTORY.setAsDeployed(nftFactory)
        nftFactory = await NFTFACTORY.deployed()

        console.log({
            nftFactory: nftFactory.address
        })

        nftFactory = new ethers.Contract(nftFactory.address, NFTFACTORYABI, account);
        // nft = new ethers.Contract(nftAddress, NFTABI, account);
    })

    after(async () => {
        console.log('\u0007');
        console.log('\u0007');
        console.log('\u0007');
        console.log('\u0007');
    })

    it ("should print contract addresses", async () => {
        console.log({
            nftFactory: nftFactory.address,
            // data,
        })
    })

    it ("should set fee recipient", async () => {
        let tx = await nftFactory.setFeeRecipient("0x623794DD8308121A5a02D0389F9e8a3fBBBB0EE5");
        await tx.wait()
        tx = await nftFactory.setFee("25")
        await tx.wait()
    })

    // it ("should deploy nft contract", async () => {
    //   let tx = await nftFactory.createNFTContract("Dummy nft", "DUNMS", utils.parseEther("0.001"), 10, 100)
    //   await tx.wait()
    // })

    // it ("should mint nft", async () => {
    //     nft = await nftFactory.nftContracts(0);
    //     nft = await(await ethers.getContractFactory("NFTCollection")).attach(nft);
    
    //     let tx = await nft.mint(2, { value: utils.parseEther("0.002") });
    //     await tx.wait()
    // })

    // it ("should withdraw", async () => {
    //     let tx = await nft.withdraw();
    //     await tx.wait()
    // })
})

