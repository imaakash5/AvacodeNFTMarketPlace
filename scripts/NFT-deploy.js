const fs = require('fs');
const truffleContract = require('@truffle/contract');
const truffleAssert = require('truffle-assertions');

const CONFIG = require("../credentials");
const { web3, ethers } = require('hardhat');
const data = require('./WL.json');
const NFTABI = (JSON.parse(fs.readFileSync('./artifacts/contracts/NFT.sol/NFT.json', 'utf8'))).abi;

contract("NFT deploy", () => {
    // const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
    // const provider = new ethers.providers.JsonRpcProvider("https://rinkeby-light.eth.linkpool.io/");
    const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
    const signer = new ethers.Wallet(CONFIG.wallet.PKEY);
    const account = signer.connect(provider);
    

    before(async () => {
        nftAddress = "0x129e71ebc1fb7b5e28e517a0a45fec445cdf9800"
        // const NFT = artifacts.require("NFT");

        // nft = await NFT.new("Avocado official NFT collection", "AVONFT", 5000, 10, "400000000000000000", "500000000000000000")
        // NFT.setAsDeployed(nft)
        // nft = await NFT.deployed()

        // console.log({
        //     nft: nft.address
        // })

        // nft = new ethers.Contract(nft.address, NFTABI, account);
        nft = new ethers.Contract(nftAddress, NFTABI, account);
    })

    after(async () => {
        console.log('\u0007');
        console.log('\u0007');
        console.log('\u0007');
        console.log('\u0007');
    })

    it ("should print contract addresses", async () => {
        console.log({
            nft: nft.address,
            // data,
        })
    })

    it ("Should add whitelisting", async () => {
        const wlAddress =  []
        for (let i = 0; i < data.length; i++) {
            wlAddress.push(data[i].FIELD2)
        }
        console.log({
            wlAddress,
        })

        // let tx = await nft.updateWhitelisting(wlAddress, true);
        // await tx.wait()
    })

})

