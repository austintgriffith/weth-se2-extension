//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface IWETH {
  function deposit() external payable;
  function withdraw(uint wad) external;
  function balanceOf(address account) external view returns (uint256);
  function transfer(address recipient, uint256 amount) external returns (bool);
}

contract WethHolder {
  address public constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
  IWETH private weth = IWETH(WETH);

  event Deposited(address indexed user, uint256 amount);
  event Withdrawn(address indexed user, uint256 amount);

  function deposit() public payable {
    weth.deposit{value: msg.value}();
    emit Deposited(msg.sender, msg.value);
  }

  function withdraw(uint256 amount) public {
    require(weth.balanceOf(address(this)) >= amount, "Insufficient WETH balance");
    weth.withdraw(amount);
    payable(msg.sender).transfer(amount);
    emit Withdrawn(msg.sender, amount);
  }

  function getBalance() public view returns (uint256) {
    return weth.balanceOf(address(this));
  }

  receive() external payable {
    if (msg.sender == WETH) {
      return;
    }
    deposit();
  }

  fallback() external payable {
    if (msg.sender == WETH) {
      return;
    }
    deposit();
  }
}
