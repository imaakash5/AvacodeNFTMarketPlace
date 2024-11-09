//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./NFTCollection.sol";

interface INFTCollection {
    function setBaseURI(string memory _baseURI) external;
}

contract NFTFactory is Ownable {
    mapping(address => bool) public exists;
    address[] public nftContracts;
    uint public platformFee;
    address public feeRecipient;
    
    event ContractCreated(address creator, address nft);

    function createNFTContract(string memory _name, string memory _symbol, uint _price, uint _maxPurchase, uint _maxSupply) external returns (address){
        NFTCollection nft = new NFTCollection(_name, _symbol, _price, _maxPurchase, _maxSupply);
        nft.transferOwnership(_msgSender());
        
        exists[address(nft)] = true;
        nftContracts.push(address(nft));
        emit ContractCreated(_msgSender(), address(nft));
        return address(nft);
    }

    function setBaseURI(address _nft, string memory _uri) external onlyOwner{
        INFTCollection(_nft).setBaseURI(_uri);
    }

    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        feeRecipient = _feeRecipient;
    }

    function setFee(uint _platformFee) external onlyOwner {
        platformFee = _platformFee;
    }
}