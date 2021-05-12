// https://docs.soliditylang.org/en/v0.6.0/solidity-by-example.html#safe-remote-purchase
// https://wiki.cryptodevhub.io/ethereum-evm/getting-started

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "hardhat/console.sol";

// Compile locally - $npx hardhat compile and verify src/artifcats/contracts
// Test - $npx hardhat test
// UI - Edit src/App.js and $yarn start with metamask

// Include vote feature for each item in the list
// Include selfdestruct and transfer ownership

contract Top {
  address public owner;

  struct Item {
    string name;
    uint upvotes;
    uint downvotes;
    uint created_at;
  }

  Item[] public tops;

  constructor() {
    console.log("Deploy Top and set owner to ", msg.sender);
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "The message sender is not the owner.");
    // Underscore is a special character only used inside
    // a function modifier and it tells Solidity to
    // execute the rest of the code.
    _;
  }

  // Invalid implicit conversion from address to address payable requested
  function setNewOwner(address newowner) 
  public 
  payable 
  onlyOwner {
    owner = newowner;
  }

  // Solidity can return the entire array.
  // But this function should be avoided for
  // arrays that can grow indefinitely in length.
  function getTops() public view returns (Item[] memory) {
    return tops;
  }

  function totalTops() public view returns (uint) {
    return tops.length; // Will this be always 5 or change with include or remove?
  }

  function include(Item memory top) public onlyOwner {
    // console.log("Include ", top); // console.log here is Not helpful for the test

    tops.push(top);
  }

  function remove(uint index) public onlyOwner {
    // console.log("Remove ", index);

    // Delete does not change the array length.
    // It resets the value at index to it's default value,
    // in this case 0
    delete tops[index];
  }

  // This doens't work?
  // function destroy() public payable{
  //   require(msg.sender == owner);
  //   selfdestruct(owner);
  // }
}
