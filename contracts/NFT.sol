//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using Strings for uint256;

    bool public paused;
    bool public revealed;

    string public notRevealedUri;
    string private _baseURIextended;

    uint256 public maxSupply;
    uint256 public basePrice;
    uint256 public finalPrice;
    uint public maxPurchase;
    uint public finalPriceTime = 15 minutes;
    uint public initTime = block.timestamp;

    mapping(address => bool) public isWhitelisted;

    constructor(string memory name, string memory symbol, uint256 _maxSupply, uint256 _maxPurchase, uint256 _basePrice, uint256 _finalPrice) ERC721(name, symbol) ReentrancyGuard() {
        maxSupply = _maxSupply;
        basePrice = _basePrice;
        finalPrice = _finalPrice;
        maxPurchase = _maxPurchase;
    }

    function initialize() external onlyOwner {
        initTime = block.timestamp;
    }

    function mint(uint256 _amount) external payable nonReentrant{
        require(!paused, "NFT: contract is paused");
        require(totalSupply().add(_amount) <= maxSupply, "NFT: minting would exceed total supply");
        require(balanceOf(msg.sender).add(_amount) <= maxPurchase, "NFT: You can't mint so much tokens");
        uint nftPrice = finalPrice;
        if (block.timestamp - initTime < finalPriceTime) {
            require(isWhitelisted[msg.sender], "NFT: address is not whitelisted");
            nftPrice = basePrice;
        }
        require(nftPrice.mul(_amount) <= msg.value, "NFT: Ether value sent is not correct");

        uint mintIndex = totalSupply().add(1);
        for (uint256 ind = 0; ind < _amount; ind++) {
            _safeMint(msg.sender, mintIndex.add(ind));
        }
    }

    function updateWhitelisting(address[] calldata _addresses, bool _enabled) external onlyOwner{
        for (uint i = 0; i < _addresses.length; i++) {
            isWhitelisted[_addresses[i]] = _enabled;
        }
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseURIextended = baseURI;
    }

    function baseURI() public view returns (string memory) {
        return _baseURI();
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }


    function changePauseState() external onlyOwner {
        paused = !paused;
    }

    function updatePrice(uint256 _basePrice, uint256 _finalPrice) external onlyOwner {
        basePrice = _basePrice;
        finalPrice = _finalPrice;
    }

    function updateMaxPurchase(uint _maxPurchase) external onlyOwner {
        maxPurchase = _maxPurchase;
    }

    function updateMaxSupply(uint256 _maxSupply) external onlyOwner {
        maxSupply = _maxSupply;
    }

    function updateFinalPriceTime(uint _finalPriceTime) external onlyOwner {
        finalPriceTime = _finalPriceTime;
    }

    function reveal() external onlyOwner {
        revealed = true;
    }

    function withdraw() external onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

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
        if (revealed == false) {
            return notRevealedUri;
        }

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
    
    function setNotRevealedURI(string memory _notRevealedURI) external onlyOwner {
        notRevealedUri = _notRevealedURI;
    }

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