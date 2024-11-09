//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract NFTERC1155 is ERC1155, Ownable, ReentrancyGuard {
    
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    address public marketplace;
    address public auction;
    uint public constant AIRDROPINDEX = 1000000000000000000;
    uint public auctionMarketPlaceIndex = AIRDROPINDEX;

    mapping(uint256 => string) private _tokenURIs;

    constructor(string memory dapp, string memory version) ERC1155("") ReentrancyGuard() {
    }

    function _setTokenURI(uint tokenId, string calldata _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    ///@notice fetches the URI associated with a token
    ///@param tokenId the id of the token
    function uri(uint256 tokenId) override public view returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function airdropOwner(address _to, uint _tokenID, uint quantity, string calldata _uri) external onlyOwner returns (uint){
        require (_tokenID < AIRDROPINDEX, "Token ID must be less than 1000000000000000000");
        _mint(_to, _tokenID, quantity, "");
        _setTokenURI(_tokenID, _uri);
        return _tokenID;
    }

    function airdrop(address _to, uint256 _quantity, string calldata _uri) external returns (uint) {
        require(msg.sender == marketplace || msg.sender == auction, "Only owner or marketPlace or auction can airdrop");
        auctionMarketPlaceIndex++;
        _mint(_to, auctionMarketPlaceIndex, _quantity, "");
        _setTokenURI(auctionMarketPlaceIndex, _uri);
        return auctionMarketPlaceIndex;
    }

    function updateAddresses(address _marketplace, address _auction) external onlyOwner {
        marketplace = _marketplace;
        auction = _auction;
    }
}