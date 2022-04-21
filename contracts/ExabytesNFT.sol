//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "erc721a/contracts/ERC721A.sol";

contract ExabytesNFT is ERC721A, Ownable, ReentrancyGuard {

    uint256 public constant maxBatchSize = 2;
    uint256 public constant maxPerAddress = 10;
    uint256 public constant price = 0.01 ether;

    uint256 public maxTotalSupply;
    string public baseTokenURI;

    constructor(uint256 _maxTotalSupply, string memory _baseTokenURI) ERC721A("ExabytesNFT", "ExabytesNFT") {
        require(_maxTotalSupply > 0,
            "ExabytesNFT: Can't set zero total supply."
        );
        maxTotalSupply = _maxTotalSupply;
        baseTokenURI = _baseTokenURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function _startTokenId() internal view override virtual returns (uint256) {
        return 1;
    }

    function reserve(uint256 _amount) external onlyOwner {
        require(_amount <= maxTotalSupply, 
            "ExabytesNFT: amount is higher than maxTotalSupply."
        );

        _safeMint(msg.sender, _amount);
    }

    function mint(uint256 _amount) external payable {
        require(_amount > 0, 
            "ExabytesNFT: The amount of minted NFT must be more than 0."
        );
        require(_amount <= maxBatchSize,
            "ExabytesNFT: You have exceeded the transaction limit."
        );
        require(balanceOf(msg.sender) + _amount <= maxPerAddress,
            "ExabytesNFT: You have exceeded the allowed owned NFT."
        );
        require((totalSupply() + _amount) <= maxTotalSupply,
            "ExabytesNFT: Sorry, all NFTs are sold out."
        );
        require((price * _amount) <= msg.value,
            "ExabytesNFT: the amount of ether sent is not enough."
        );

        _safeMint(msg.sender, _amount);
    }

    function withdraw() external onlyOwner nonReentrant {
        uint balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }
}