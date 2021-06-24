// // Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// // SCAM_Token deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
// // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 will have 20000000 SCAM

// pragma solidity =0.7.6;

// // https://hardhat.org/tutorial/debugging-with-hardhat-network.html
// import "hardhat/console.sol";

// contract HackableContract {
//     address public constant SCAM_TOKEN_ADDRESS = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
//     // address public constant SCAM_TOKEN_ADDRESS = 0xdb78FcBb4f1693FDBf7a85E970946E4cE466E2A9;
        
//     uint8 public count = 0;
//     mapping(address => bool) addressRegistered;
// 	mapping(address => uint8) addressToId; // 0 to 255
// 	mapping(uint8 => uint256) balances;

//     // To help test to make async 
//     event SomeoneDepositScam(
//         uint256 when
//     );

//     event WithdrawScam(
//         // uint256 when,
//         // address by,
//         uint256 amount
//     );

//     event SetCount(
//         uint256 when
//     );
//     // In the original code, there is no funciton similar to this.
//     // funciton to help test easy
//     function setCount(uint8 scam) external {
//         count = scam;
//         emit SetCount(
//             block.timestamp
//         );
//     }

//     // What is origin?
// 	function depositScam(address origin, uint256 amount) external
// 	{
// 	    BEP20 scamToken = BEP20(SCAM_TOKEN_ADDRESS);
	    
//         // This was only called once by owner so it doesn't matter with if or not
// 	    if (!addressRegistered[origin]) {
// 	        count++;
// 	        addressRegistered[origin] = true;
// 	        addressToId[origin] = count;

//             // It is already 0, no need for that
// 	        // balances[Count] = 0; It was also a bug point.
//             // Could make balances[id] = 0 if amount 0 again in the second circle
// 	    }
	    
//         // I need to take this for WithdrawScam part.
// 	    uint8 id = addressToId[origin];
// 	    balances[id] += amount; // If I call it with 0, it doesn't change.
        
//         // Allow HackableContract first to call this in the test.
// 	    scamToken.transferFrom(origin, address(this), amount);

//         emit SomeoneDepositScam(
//             block.timestamp
//         );
// 	}

//     function withdrawScam(uint256 amount) external 
//     {
//         BEP20 scamToken = BEP20(SCAM_TOKEN_ADDRESS);
        
//         // I need to take this with DepositScam part.
//         uint8 id = addressToId[msg.sender];
//         uint256 bal = balances[id];

//         console.log(id);
//         console.log(bal);
        
//         // Target is here
//         require(amount <= bal); 
        
//         balances[id] -= amount;
//         scamToken.transfer(msg.sender, amount);

//         emit WithdrawScam(
//             amount
//         );
//     }

// }

// // Interface for BEP20
// abstract contract BEP20 {
    
//     function balanceOf(address tokenOwner) virtual external view returns (uint256);
//     function transfer(address receiver, uint256 numTokens) virtual public returns (bool);
//     function transferFrom(address owner, address buyer, uint numTokens) virtual external returns (bool);
//     function totalSupply() virtual external view returns (uint256);
// }