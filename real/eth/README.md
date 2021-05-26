In this post we will learn how to make a full stack dapp similar to the cover of this post. We will make a simple safe remote purchase escrow contract with Solidity. Then, write tests for them and build a frontend for it also.

I referred [The complete guide to full stack ethereum development](https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13) to set up the development environment locally. 

You can clone [the code used for this post at the repository use $yarn to install dependencies used here.](https://github.com/steadylearner/blockchain/tree/main/real/eth)

Read [Hardhat](https://hardhat.org/) and [ethers.js](https://docs.ethers.io/v5/) documentations also.

We will use the [Metamask browser plugin](https://metamask.io/) for this tutorial. 

Please, install it first to your browser if you don't have it yet.

A red car image is used here to make the example more realistic. But, you can also use another product and edit some descriptions at the frontend code.

The commands you will use to locally develop the dapp used here will be these in order. You will need to use them only after you read this post if you want to make your own version.

```toml
# See your Solidity code for the contract 
# is ok and compile without any error or warning.
compile="npx hardhat compile",
# Write tests to see the smart contract code works 
# as you expect for various situations.
test="npx hardhat test",

# Run local solidity development environment.
# It will set up dummy accounts that you can use to test.
serve="npx hardhat node",
# Upload your Solidity contract code to it 
# before you run the frontend code.
deploy="npx hardhat run scripts/deploy.js --network localhost",

# Run your React frontend code.
start="react-scripts start",
```

Save them at [package.json](https://github.com/steadylearner/blockchain/blob/main/real/eth/package.json) and use with `$yarn compile` etc or write a simple CLI if you want to save comments.

While testing your dapp, you will need some accounts and also it will helpful to take part in any community to help you.

If you don't have any cryptocurrency wallet yet, you can make one at [Binance](https://accounts.binance.com/en/register?ref=SQ86TYC5).

[If you are interested in learning ERC20 or BEC20 token, you can participate in this community to learn blockchain relevant stuffs.](https://t.me/SCAM_Coin_Community)

You can also buy and sell your crafts at [Opensea](https://opensea.io?ref=0x5c09780933620765a1fb91c09fd637103a74ee2d). 

## Table of contents

1. Write the smart contract with Solidity
2. Prepare the tests for it 
3. Set up Metamask with Hardhat
4. Write the frontend code with React and ethers.js
5. Conclusion

---

<br />

## 1. Write the smart contract with Solidity

If you are not familiar with Solidity and other Ethereum development relevant stuffs, you can refer to [its official website](https://docs.soliditylang.org/en/v0.8.4/).

The code used here is adapted from [the official safe remote purchase example](https://docs.soliditylang.org/en/v0.8.4/solidity-by-example.html#safe-remote-purchase). 

Please read the code below thoroughly first. I included explanation for it later.

```js
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Escrow {
    uint public price;
    address payable public seller;
    address payable public buyer;

    // 1.
    address[] previousBuyers;

    // 2.
    enum State { Sale, Locked, Release, Closed, Complete }
    
    State public state;

    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    modifier onlyBuyer() {
        require(
            msg.sender == buyer,
            "Only buyer can call this."
        );
        _;
    }

    modifier onlySeller() {
        require(
            msg.sender == seller,
            "Only seller can call this."
        );
        _;
    }

    // 3.
    modifier notSeller() {
        require(
            msg.sender != seller,
            "Seller shouldn't call this."
        );
        _;
    }

    modifier inState(State _state) {
        require(
            state == _state,
            "Invalid state."
        );
        _;
    }

    // 4.
    event Closed(
        uint256 when
    );

    event ConfirmPurchase(
        uint256 when,
        address by
    );
    event ConfirmReceived(
        uint256 when,
        address by
    );
    
    event SellerRefundBuyer(
        uint256 when
    );
    event SellerRefunded(
        uint256 when
    );

    event Restarted(
        uint256 when
    );
    event End(
        uint256 when
    );

    constructor() payable {
        seller = payable(msg.sender);

        price = msg.value / 2;
        
        require((2 * price) == msg.value, "Value has to be even.");
    }

    // 5. 
    function close()
        public
        onlySeller
        inState(State.Sale)
    {
        state = State.Closed;
        seller.transfer(address(this).balance);
        
        emit Closed(
            block.timestamp
        );
    }

    function confirmPurchase()
        public
        notSeller
        inState(State.Sale)
        condition(msg.value == (2 * price))
        payable
    {
        buyer = payable(msg.sender);
        state = State.Locked;

        emit ConfirmPurchase(
            block.timestamp,
            buyer
        );
    }

    function confirmReceived()
        public
        onlyBuyer
        inState(State.Locked)
    {
        state = State.Release;

        buyer.transfer(price); // Buyer receive 1 x value here
        emit ConfirmReceived(
            block.timestamp,
            buyer
        );
    }

    // 6.
    function refundBuyer()
        public
        onlySeller
        inState(State.Locked)
    {
        // Give the option to the seller to refund buyer before sending a product(car) here.
        state = State.Sale;
        buyer = payable(0);
        
        emit SellerRefundBuyer(
            block.timestamp
        );
    }

    function refundSeller()
        public
        onlySeller
        inState(State.Release)
    {
        state = State.Complete;
        
        seller.transfer(3 * price); 
        // 1.
        previousBuyers.push(buyer);

        emit SellerRefunded(
            block.timestamp
        );
    }

    // 7.
    function restartContract() 
        public
        onlySeller
        // inState(State.Complete)
        payable
    {
        if (state == State.Closed || state == State.Complete) {
            require((2 * price) == msg.value, "Value has to be equal to what started the contract.");

            state = State.Sale;
            
            // Reset buyer to allow the same buyer again.
            buyer = payable(0);
            // This doesn't work.
            // buyer = address(0);

            emit Restarted(
                block.timestamp
            );
        }
    }

    // 1.
    function listPreviousBuyers()public view returns(address [] memory){
        return previousBuyers;
    }

    // totalPreviousBuyers
    function totalSales() public view returns(uint count) {
        return previousBuyers.length;
    }

    function end() 
        public
        onlySeller
    {
         if (state == State.Closed || state == State.Complete) {
            //  Should put End event before selfdestruct to update the frontend.
            // 8.
            emit End(
                block.timestamp
            );
            
            // state = State.End;
            selfdestruct(seller);   

            // This doesn't work.
            // emit End(
            //     block.timestamp
            // );         
        }
    }
}
```

I hope you read the code already. To help you find what it does, we will suppose a real world events. 

Say you are a car seller. You want to sell it with ETH and a smart contract used here.

First, you will have to deploy this to the Ethereum network. Then, after successful deployment, the state of the contract will be "Sale" as it is default state. There will be no buyer and only the seller(owner of the contract) will exist at this point.

![Seller](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/215trnj7whbquigxgwrv.png)

You can either wait for **a visitor** to pay to be **the buyer** or close the contract if there were any problem before that happens.

![Visitor](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7tynnbk8a8jn73w3pxdg.png)

If you could find a buyer and after his escrow payment(price * 2) with 2ETH, the state of the contract will be **Locked**. Then, you as the seller can send a car to user and wait for him to confirm he received it with **confirmReceived**. 

![Buyer](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/aif7x0k1aqd7eb5fdfke.png)

![Buyer confirmed](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/iitti1sak05crxihr9xd.png)

Then, everything was ok and the buyer can extract the rest of his 1ETH for escrow and seller can do that also with his 3ETH including 1ETH for the car he sold.

![Buyer refund](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gsticeelhyt5qglwp2ex.png)

This point, the contract did all its job well and ready for the seller to decide if he want to restart(resell another car) or end it.

![Contract Complete](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rf18d1ms8dcgf698rgse.png)

Think various situations that can happen with this contract. This will help you find the details of the code and how they works. 

**1.** We make a list of previous buyers and include it only when the seller decide to resell a contract. Other buyers (starting from the second buyer) can see the list before he decide to purchase or not.

**2.** The Enum values from Soldiity returns int values(0, 1, 2, 3, 4) when we request contract state later with `await Escrow.state()`. 

We will write a converter(humanReadableEscrowState) for it later.

**3.** We will include `notseller` modifier not to allow the seller become a buyer at the same time.

**4.** You can see events that have almost the same name for functions below. We will use it to update the frontend part without refreshing the page later and show some console messages. Include variables you want to use from the blockchain here.

**5.** We emit events at the end of the functions after the state and other variables are modified. The exception is **end** function because after `selfdestruct(seller);` events will not work.

**6.** We include the `refundBuyer`function to give option to the seller refund a buyer when the state of the contract is **Locked**. Then, it can be restarted again or closed.

**7.** If the buyer decide to restart a contract, we require him to deposit 2EH again and include the previous buyer in the previous buyers list to help other future visitors can refer to it.

So these will be enough information to help you find what the contract do. The code used here is not validated yet. So, please use it as a reference and learning purpose only.

For we already have a smart contract ready, we will write tests for it to see if it will work as we expect. This will help you also when you want to update the contract and before editing the frontend part along with it.

Verify that your smart contract compiles with **$yarn compile** ($npx hardhat compile).

## 2. Prepare the tests for it 

In the previous part, we prepared the Solidity contract code. Then, we will test each part of it to see it will work as we expect.

[Before you read on, you can refer to the documentation for test from the Openzeppelin.](https://docs.openzeppelin.com/learn/writing-automated-tests)

The code snippet used here is long so I will include explanation for them first. You can compare and refer to the frontend code we will see later with the code.

**1.** First, prepare what we will use for each test and be set at **beforeEach** for each test case below.

**2.** We deploy a contract for each test case with `beforeEach`. You can see we select only seller, firstBuyer, secondBuyer from the list of signers (accounts) given by Hardhat.

**3.** If you compare this part with event relevant code from the previous part, you can see we include code to use them here to use inside each test case.

**4.** These will test what the seller can do after he deploys the contract. You can see events and the contract state change is tested here after waiting for the function is called first with `await`. You can also see `expectRevert` from **@openzeppelin/test-helpers** are used to test the error message when revert happens.

**5.** These will test what the seller and buyer can do after a visitor becomes the first buyer. You can see 
who can call the contract with `escrow.connect` method. 

**6.** You can see the buyer can resell to the same buyer(first) or second buyer with the code below it. You can also see you should use **to.deep.equal** to compare arrays.

```js 
const { expect } = require("chai");
const { expectRevert } = require('@openzeppelin/test-helpers'); 

const humanReadableUnixTimestamp = (timestampInt) => {
  return new Date(timestampInt * 1000);
}

describe("Escrow Events and State", function() {
  
  // 1.
  let provider;
  let Escrow, escrow, seller, firstBuyer, secondBuyer; // seller is owner

  let closedEvent, 
      confirmPurchaseEvent, 
      sellerRefundBuyerEvent,
      confirmReceivedEvent, 
      sellerRefundedEvent, 
      restartedEvent,
      endEvent;

  beforeEach(async () => {
    provider = ethers.getDefaultProvider();

    Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy({ value: ethers.utils.parseEther("2.0") });  

    // 2. 
    [seller, firstBuyer, secondBuyer, _] = await ethers.getSigners();

    // 3.
    closedEvent = new Promise((resolve, reject) => {
      escrow.on('Closed', (when, event) => {
        event.removeListener();

        resolve({
          when,
        });
      });

      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60000)
    });

    confirmPurchaseEvent = new Promise((resolve, reject) => {
      escrow.on('ConfirmPurchase', (when, by, event) => {
        event.removeListener();

        resolve({
          when,
          by,
        });
      });

      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60000)
    });

    sellerRefundBuyerEvent = new Promise((resolve, reject) => {
      escrow.on('SellerRefundBuyer', (when, event) => {
        event.removeListener();

        resolve({
          when,
        });
      });

      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60000)
    });

    confirmReceivedEvent = new Promise((resolve, reject) => {
      escrow.on('ConfirmReceived', (when, by, event) => {
        event.removeListener();

        resolve({
          when,
          by,
        });
      });

      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60000)
    });

    sellerRefundedEvent = new Promise((resolve, reject) => {
      escrow.on('SellerRefunded', (when, event) => {
        event.removeListener();

        resolve({
          when,
        });
      });

      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60000)
    });

    restartedEvent = new Promise((resolve, reject) => {
      escrow.on('Restarted', (when, event) => {
        event.removeListener();

        resolve({
          when,
        });
      });

      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60000)
    });

    endEvent = new Promise((resolve, reject) => {
      escrow.on('End', (when, event) => {
        event.removeListener();

        resolve({
          when,
        });
      });

      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60000)
    });
  })

  // 4.
  it("Should set the contract state to 'Closed'.", async function () {
    expect(await escrow.seller()).to.equal(seller.address);

    expect(await escrow.totalSales()).to.equal(0); // Should be 0
    expect(await escrow.state()).to.equal(0); // Sale

    // 4.
    await escrow.close(); 

    let event = await closedEvent;
    console.log("Closed");
    console.log(humanReadableUnixTimestamp(event.when.toString()));

    expect(await escrow.state()).to.equal(3); // Closed
  });

  it("Should set the contract state to 'Closed' to 'Sale' again", async function () {
    expect(await escrow.seller()).to.equal(seller.address);

    expect(await escrow.state()).to.equal(0); // Sale

    // const beforeContractBalance = await provider.getBalance(escrow.address);
    // console.log(ethers.utils.formatEther(beforeContractBalance));
    // expect(ethers.utils.formatEther(beforeContractBalance)).to.equal(2);

    // const beforeCloseSellerBalance = await provider.getBalance(seller.address);
    // console.log(ethers.utils.formatEther(beforeCloseSellerBalance));

    await escrow.close();

    expect(await escrow.state()).to.equal(3); // Closed

    await escrow.restartContract({ value: ethers.utils.parseEther("2.0") });
    let event = await restartedEvent;
    console.log("Restarted");
    console.log(humanReadableUnixTimestamp(event.when.toString()));

    expect(await escrow.state()).to.equal(0); // Sale
  });

  it("Should allow the seller to end the contract when the state is 'Closed'", async function () {
    expect(await escrow.seller()).to.equal(seller.address);

    expect(await escrow.state()).to.equal(0); // Sale

    await escrow.close();

    expect(await escrow.state()).to.equal(3); // Closed

    // Revert with the error message "Seller shouldn't call this"
    // 4.
    await expectRevert(escrow.connect(firstBuyer).end(), "Only seller can call this.");
    await expectRevert(escrow.connect(secondBuyer).end(), "Only seller can call this.");

    // Only seller can call this.
    await escrow.end();

    let event = await endEvent;
    console.log("End");
    console.log(humanReadableUnixTimestamp(event.when.toString()));
  });

  // 5.
  it("Should set the contract state to 'Sale' to 'Locked' and refundSeller should fail and refundBuyer should work.", async function () {
    expect(await escrow.seller()).to.equal(seller.address);
    expect(await escrow.state()).to.equal(0); // Sale

    expect(await escrow.buyer()).to.equal("0x0000000000000000000000000000000000000000"); // Not set yet, default

    // Revert with the error message "Seller shouldn't call this"
    await expectRevert(escrow.confirmPurchase({ value: ethers.utils.parseEther("2.0") }), "Seller shouldn't call this");

    // How to set msg.sender for ether js?
    // Use connect method

    // 5.
    await escrow.connect(firstBuyer).confirmPurchase({ value: ethers.utils.parseEther("2.0") })

    let event = await confirmPurchaseEvent;
    console.log("ConfirmPurchase");
    console.log(humanReadableUnixTimestamp(event.when.toString()));
    expect(event.by).to.equal(firstBuyer.address);

    expect(await escrow.buyer()).to.equal(firstBuyer.address);
    expect(await escrow.state()).to.equal(1); // Locked

    // When "Locked", shouldn't allow this. Revert with the error message "revert Invalid state"
    await expectRevert(escrow.refundSeller(), "revert Invalid state");

    await escrow.refundBuyer();

    event = await sellerRefundBuyerEvent;
    console.log("SellerRefundBuyer");
    console.log(humanReadableUnixTimestamp(event.when.toString()));

    expect(await escrow.state()).to.equal(0); // Sale
    expect(await escrow.buyer()).to.equal("0x0000000000000000000000000000000000000000");
  });

  it(`
    Should set the contract state to 'Sale' -> 'Locked' -> 'Release' (First Buyer)
    and allow refundSeller -> 'Complete' and contract should increase total sales. (Seller)
  `, async function () {
    expect(await escrow.seller()).to.equal(seller.address);
    expect(await escrow.state()).to.equal(0); // Sale

    expect(await escrow.buyer()).to.equal("0x0000000000000000000000000000000000000000"); // Not set yet, default

    // Revert with the error message "Seller shouldn't call this"
    await expectRevert(escrow.confirmPurchase({ value: ethers.utils.parseEther("2.0") }), "Seller shouldn't call this");

    // How to set msg.sender for ether js?
    // Use connect method
    await escrow.connect(firstBuyer).confirmPurchase({ value: ethers.utils.parseEther("2.0") })
    
    expect(await escrow.buyer()).to.equal(firstBuyer.address);
    expect(await escrow.state()).to.equal(1); // Locked

    await escrow.connect(firstBuyer).confirmReceived();

    let event = await confirmReceivedEvent;
    console.log("ConfirmReceived");
    console.log(humanReadableUnixTimestamp(event.when.toString()));
    expect(await event.by).to.equal(firstBuyer.address);
    
    expect(await escrow.state()).to.equal(2); // Released

    await escrow.refundSeller();

    event = await sellerRefundedEvent;
    console.log("SellerRefunded");
    console.log(humanReadableUnixTimestamp(event.when.toString()));
    
    expect(await escrow.state()).to.equal(4); // Complete
    expect(await escrow.totalSales()).to.equal(1); // Complete
  });

  const firstPurchase = async () => {
    expect(await escrow.seller()).to.equal(seller.address);
    expect(await escrow.state()).to.equal(0); // Sale

    expect(await escrow.buyer()).to.equal("0x0000000000000000000000000000000000000000"); // Not set yet, default

    // Revert with the error message "Seller shouldn't call this"
    await expectRevert(escrow.confirmPurchase({ value: ethers.utils.parseEther("2.0") }), "Seller shouldn't call this");

    // How to set msg.sender for ether js?
    // Use connect method
    await escrow.connect(firstBuyer).confirmPurchase({ value: ethers.utils.parseEther("2.0") })

    expect(await escrow.buyer()).to.equal(firstBuyer.address);
    expect(await escrow.state()).to.equal(1); // Locked

    await escrow.connect(firstBuyer).confirmReceived();

    expect(await escrow.state()).to.equal(2); // Released

    await escrow.refundSeller();

    expect(await escrow.state()).to.equal(4); // Complete
    expect(await escrow.totalSales()).to.equal(1); // Complete
  }

  // 6.
  it(`
    (First Buyer)
    Should set the contract state to 'Sale' -> 'Locked' -> 'Release' 
    (Seller)
    and allow refundSeller -> 'Complete' and contract should increase total sales.
    Then, the seller can restart the contract.
  `, async function () {

    await firstPurchase();

    await escrow.restartContract({ value: ethers.utils.parseEther("2.0") });

    expect(await escrow.state()).to.equal(0); // Sale again
  });

  it(`
    (First Buyer)
    Should set the contract state to 'Sale' -> 'Locked' -> 'Release' 
    (Seller)
    and allow refundSeller -> 'Complete' and contract should increase total sales.
    Then, the seller can end the contract.
  `, async function () {

    await firstPurchase();

    await escrow.restartContract({ value: ethers.utils.parseEther("2.0") });

    await escrow.end();
  });

  it(`
    (First Buyer)
    Should set the contract state to 'Sale' -> 'Locked' -> 'Release' 
    (Seller)
    and allow refundSeller -> 'Complete' and contract should increase total sales.
    Then, the seller can restart the contract.
    (First Buyer)
    Then, first buyer can rebuy
  `, async function () {

    await firstPurchase();

    await escrow.restartContract({ value: ethers.utils.parseEther("2.0") });

    // 

    expect(await escrow.seller()).to.equal(seller.address);
    expect(await escrow.state()).to.equal(0); // Sale

    expect(await escrow.buyer()).to.equal("0x0000000000000000000000000000000000000000"); // Not set yet, default

    // Revert with the error message "Seller shouldn't call this"
    await expectRevert(escrow.confirmPurchase({ value: ethers.utils.parseEther("2.0") }), "Seller shouldn't call this");

    // How to set msg.sender for ether js?
    // Use connect method
    await escrow.connect(firstBuyer).confirmPurchase({ value: ethers.utils.parseEther("2.0") })

    expect(await escrow.buyer()).to.equal(firstBuyer.address);
    expect(await escrow.state()).to.equal(1); // Locked

    await escrow.connect(firstBuyer).confirmReceived();

    expect(await escrow.state()).to.equal(2); // Released

    await escrow.refundSeller();

    expect(await escrow.state()).to.equal(4); // Complete
    expect(await escrow.totalSales()).to.equal(2); // Complete
  });

  it(`
    (Second Buyer)
    Should set the contract state to 'Sale' -> 'Locked' -> 'Release' 
    (Seller)
    and allow refundSeller -> 'Complete' and contract should increase total sales.
    Then, the seller can restart the contract
  `, async function () {

    await firstPurchase();
    
    await escrow.restartContract({ value: ethers.utils.parseEther("2.0") });

    // Second Buyer

    expect(await escrow.state()).to.equal(0); // Sale again
    // Buyer should be reset;
    expect(await escrow.buyer()).to.equal("0x0000000000000000000000000000000000000000");

    // Repeat the almost same code for the second buyer.
    // expect(await escrow.buyer()).to.equal(firstBuyer.address); // Yet, First Buyer 

    // Revert with the error message "Seller shouldn't call this"
    await expectRevert(escrow.confirmPurchase({ value: ethers.utils.parseEther("2.0") }), "Seller shouldn't call this");

    await escrow.connect(secondBuyer).confirmPurchase({ value: ethers.utils.parseEther("2.0") })

    // New buyer
    expect(await escrow.buyer()).to.equal(secondBuyer.address);
    expect(await escrow.state()).to.equal(1); // Locked

    await escrow.connect(secondBuyer).confirmReceived();

    expect(await escrow.state()).to.equal(2); // Released

    await escrow.refundSeller();

    expect(await escrow.state()).to.equal(4); // Complete

    expect(await escrow.totalSales()).to.equal(2); // One more purchase

    await escrow.restartContract({ value: ethers.utils.parseEther("2.0") });

    // 6.
    // Without deep, it fails here.
    expect(await escrow.listPreviousBuyers()).to.deep.equal([firstBuyer.address, secondBuyer.address])
  });
});
```

There are a lot of code here but you can take only what you want to use later.

Test the code with `$yarn test` and you will see somewhat similar to this and passing tests. 

```md
Creating Typechain artifacts in directory typechain for target ethers-v5
Successfully generated Typechain artifacts!
```

[We verified the code for test](https://github.com/steadylearner/blockchain/blob/main/real/eth/test/escrow-test.js) is working as we expected in this part. 

So the backend part of our dapp is almost ready. Before we handle the frontend part, we need to set up Metamask to test it with accounts from your local Hardhat.

## 3. Set up Metamask with Hardhat

To use the Solidity code we read before with the frontend code , we need to run local blockchain first with `$yarn serve` ($npx hardhat node) command. 

It will show a few free accounts similar to this with free 10000ETH for each of them.

```md
$npx hardhat node
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2: 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc (10000 ETH)
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

Then, deploy your contract at another console with `$yarn deploy`($npx hardhat run scripts/deploy.js --network localhost) command.

Launch your Metamask plugin at your browser. 

Then, include at least three of the free account above to it. 
 
![Include account](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lw469y8fa6byijq7pewf.png)

Then, set their name to seller, first buyer and second buyer. 

Update detail

![Detail](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z7r14jqowldrvfntsom7.png)

Configuration

![Configuration](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/k5ef06yto15pt1np6e2n.png)

Update the Metamask account name

![Name](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/89j66zshgyc2mslakiqt.png)


We are just doing the same thing we have done in the previous part for test with Metamask to help you use frontend with it later.

```js
[seller, firstBuyer, secondBuyer, _] = await ethers.getSigners();
```

Hope you could include them without any issue. 

Later, if you find a nonce issue while testing this contract with frontend various times, you can redefine your account and test again.

Configuration/advanced/redefine

![Redefine](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3y7rx1rae1i4xvvzzikh.png)

## 4. Write the frontend code with React and ethers.js

We prepared everything to write the frontend part of our smart contract code. If you already read it at [GitHub](https://github.com/steadylearner/blockchain/tree/main/real/eth/src), you will find the main logic is at [App.js](https://github.com/steadylearner/blockchain/blob/main/real/eth/src/App.js) file.

You can see some parts are almost identical to the test file we read before. Others are for CSS and modules to help show the datas used here better.
 
So, I will explain only the most important partts.

**1.** We allow the seller, a visitor, the buyer to use the functions we defined at the first part of this post according the state of the contract.

**2.** Then, we update the frontend app state inside its blockchain event listeners with contract.on(<eventname>) and their callback functions. 

```js
import { useEffect, useState, createRef } from 'react';
import { Contract, ethers } from 'ethers'

import moment from "moment";

import { Container, Dimmer, Loader, Grid, Sticky, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import Escrow from './artifacts/contracts/Escrow.sol/Escrow.json'

import {
  humanReadableEscrowState,
  humanReadableUnixTimestamp,
} from "./formatters";

import ContractDetails from "./components/ContractDetails";
import Balance from "./components/Balance";

import Seller from "./components/users/Seller";
import Visitor from "./components/users/Visitor";
import Buyer from "./components/users/Buyer";
import PreviousBuyers from "./components/PreviousBuyers";

// localhost
const escrowAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

// Move this to context?
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(escrowAddress, Escrow.abi, provider);

// Show metamask for users to decide if they will pay or not
async function requestAccount() {
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    console.log("error");
    console.error(error);

    alert("Login to Metamask first");
  }
}

function App() {
  const [contractEnd, setContractEnd] = useState(true);

  const [escrow, setEscrow] = useState({
    state: null,
    balance: 0,
    price: 1, // 1 ETH by default
    sales: 0,
    previousBuyers: [],
  });

  // Use object instead?
  const [seller, setSeller] = useState();
  const [sellerBalance, setSellerBalance] = useState();

  // Use object instead?
  const [buyer, setBuyer] = useState();
  const [buyerBalance, setBuyerBalance] = useState();

  // Use object instead?
  const [user, setUser] = useState();
  const [userBalance, setUserBalance] = useState();

  const [role, setRole] = useState();

  useEffect(() => {
    async function fetchData() {

      try {
        // 2.
        // Contract event handlers

        contract.on("Closed", async (when, event) => {
          event.removeListener(); // Solve memory leak with this.

          const contractState = await contract.state();
          // const contractState = await contract.showState();

          const contractBalance = await provider.getBalance(contract.address);
          const previousBuyers = await contract.listPreviousBuyers();

          setEscrow({
            ...escrow,
            state: humanReadableEscrowState(contractState), // Easier
            // state: await contractState.toString(),
            balance: ethers.utils.formatEther(contractBalance.toString()),
            previousBuyers,
          })

          const contractSeller = await contract.seller();
          const contractSellerBalance = await provider.getBalance(contractSeller);
          setSellerBalance(ethers.utils.formatEther(contractSellerBalance));

          // console.log("when");
          // console.log(when);
          // console.log(humanReadableUnixTimestamp(when));
          console.log("Event - Closed");
          console.log(`State - ${humanReadableEscrowState(contractState)}`);
          console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`)
        });

        contract.on("ConfirmPurchase", async (when, by, event) => {
          event.removeListener(); // Solve memory leak with this.

          const contractState = await contract.state();
          const contractBalance = await provider.getBalance(contract.address);
          const previousBuyers = await contract.listPreviousBuyers();

          setEscrow({
            ...escrow,
            state: humanReadableEscrowState(contractState),
            balance: ethers.utils.formatEther(contractBalance.toString()),
            previousBuyers,
          })

          setBuyer(by);
          const contractBuyerBalance = await provider.getBalance(by);
          setBuyerBalance(ethers.utils.formatEther(contractBuyerBalance));

          setRole("buyer");
          console.log("This visitor became the buyer of this contract");

          // console.log("when");
          // console.log(when);
          // console.log(humanReadableUnixTimestamp(when));
          console.log("Event - ConfirmPurchase");
          console.log(`By - ${by}`);
          console.log(`State - ${humanReadableEscrowState(contractState)}`);
          console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`)
        });

        contract.on("SellerRefundBuyer", async (when, event) => {
          event.removeListener(); // Solve memory leak with this.

          const contractState = await contract.state();
          // const contractBalance = await provider.getBalance(contract.address);
          // const previousBuyers = await contract.listPreviousBuyers();

          setEscrow({
            ...escrow,
            state: humanReadableEscrowState(contractState),
            // balance: ethers.utils.formatEther(contractBalance.toString()),
            // previousBuyers,
          })

          console.log("This seller refunded the buyer of this contract");

          // console.log("when");
          // console.log(when);
          // console.log(humanReadableUnixTimestamp(when));
          console.log("Event - SellerRefundBuyer");
          console.log(`State - ${humanReadableEscrowState(contractState)}`);
          console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`)
        });

        contract.on("ConfirmReceived", async (when, by, event) => {
          event.removeListener(); // Solve memory leak with this.

          const contractState = await contract.state();
          const contractBalance = await provider.getBalance(contract.address);
          const previousBuyers = await contract.listPreviousBuyers();
          console.log(previousBuyers);

          setEscrow({
            ...escrow,
            state: humanReadableEscrowState(contractState),
            balance: ethers.utils.formatEther(contractBalance.toString()),
            previousBuyers,
          })

          setBuyer(by);
          const contractBuyerBalance = await provider.getBalance(by);
          setBuyerBalance(ethers.utils.formatEther(contractBuyerBalance));

          console.log("Event - ConfirmReceived");
          console.log(`By - ${by}`);
          console.log(`State - ${humanReadableEscrowState(contractState)}`);
          console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`)
        });

        contract.on("SellerRefunded", async (when, event) => {
          event.removeListener(); // Solve memory leak with this.

          const contractState = await contract.state();
          const contractBalance = await provider.getBalance(contract.address);

          const previousBuyers = await contract.listPreviousBuyers();
          console.log(previousBuyers);

          setEscrow({
            ...escrow,
            state: humanReadableEscrowState(contractState),
            balance: ethers.utils.formatEther(contractBalance.toString()),
            previousBuyers,
          })

          const contractSeller = await contract.seller();
          const contractSellerBalance = await provider.getBalance(contractSeller);
          setSellerBalance(ethers.utils.formatEther(contractSellerBalance));

          console.log("Event - SellerRefunded");
          console.log(`State - ${humanReadableEscrowState(contractState)}`);
          console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`)
        });

        contract.on("Restarted", async (when, event) => {
          event.removeListener();

          const contractState = await contract.state();
          const contractBalance = await provider.getBalance(contract.address);
          const previousBuyers = await contract.listPreviousBuyers();

          setEscrow({
            ...escrow,
            state: humanReadableEscrowState(contractState),
            balance: ethers.utils.formatEther(contractBalance.toString()),
            previousBuyers,
          })
          const contractSeller = await contract.seller();
          const contractSellerBalance = await provider.getBalance(contractSeller);
          setSellerBalance(ethers.utils.formatEther(contractSellerBalance));

          setBuyer();
          setBuyerBalance();

          console.log("Event - Restarted");
          console.log(`State - ${humanReadableEscrowState(contractState)}`);
          console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`);
        });

        contract.on("End", async (_when, _event) => {
          // This doesn't work
          // event.removeListener();

          // console.log("Event - End");
          // console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`)
          setContractEnd(false);
        });

        // Contract State
        const contractState = await contract.state()
        const contractBalance = await provider.getBalance(contract.address);
        const contractPrice = await contract.price()
        // const contractSales = await contract.totalSales();
        const contractPreviousBuyers = await contract.listPreviousBuyers();
        // console.log(contractPreviousBuyers);

        setEscrow({
          state: humanReadableEscrowState(contractState),
          balance: ethers.utils.formatEther(contractBalance.toString()),
          price: ethers.utils.formatEther(contractPrice.toString()),
          // sales: contractSales.toString(),
          previousBuyers: contractPreviousBuyers,
        })

        const contractSeller = await contract.seller();
        setSeller(contractSeller);
        const contractSellerBalance = await provider.getBalance(contractSeller);
        setSellerBalance(ethers.utils.formatEther(contractSellerBalance));

        const contractBuyer = await contract.buyer()
        setBuyer(contractBuyer);
        const contractBuyerBalance = await provider.getBalance(contractBuyer);
        setBuyerBalance(ethers.utils.formatEther(contractBuyerBalance)); // Should make this part work again.

        const signer = provider.getSigner(); // user

        const contractUser = await signer.getAddress();
        setUser(contractUser);
        const contractUserBalance = await provider.getBalance(contractUser);
        setUserBalance(ethers.utils.formatEther(contractUserBalance));

        if (contractUser === contractSeller) {
          setRole("seller");
        } else if (contractUser === contractBuyer) {
          setRole("buyer");
        } else {
          setRole("visitor");
        }
      } catch (error) {
        console.log("error");
        console.error(error);
      }
    }

    fetchData();
  }, []);

  // 1. Event functions
  async function close() {
    if (!escrow.state || escrow.state !== "Sale") {
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;

      // console.log("signer");
      // console.log(signer);

      const forClose = new ethers.Contract(escrowAddress, Escrow.abi, signer);

      const transaction = await forClose.close();
      await transaction.wait();
    }
  }

  // Visitor
  async function purchase() {
    if (!escrow.state || escrow.state !== "Sale") {
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;
      const forPurchase = new ethers.Contract(escrowAddress, Escrow.abi, signer); 

      const transaction = await forPurchase.confirmPurchase({ value: ethers.utils.parseEther("2.0") });
      await transaction.wait();
    }
  }

  async function receive() {
    if (!escrow.state || escrow.state !== "Locked") {
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;
      const contract = new ethers.Contract(escrowAddress, Escrow.abi, signer);

      const transaction = await contract.confirmReceived();
      await transaction.wait();
    }
  }

  async function refundBuyer() {
    if (!escrow.state || escrow.state !== "Locked") return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;

      const forRefund = new ethers.Contract(escrowAddress, Escrow.abi, signer);
      const transaction = await forRefund.refundBuyer();
      await transaction.wait();
    }
  }

  async function refundSeller() {
    if (!escrow.state || escrow.state !== "Release") return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;

      const forRefund = new ethers.Contract(escrowAddress, Escrow.abi, signer);
      const transaction = await forRefund.refundSeller();
      await transaction.wait();

      // call currentEscrowState here and it will show you inactive at the screen
      // fetchGreeting()
    }
  }

  async function restart() {
    if (!escrow.state) return
    // if (!escrow.state || escrow.state !== "Closed" || escrow.state !== "Complete" ) return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;

      const forRestart = new ethers.Contract(escrowAddress, Escrow.abi, signer);
      const transaction = await forRestart.restartContract({ value: ethers.utils.parseEther("2.0") });
      await transaction.wait();
    }
  }

  async function end() {
    if (!escrow.state) return
    // if (!escrow.state || escrow.state !== "Closed" || escrow.state !== "Complete") return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;

      const forEnd = new ethers.Contract(escrowAddress, Escrow.abi, signer);
      const transaction = await forEnd.end();
      await transaction.wait();
    }
  }

  // End event
  if (!contractEnd) {
    return null;
  }

  if (!escrow.state) {
    return null;
  }

  // const contextRef = createRef();

  let balance;
  if (role === "seller") {
    balance = sellerBalance
  } else if (role === "buyer") {
    balance = buyerBalance;
  } else {
    balance = userBalance;
  }

  return (
    <div>
      <Sticky >
        <Balance
          balance={balance}
        // setAccountAddress={setAccountAddress} 
        />
      </Sticky>
      <div style={{
        // borderTop: "1px solid black",
        margin: "0 auto",
        display: "flex",
        flexFlow: "column",
        alignItems: "center",

        background: "#efefef",
        minHeight: "100vh",
      }}>
        <ContractDetails
          address={contract.address}
          sales={escrow.previousBuyers.length}
          escrowState={escrow.state}
          price={escrow.price}
          balance={escrow.balance}
        // lastEdited={lastEdited}
        />

        <br />

        {escrow.previousBuyers.length > 0 && <div style={{
          width: "28rem",
          marginBottom: "1.5rem",

          border: "1px solid black",
          borderRadius: "0.5rem",
          padding: "0.5rem 1rem 1rem 1rem",

          background: "white",
        }} ><PreviousBuyers previousBuyers={escrow.previousBuyers} /></div>}

        {role && <div style={{
          width: "28rem",
          marginBottom: "1.5rem",

          border: "1px solid black",
          borderRadius: "0.5rem",
          padding: "0.5rem 1rem 1rem 1rem",

          background: "white",
        }} >
          {role === "seller" && <Seller
            address={seller}
            buyer={buyer}

            escrowState={escrow.state}
            close={close}

            refundBuyer={refundBuyer}
            refundSeller={refundSeller}

            restart={restart}
            end={end}
          />}

          {role === "visitor" && <Visitor
            address={user}
            seller={seller}
            // balance={userBalance}

            escrowState={escrow.state}

            purchase={purchase}
          />}

          {role === "buyer" && <Buyer
            address={buyer}
            seller={seller}

            escrowState={escrow.state}

            receive={receive}
          />}
        </div>}
      </div>
    </div>
  );
}

export default App;
```

You can test the code used at your browser with 

```
$yarn start
```

Then, it will show somewhat similar to the images you saw at the first part.

Test each button and situations as the seller, a visitor, first buyer, second buyer etc. You will see the page is updated for each request for blockchain with functions we defined before.

Test it with first buyer and second buyer and you can see the previous buyer list appears at your browser and total sales became 2.

![End result](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ywaby85zxq2839is5yv7.png)

Hope you could make it and earned 2ETH as a seller like the image above.

You can also balances are modified along with them.

![balance result](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ten6iyqok909pzrsmcni.png)

If you have enough time or have a paying client, you can attempt to update the frontend part with React Context or Redux or whatever and extract CSS with [baseweb](https://baseweb.design/).

## 4. Conclusion

In this post, we learnt how to write a full stack dapp with React, Hardhat and ethers js.

If you followed this post well, the commands I gave you at the beginning of this post will be enough to test your dapp locally.

Update the smart contract that interests you and make your own projects.

It was a decent learning opportunity to prepare and write this blog post.

If you liked the post, please share it with others. I am plan to share more blockchain relevant stuffs. I am interested in ETH and POLKADOT.

If you need to hire a developer, you can contact me also. I can write a full stack app.

Thanks.