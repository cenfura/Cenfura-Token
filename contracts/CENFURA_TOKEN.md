# Cenfura Token

CenfuraToken.sol is based on secure, tested and community-audited contracts:
https://github.com/OpenZeppelin/openzeppelin-solidity

The Cenfura Token (XCF) is derived from 5 contracts:

* [ERC20 Token](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol): Standard implementation of the ERC20 standard
* [ERC20 Detailed Token](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20Detailed.sol): add implementation of optional functions for name, symbol and decimals
* [Ownable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/ownership/Ownable.sol): Enables notion of ownership, contract ownership can be transferred
* [Burnable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20Burnable.sol): Allow tokens to be burned, though we limit to only contract owner
* [Pausable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/lifecycle/Pausable.sol): Allow contract owner to pause contract that prevents any transactions happening

As an addition, this contract allows freezing individual accounts. When account is
frozen, no tokens can be withdrawn the account.

# Addresses on test network

This describes the deployment of Cenfura Token (XCF) on the ropsten test net.

* Smart contract managing XCF: https://ropsten.etherscan.io/address/0x010D14d36C3eA6570D240ae3ac9d660398f7C48e
* Contract creator and initial owner of the contract: https://ropsten.etherscan.io/address/0x9c9e0fF9F80034994BEad3802dff098B0425AF39
* Contract creation (= deployment): https://ropsten.etherscan.io/tx/0x8a467f09331511baf7e2cdd8fd7a9c645bea1c4b092de7b18769608bd37b90a1
