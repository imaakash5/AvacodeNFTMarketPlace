const { expect } = require("chai");
const { ethers } = require("hardhat");
// const { LazyMinter } = require("../scripts/signer");
const CONFIG = require("../credentials");

// const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/"); 
const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/"); 
const signer = new ethers.Wallet(CONFIG.wallet.PKEY);
const account = signer.connect(provider);

describe("NFT", function () {

  before(async() =>{
    // accounts = await ethers.getSigners();

    const NFTERC721 = await ethers.getContractFactory("NFTERC721");
    nfterc721 = await NFTERC721.deploy("Avocado NFT 721", "NFT721" );
    await nfterc721.deployed();

    const NFTERC1155 = await ethers.getContractFactory("NFTERC1155");
    nfterc1155 = await NFTERC1155.deploy("Avocado NFT 1155", "NFT1155" );
    await nfterc1155.deployed();

    const MARKETPLACE = await ethers.getContractFactory("NFTMarketplace");
    marketplace = await MARKETPLACE.deploy("0x0000000000000000000000000000000000000000", 25, "0x623794DD8308121A5a02D0389F9e8a3fBBBB0EE5");
    await marketplace.deployed();

    console.log({
      nfterc721: nfterc721.address,
      marketplace: marketplace.address,
      nfterc1155: nfterc1155.address
    })  
  })

  after(async () => {
    console.log('\u0007');
    console.log('\u0007');
    console.log('\u0007');
    console.log('\u0007');
  })

  it("Should test functionality", async function () {
    let tx6 = await nfterc721.updateAddresses(marketplace.address, marketplace.address);
    await tx6.wait();
    tx6 = await nfterc1155.updateAddresses(marketplace.address, marketplace.address);
    await tx6.wait();
    tx6 = await marketplace.updateNFTContract(nfterc721.address, nfterc1155.address);
    await tx6.wait();
    // tx6 = await nfterc721.setApprovalForAll(marketplace.address, true);
    // await tx6.wait();
    // tx6 = await nfterc1155.setApprovalForAll(marketplace.address, true);
    // await tx6.wait();
    // tx6 = await marketplace.createNFTAndList(1, "https://www.google.com", "10000000000000000", "1632304800", 500)
    // tx6 = await marketplace.listItem(
    //   nft.address,
    //   1,
    //   1,
    //   "0x0000000000000000000000000000000000000000",
    //   "10000000000000000",
    //   "1632304800"
    // );
    // await tx6.wait();
    // tx6 = await marketplace.createNFTAndList(2, "https://www.google.com", "20000000000000000", "1632304800", 500)
    // tx6 = await marketplace.listItem(
    //   nft2.address,
    //   2,
    //   1,
    //   "0x0000000000000000000000000000000000000000",
    //   "20000000000000000",
    //   "1632304800"
    // );
    // await tx6.wait();
    // tx6 = await marketplace.buyItem(
    //   nfterc721.address,
    //   "1000000000000000001",
    //   account.address,
    //   {
    //     value: "10000000000000000"
    //   }
    // );
    // await tx6.wait();
    // tx6 = await marketplace.buyItem(
    //   nfterc1155.address,
    //   "1000000000000000001",
    //   account.address,
    //   {
    //     value: "40000000000000000"
    //   }
    // );
    // await tx6.wait();
  });
});
