//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTERC721 is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Strings for uint256;

    address public marketplace;
    address public auction;
    uint public constant AIRDROPINDEX = 1000000000000000000;
    uint public auctionMarketPlaceIndex = AIRDROPINDEX;

    mapping(uint => string) private tokenURIs;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) ReentrancyGuard() {
    }

    function updateAddresses(address _marketplace, address _auction) external onlyOwner {
        marketplace = _marketplace;
        auction = _auction;
    }

    function airdropOwner(address _to, uint _tokenID, string calldata _uri) external onlyOwner returns (uint){
        require (_tokenID < AIRDROPINDEX, "Token ID must be less than 1000000000000000000");
        _mint(_to, _tokenID);
        tokenURIs[_tokenID] = _uri;
        return _tokenID;
    }

    function airdrop(address _to, string calldata _uri) external returns (uint) {
        require(msg.sender == marketplace || msg.sender == auction, "Only owner or marketPlace or auction can airdrop");
        auctionMarketPlaceIndex++;
        _mint(_to, auctionMarketPlaceIndex);
        tokenURIs[auctionMarketPlaceIndex] = _uri;
        return auctionMarketPlaceIndex;
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

    function  tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return tokenURIs[tokenId];
    }

}