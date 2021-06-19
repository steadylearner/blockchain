In this post, you will learn how to test a custom BEP20 token with [Hardhat](https://hardhat.org/) and [ethers.js](https://docs.ethers.io/v5/) NPM package. 

The BEP20 token we will be testing today is the $SCAM token.

SCAM is a BEP20 token created on Binance Smart Chain. $SCAM has a 100k marketcap currently (350k at its/BNB's ATH) and a limited supply of 100 million tokens, a lot of which was distributed through multiple free airdrops on reddit that helped grow the community into 200+ members on telegram and 700+ on [reddit](https://www.reddit.com/r/scam_coin/). 

$SCAM follows a bare-bone ERC20 token implementation deployed on the BSC Mainnet with basically no admin functions or centralized control - no blacklist, burn or freeze functions and also no additional tokens can be minted. 

[Find out more with this post.](https://www.reddit.com/r/scam_coin/comments/n4oomy/all_you_need_to_know_about_safe_crypto_and_money/)

[You can also visit their website.](https://www.scam-coin.org/#about)

I hope you already have solidity development environment ready at your machine. 

Otherwise, please refer to my previous post [How to make a fullstack dapp with React, Hardhat and ethers.js](https://dev.to/steadylearner/how-to-make-a-fullstack-dapp-with-react-hardhat-and-ether-js-with-examples-4fi2/) with examples.

## Table of contents

1. Why was SCAM token chosen for this post?
2. Inspect the SCAM contract source code
3. Prepare tests for it
4. Conclusion

---

[You can find the entire code used for this post here.](https://github.com/steadylearner/blockchain/tree/main/real/scam)

## 1. Why was SCAM token chosen for this post?

![SCAM](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7ymtfa2yq0x3mkob5zel.png)

I came across Safe Crypto and Money ($SCAM) randomly on the dev.to website through the [developer's story](https://dev.to/otter/a-deep-dive-into-creating-a-shitcoin-1af5) about how learning about ERC20 tokens and programming practice on Solidity became a passion project leading to this coin. 

I was just restarting blockchain development again and I found the [story](https://www.reddit.com/r/scam_coin/comments/nei371/scam_my_deep_dive_into_creating_a_shitcoin/) of the author very interesting.

What started out as a meme token, as can be understood from the name itself, organically evolved into an awesome friendly community where beginners and developers alike could learn more about cryptocurrency and DeFi. 

They've already launched a website and implemented a fully decentralized liquidity rewards contract, and are currently [working](https://www.reddit.com/r/scam_coin/comments/nq9d8d/oh_shit_its_a_roadmap/) on decentralized governance and treasury, as well as a faucet. 

The community itself has become a place of healthy conversation, discussion and ideation, and a launching platform for various voluntary projects taken up by members such as a coin-listing site, NFTs, merchandise, and marketing campaigns.

First, I thought it was just a joke but I was intrigued by the post. I found the project funny and wanted to be more involved with the project and found [its Telegram group](https://t.me/SCAM_Coin_Community) also.

Different from my first expectation, the members of the group were very helpful. I could find [a clue to set up and deploy a smart contract code](https://testnet.bscscan.com/address/0xF26c1f9Ac029629d8e1dD0D15738EB0929CF2D04#code) that one of my client wanted to test.

I also inspired myself to write [How to make a fullstack dapp with React, Hardhat and ethers.js with example](https://dev.to/steadylearner/how-to-make-a-fullstack-dapp-with-react-hardhat-and-ether-js-with-examples-4fi2) by participating in the group.

I think it helped me a lot in getting further involved with blockchain stuffs and find useful information.

It is important to have someone help you get familiar with cryptocurrency and its relevant technologies. Otherwise, it is very easy to get scammed and lose money.

If you want to know more about SCAM after this post, you can participate in [its Telegram group](https://t.me/SCAM_Coin_Community).

Currently, [the faucet contract](https://bscscan.com/address/0xfcf2774cd61743ff7c34607fadf3c84fc4762029#code) to get SCAM free is also working so you can hold it free. I think it can be a good opportunity to have your first cryptocurrency.

[For more details, you can read this post for the faucet also.](https://www.reddit.com/r/scam_coin/comments/o3ebuc/new_scam_faucet_out_now/)

The website for it is also ready at https://faucet.scam-coin.org/ page.

![scam faucet](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hnbd7p2hjytv7ko43ogk.png)

You can use any wallet in the list below.

![allowed wallets](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bcknd2nktah9we2bcu7t.png)

Then, connect it to the website.

![connect it to the website](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ve1hn1y8lyf8hd1s0bf0.png)

Finally, follow its instruction to get your first $SCAM token.

![Instruction](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qvso8ypqxc22dj6z2jal.png)

If you have any doubt, please join the group and ask the members in there for help. They will help you to learn about SCAM, cryptocurrency, smart contracts and DeFi in general and other blockchain relevant stuffs.  

## 2. Inspect the SCAM contract source code

![SCAM](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tnxcbbm4lz41samqr0kd.png)

Before you start, BEP20 token specification is equal to ERC20 equivalent, so if you are not familiar with that, please read [the documentation for it](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20) first.

[You can see that SCAM was verified by bscscan with the code snippet similar to this.](https://bscscan.com/address/0xdb78fcbb4f1693fdbf7a85e970946e4ce466e2a9#code)

```js
pragma solidity >=0.4.22 <0.6.0;

contract SCAM_Token {

  // 1.
  string public constant name = "Safe Crypto And Money";
  string public constant symbol = "SCAM";
  uint8 public constant decimals = 18;  

  event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
  event Transfer(address indexed from, address indexed to, uint tokens);

  mapping(address => uint256) balances;
  mapping(address => mapping (address => uint256)) allowed;
    
  // 2.
  uint256 totalSupply_ = 10 ** (8 + 18);
  uint256 preMine_ = 2 * (10 ** (7 + 18)); // This is what the owner of this token will take
  uint airdropSize_ = 10 ** (6 + 18);

  address payable owner_;

  using SafeMath for uint256;

  constructor() public {  
  
    require(preMine_ <= totalSupply_);
    
    owner_ = msg.sender;
    
    // 2. 
    balances[address(this)] = totalSupply_.sub(preMine_);
    balances[owner_] = preMine_;    
  }  

  function totalSupply() external view returns (uint256) {
    return totalSupply_;
  }
    
  // 3.
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
	
  // 4.
  function airdropTokens(address receiver) external {
    require(msg.sender == owner_);
    require(airdropSize_ <= balances[address(this)]);
		
    this.transfer(receiver, airdropSize_);
  }

  // 5.
  function releaseBNB() external {
     require(msg.sender == owner_);
     owner_.transfer(address(this).balance);
  }
	
  // Fallback function
  function() external payable {}
}

// 6.
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
```

You can see there are not many lines of code involved here and I found that to be a very strong point of SCAM token. There are no ways possible for it to really SCAM you.

We will inspect each part of it. This will help you find what this contract does and write tests in the next part to confirm that.

**1.** This is where the owner of the contract can define BEP20 token name, symbol and the decimal for it. It is just following the ERC20 standard.

**2.** Here, the total supply of the token is defined. There are no mint or burn function for SCAM. You can see that there is a fixed amount of SCAM tokens(100000000). 

Then, the owner of the contract will take 20000000 of it and 1000000 will be used with `airdropTokens` function.

**3.** These functions until **4.** is just some parts of [IERC20 standard functions]( https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#IERC20). It was the intention of its author.

**4.** This is where airdrop of the SCAM token happens, you can see it is sent from the contract to receiver. (100000000 - 20000000 = 80000000 in the constructor part)

**5.** This part is not relevant to the SCAM token logic. It is just a fallback function that extracts the BNB balance from the contract.

I spoke with the author and he told me that he included it to receive donation for the contract.

It is not relevant to SCAM token logic. But, we will include the test to see if it affects the balance of a SCAM holders in the next part. 

**6.** These are some functions from [SafeMath OpenZeppelin library](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol) code. 

You can read their documentation for more information.

## 3. Prepare tests for it

![SCAM](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kzr2po8pqwrlopl1vkrn.png)

In the previous part, we inspected the contract code for SCAM and see what each part of it does.

We will write simple tests for it to find that they all work ok.

I will assume you are using the source code link I shared at the beginning of this post. 

Before you update your project, please edit your **hardhat.config.js** and use the solidity compiler version between `>=0.4.22 <0.6.0` that you prefer.

```js
module.exports = {
  defaultNetwork: "hardhat",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    // $npx hardhat run scripts/deploy.js --network localhost
    // https://hardhat.org/config/
    hardhat: {
      chainId: 1337,
    },
  },
  solidity: "0.5.6", // This is where you should edit.
};
```

Use `$yarn compile` (npx hardhat compile) to see if the contract code really compiles and it should show a result similar to this.

```console
Creating Typechain artifacts in directory typechain for target ethers-v5
Successfully generated Typechain artifacts!
```

Use `$yarn serve` (npx hardhat node) in a console to set up local solidity dev env with hardhat.

Then, verify that everything is ok with your **scripts/deploy.js** file.

```js
// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const SCAM = await hre.ethers.getContractFactory("SCAM_Token");

  const scam = await SCAM.deploy();
  await scam.deployed();

  console.log("SCAM_Token deployed to:", scam.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

Test that it works with `$yarn deploy` in another console to see if the smart contract code will be deployed or not without any issue.

If you could make it to this part, we can finally write tests for the SCAM contract.

You can see the **test/scam-test.js** file in the repository similar to this.

```js
// ethers is global variable here.

const { expect } = require("chai");
const { expectRevert } = require('@openzeppelin/test-helpers');

// 1.
const totalSupplyBigNumberHex = ethers.BigNumber.from("0x52b7d2dcc80cd2e4000000");
const preMineBigNumberHex = ethers.BigNumber.from("0x108b2a2c28029094000000");
const airDropSize = "1000000000000000000000000"; // "0xD3C21BCECCEDA1000000"

describe("SCAMToken state and transactions", function () {
  let SCAMToken, scamToken, owner, firstComer, secondComer; // seller is owner

  // We don't include events here 
  // because it was already handled in the previous post
  beforeEach(async () => {
    provider = ethers.getDefaultProvider();

    SCAMToken = await ethers.getContractFactory("SCAM_Token");
    scamToken = await SCAMToken.deploy();

    [owner, firstComer, secondComer, _] = await ethers.getSigners();
  });

  it("Should test 'totalSupply' and other default values.", async function () {
    // 2.
    expect(await scamToken.symbol()).to.equal("SCAM");
    expect(await scamToken.name()).to.equal("Safe Crypto And Money");
    expect(await scamToken.decimals()).to.equal(18);

    const totalSupply = await scamToken.totalSupply();
    expect(totalSupply).to.equal(totalSupplyBigNumberHex);

    // What the owner takes from the total supply
    const preMine = await scamToken.balanceOf(owner.address);
    expect(preMine).to.equal(preMineBigNumberHex);
  });

  it("Should test 'airdropTokens' and the contract and receiver balance change.", async function () {
    // 3.
    await expectRevert.unspecified(scamToken.connect(firstComer).airdropTokens(firstComer.address));
    await expectRevert.unspecified(scamToken.connect(secondComer).airdropTokens(secondComer.address));

    // From contract to a user
    await scamToken.airdropTokens(firstComer.address);
    // Include contract balance also here.
    const firstComerBalance = await scamToken.balanceOf(firstComer.address);
    expect(firstComerBalance.toString()).to.equal(airDropSize);
  });

  // 4.
  it("Should test 'transfer' from the owner to firstComer.", async function () {
    // From a user to another user
    const amountToTransfer = 1000000;
    await scamToken.transfer(firstComer.address, amountToTransfer);

    let firstComerBalance = await scamToken.balanceOf(firstComer.address);
    expect(firstComerBalance.toString()).to.equal(amountToTransfer.toString());
  });

  it("Should test 'approve' and 'allowance' from the owner to firstComer.", async function () {
    const amountForApproval = 1000000;
    await scamToken.approve(firstComer.address, amountForApproval);

    const allowance = await scamToken.allowance(owner.address, firstComer.address);
    expect(allowance.toString()).to.equal(amountForApproval.toString());
  });

  it("Should test 'approve', 'allowance' and 'transferFrom'.", async function () {
    const amountForApproval = 1000000;
    await scamToken.approve(firstComer.address, amountForApproval);
    const allowance = await scamToken.allowance(owner.address, firstComer.address);
    expect(allowance.toString()).to.equal(amountForApproval.toString());

    await scamToken.connect(firstComer).transferFrom(owner.address, secondComer.address, amountForApproval);

    const secondComerBalance = await scamToken.balanceOf(secondComer.address);
    expect(secondComerBalance.toString()).to.equal(amountForApproval.toString());
  });

  // 5.
  it("Should test 'releaseBNB' and it shouldn't affect the balance of other users (not owners)", async function () {
    const amountForApproval = 1000000;
    await scamToken.approve(firstComer.address, amountForApproval);
    const allowance = await scamToken.allowance(owner.address, firstComer.address);
    expect(allowance.toString()).to.equal(amountForApproval.toString());

    await scamToken.connect(firstComer).transferFrom(owner.address, secondComer.address, amountForApproval);

    const secondComerBalance = await scamToken.balanceOf(secondComer.address);
    expect(secondComerBalance.toString()).to.equal(amountForApproval.toString());

    await scamToken.releaseBNB();
    expect(secondComerBalance.toString()).to.equal(amountForApproval.toString());
  });
});
```

The smart contract code for SCAM is very simple and we don't need a lot of lines of code to test it also.

**1.** There are very big numbers are involved for BEP20 token contract. We need their hex values to test them with hardhat and ethers.js package.

Therefore, I manually included them. For that, you can use your Python console with **hex** function.

```console
$python
>>> hex(1000000000000000000000000)
'0xd3c21bcecceda1000000'
>>> hex(1000000000000000000000000000000)
'0xc9f2c9cd04674edea40000000'
>>> hex(1000000000000000000000000000000000)
'0x314dc6448d9338c15b0a00000000'
>>> hex(1000000000000000000000000)
'0xd3c21bcecceda1000000'
>>> 10 ** 26
100000000000000000000000000
>>> hex(_)
'0x52b7d2dcc80cd2e4000000'
```

You can also refer to [How to use Python in JavaScript with examples](https://dev.to/steadylearner/how-to-use-python-in-javascript-4bnm) post to include that to your JavaScript code.

Otherwise, you can find a JavaScript function to find hex value of the big number also. But, that will be unnecessary if you know how to use Python also.

**2.** We test here to see contract name, symbol and the decimal is set correctly when the contract is deployed. You can also verify if the total supply of the token is set and preMine amount is correctly saved to the address of the owner of the contract. 

**3.** In this part, we first check if other users (not owners) can call airdropTokens or not.

You can see if the caller were firstComer or secondComer (not owners), the contract shouldn't allow to use `airdropTokens` function. In the contract, there is no error message set, so we use `unspecified` api from **@openzeppelin/test-helpers** package to test them.

You can also see the receiver have airDropSize amount of token "1000000000000000000000000" after that. This can be confusing comparing to the smart contract part but you can see the decimal value is "18". If we consider that, the large number will be 1000000 of SCAM token and sent to the receiver.

**4.** Tests below this will be help you find how some of ERC20 standard functions included for this contract work.
 
You can see transfer, approve, allowance, transferFrom will work all ok with them.

**5.** There were fallback function and releaseBNB in the contract code for donation.

```js
function releaseBNB() external {
  require(msg.sender == owner_);
  owner_.transfer(address(this).balance);
}
	
// Fallback function
function() external payable {}
```

We can test that calling this function will not have any effect for not owners.

You can see the balance for the firstComer is equal after calling `releaseBNB` function in the test.

You could write more tests here if you want.

Test all of them really work at your machine with `$yarn test` (npx hardhat test) and you will see every test passes with the result similar to this.

```console
$yarn test
Creating Typechain artifacts in directory typechain for target ethers-v5
Successfully generated Typechain artifacts!

  SCAMToken state and transactions
    ✓ Should test 'totalSupply' and other default values.
    ✓ Should test 'airdropTokens' and the contract and receiver balance change.
    ✓ Should test 'transfer' from the owner to firstComer.
    ✓ Should test 'approve' and 'allowance' from the owner to firstComer.
    ✓ Should test 'approve', 'allowance' and 'transferFrom'.
    ✓ Should test 'releaseBNB' and it shouldn't affect the balance of other users (not owners)
```

Hope you could make all tests pass.

## 4. Conclusion

In this post, we learnt how to test a custom BEP20 token with [SCAM](https://scam-coin.org/). I introduced it because I found its community very helpful. Hope the code snippet used here can be a starting point to test other BEP20 or ERC20 tokens also before you buy them.

ERC20 and BEP20 token are almost identical and you will be able to use the code snippet used here for the former as well.

If you liked the post, please share it with others. I am plan to share more blockchain relevant stuffs. I am interested in ETH and POLKADOT.

[If you need to hire a developer, you can contact me.](https://t.me/steadylearner)

[I can write a full stack dapp.](https://dev.to/steadylearner/how-to-make-a-fullstack-dapp-with-react-hardhat-and-ether-js-with-examples-4fi2) 

[I can also clone, set up, update and deploy another blockchain project if you want.](https://testnet.bscscan.com/address/0xF26c1f9Ac029629d8e1dD0D15738EB0929CF2D04#code) 

Thanks.