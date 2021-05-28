// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

// ERC20 token test

// Hard to test with this
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// contract SCAMToken is ERC20 {
//     constructor(uint256 initialSupply) ERC20("Safely Created Alternative Money", "SCAM") {
//         _mint(msg.sender, initialSupply);
//     }
// }

// @openzeppelin/contracts at package.json
// https://docs.openzeppelin.com/contracts/3.x/erc20
// https://medium.com/stakingbits/setting-up-metamask-for-binance-smart-chain-bsc-921d9a2625fdx
// https://dev.to/otter/a-deep-dive-into-creating-a-shitcoin-1af5
// https://hardhat.org/guides/hardhat-console.html

// So use this
// From
// https://bscscan.com/address/0xdb78fcbb4f1693fdbf7a85e970946e4ce466e2a9#contracts
contract SCAMToken {
    using SafeMath for uint256;

    address payable publisher;

    // string public constant name = "Safe Crypto And Money";
    string public constant name = "Steadylearner Created Alternative Money";
    // string public constant name = "Someone Created Alternative Money";
    // string public constant name = "Satoshi Created Alternative Money";
    string public constant symbol = "SCAM";
    uint8 public constant decimals = 18;  

    uint256 totalSupply = 10 ** (8 + 18);
	uint256 preMine = 2 * (10 ** (7 + 18));
	uint airdropSize = 10 ** (6 + 18);
	
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Disapproval(address indexed tokenOwner, address indexed spender);

    event Transfer(address indexed from, address indexed to, uint tokens);

    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;

    modifier onlyPubiisher() {
        require(
            msg.sender == publisher,
            "Only publisher can call this."
        );
        _;
    }
    
    constructor() payable {  
		require(preMine <= totalSupply);
		
		publisher = payable(msg.sender);
		
		balances[address(this)] = totalSupply.sub(preMine);
		balances[publisher] = preMine;
    }  

    function showTotalSupply() external view returns (uint256) {
		return totalSupply;
    }
        
    function balanceOf(address tokenOwner) external view returns (uint) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint numTokens) public returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint numTokens) external returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    // Include disapprove
    function disapprove(address delegate) external returns (bool) {
        // delete allowed[msg.sender][delegate]; // Make it to 0?
        allowed[msg.sender][delegate] = 0;
        emit Disapproval(msg.sender, delegate);
        return true;
    }

    function allowance(address owner, address delegate) external view returns (uint) {
        return allowed[owner][delegate];
    }


    function transferFrom(address owner, address buyer, uint numTokens) external returns (bool) {
        require(numTokens <= balances[owner]);    
        require(numTokens <= allowed[owner][msg.sender]);
    
        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
		
	function airdropTokens(address receiver) external onlyPubiisher {
		require(airdropSize <= balances[address(this)]);
		
        // From this contract balance to a user
		this.transfer(receiver, airdropSize);
	}

	// function releaseBNB() external onlyPubiisher {
	// 	publisher.transfer(address(this).balance);
	// }
	
	fallback() external {
        revert("No donation.");
    }
}

library SafeMath { 
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}