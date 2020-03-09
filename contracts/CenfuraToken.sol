pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

/**
 * @title CenfuraToken
 */
contract CenfuraToken is ERC20, ERC20Detailed, ERC20Burnable, ERC20Pausable, Ownable {

  string public constant NAME = "Cenfura Token";
  string public constant SYMBOL = "XCF";
  uint8 public constant DECIMALS = 18;

  uint256 public constant INITIAL_SUPPLY = 1500000000 * (10 ** uint256(DECIMALS));

  mapping (address => bool) public frozenAccounts;
  event FrozenFunds(address target, bool frozen);

  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  constructor() ERC20Detailed(NAME, SYMBOL, DECIMALS) public {
    _mint(msg.sender, INITIAL_SUPPLY);
  }

  function freezeAccount(address target, bool freeze) public onlyOwner {
    frozenAccounts[target] = freeze;
    emit FrozenFunds(target, freeze);
  }

  // Check that transfer from or to is not a frozen account
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(!frozenAccounts[msg.sender]);
    return super.transfer(_to, _value);
  }

  // Check that transfer from or to is not a fronzen account
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    require(!frozenAccounts[_from]);
    return super.transferFrom(_from, _to, _value);
  }

  // Limit the burn to be only allowed by owner
  function burn(uint256 _value) public onlyOwner {
    super.burn(_value);
  }

}
