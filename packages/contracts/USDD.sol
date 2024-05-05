// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title USDD (USD Decentralized Dollar)
 * @dev Simple ERC-20 stablecoin contract representing USD.
 */
contract USDD is ERC20 {
    constructor() ERC20("USD Decentralized Dollar", "USDD") {
        _mint(msg.sender, 1000000 * (10 ** decimals())); // Mint 1,000,000 USDD tokens initially
    }

    /**
 * @dev Function to mint additional USDD tokens.
 * @param _amount The amount of tokens to mint.
 */
function mintTokens(uint256 _amount) public {
    _mint(msg.sender, _amount);
}

}
