//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

interface INFTFactory {
    function feeRecipient() external view returns (address);
    function platformFee() external view returns (uint);
}

contract NFTCollection is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using Strings for uint256;

    // bool public paused;
    // bool public revealed;

    // string public notRevealedUri;
    string private _baseURIextended;

    uint256 public maxSupply;
    uint256 public basePrice; //0.08 ETH
    uint public maxPurchase;

    address public nftFactory;

    modifier onlyFactoryOrOwner {
        require(msg.sender == nftFactory || msg.sender == owner(), "Only factory or owner can call this function");
        _;
    }

    constructor(string memory name, string memory symbol, uint256 _basePrice, uint256 _maxPurchase, uint256 _maxSupply) ERC721(name, symbol) ReentrancyGuard() {
        maxSupply = _maxSupply;
        basePrice = _basePrice;
        maxPurchase = _maxPurchase;
        nftFactory = msg.sender;
    }

    function mint(uint256 _amount) external payable nonReentrant{
        // require(!paused, "NFT: contract is paused");
        require(totalSupply().add(_amount) <= maxSupply, "NFT: minting would exceed total supply");
        require(balanceOf(msg.sender).add(_amount) <= maxPurchase, "NFT: You can't mint so much tokens");
        require(basePrice.mul(_amount) <= msg.value, "NFT: Ether value sent is not correct");
        uint balance = address(this).balance;
        uint fee = balance.mul(INFTFactory(nftFactory).platformFee()).div(1000);
        payable(INFTFactory(nftFactory).feeRecipient()).transfer(fee);
        payable(owner()).transfer(address(this).balance);

        uint mintIndex = totalSupply().add(1);
        for (uint256 ind = 0; ind < _amount; ind++) {
            _safeMint(msg.sender, mintIndex.add(ind));
        }
    }

    function setBaseURI(string memory baseURI) external onlyFactoryOrOwner {
        _baseURIextended = baseURI;
    }

    // function baseURI() public view returns (string memory) {
    //     return _baseURI();
    // }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }


    // function changePauseState() external onlyOwner {
    //     paused = !paused;
    // }

    // function updateBasePrice(uint256 _basePrice) external onlyOwner {
    //     basePrice = _basePrice;
    // }

    // function updateMaxPurchase(uint _maxPurchase) external onlyOwner {
    //     maxPurchase = _maxPurchase;
    // }

    // function updateMaxSupply(uint256 _maxSupply) external onlyOwner {
    //     maxSupply = _maxSupply;
    // }

    // function reveal() external onlyOwner {
    //     revealed = true;
    // }

    // function withdraw() external onlyOwner {
    //     uint balance = address(this).balance;
    //     uint fee = balance.mul(INFTFactory(nftFactory).platformFee()).div(1000);
    //     payable(INFTFactory(nftFactory).feeRecipient()).transfer(fee);
    //     payable(msg.sender).transfer(address(this).balance);
    // }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        // if (revealed == false) {
        //     return notRevealedUri;
        // }

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        ".json"
                    )
                )
                : "";
    }
    
    // function setNotRevealedURI(string memory _notRevealedURI) external onlyOwner {
    //     notRevealedUri = _notRevealedURI;
    // }

    function _beforeTokenTransfer(address from, address to, uint tokenId) internal virtual override(ERC721, ERC721Enumerable) {
		super._beforeTokenTransfer(from, to, tokenId);
	}

	function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable)returns (bool){
        return super.supportsInterface(interfaceId);
    }

}