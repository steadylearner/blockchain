// https://docs.openzeppelin.com/learn/writing-automated-tests
// https://bscscan.com/address/0xdb78fcbb4f1693fdbf7a85e970946e4ce466e2a9#contracts

// ethers is global variable here.

const { expect } = require("chai");
const { expectRevert } = require('@openzeppelin/test-helpers');

// const python = require('python-bridge');
// const py = python(); // return value

// async function bigNumberToHex(bigNumber) {
//   try {
//     const hexFromBigNumber = await py`hex(${bigNumber})`;
//     return hexFromBigNumber;

//   } catch (error) {
//     console.log("error");
//     console.error(error);
//   } finally {
//     end();
//   }
// }
// pyscript();

// https://www.mobilefish.com/services/big_number/big_number.php

// steadylearner@AirdeStylearner eth % python3
// >>> hex(1000000000000000000000000)
// '0xd3c21bcecceda1000000'
//   >>> hex(1000000000000000000000000000000)
// '0xc9f2c9cd04674edea40000000'
//     >>> hex(1000000000000000000000000000000000)
// '0x314dc6448d9338c15b0a00000000'
//   >>> hex(1000000000000000000000000)
// '0xd3c21bcecceda1000000'
//   >>> 10 ** 26
// 100000000000000000000000000
//   >>> hex(_)
// '0x52b7d2dcc80cd2e4000000'
//   >>>

// uint256 totalSupply = 10 ** (8 + 18);
// uint256 preMine = 2 * (10 ** (7 + 18));
// uint airdropSize = 10 ** (6 + 18);

const totalSupplyBigNumberHex = ethers.BigNumber.from("0x52b7d2dcc80cd2e4000000");
const preMineBigNumberHex = ethers.BigNumber.from("0x108b2a2c28029094000000");
const airDropSize = "1000000000000000000000000"; // "0xD3C21BCECCEDA1000000"

const zero = 0;

// Find big number to hex function.
// Include disapproval.
describe("SCAMToken state and transactions", function() {
  let provider;
  let SCAMToken, scamToken, publisher, firstComer, secondComer; // seller is owner

  let disapprovalEvent; 
    // confirmPurchaseEvent, 
    // endEvent;

  beforeEach(async () => {
    provider = ethers.getDefaultProvider();

    SCAMToken = await ethers.getContractFactory("SCAMToken");
    scamToken = await SCAMToken.deploy();

    [publisher, firstComer, secondComer, _] = await ethers.getSigners();
    
    disapprovalEvent = new Promise((resolve, reject) => {
      scamToken.on('Disapproval', (tokenOwner, spender, event) => {
        event.removeListener();

        resolve({
          tokenOwner,
          spender,
        });
      });

      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60000)
    });
  });

  it("Should test 'showTotalSupply' and other default values.", async function () {
    expect(await scamToken.symbol()).to.equal("SCAM");
    expect(await scamToken.name()).to.equal("Steadylearner Created Alternative Money");
    expect(await scamToken.decimals()).to.equal(18);

    const totalSupply = await scamToken.showTotalSupply();
    // console.log(ethers.BigNumber.from(totalSupply));
    expect(totalSupply).to.equal(totalSupplyBigNumberHex);

    // What publisher takes
    const preMine = await scamToken.balanceOf(publisher.address);
    expect(preMine).to.equal(preMineBigNumberHex);
  });

  it("Should test 'airdropTokens' and the contract and receiver balance change.", async function () {
    // If the caller is not the publisher, the airdropTokens should revert.
    await expectRevert(scamToken.connect(firstComer).airdropTokens(firstComer.address), "Only publisher can call this.");
    await expectRevert(scamToken.connect(secondComer).airdropTokens(secondComer.address), "Only publisher can call this.");

    // From contract to a user
    await scamToken.airdropTokens(firstComer.address);
    // Include contract balance also here.
    const firstComerBalance = await scamToken.balanceOf(firstComer.address);
    expect(firstComerBalance.toString()).to.equal(airDropSize);
  });

  it("Should test 'transfer' and the publisher.", async function () {
    // From a user to another user
    const amountToTransfer = 1000000;
    await scamToken.transfer(firstComer.address, amountToTransfer);
    let firstComerBalance = await scamToken.balanceOf(firstComer.address);
    expect(firstComerBalance.toString()).to.equal(amountToTransfer.toString());

    // https://hardhat.org/guides/waffle-testing.html#testing-from-a-different-account
    // const forClose = new ethers.Contract(escrowAddress, Escrow.abi, signer);

    // const transaction = await forClose.close();
    // await transaction.wait();

    // These should be tested at the frontend with metamask.
    // You don't sign a request with a signature, you sign a transaction. You cannot generate generic signatures to be associated to transactions later on, you need to have access the complete object you want to sign 
    // - the raw transaction in your case - before the process works correctly.
    // Error: VoidSigner cannot sign transactions
    // await scamToken.connect(firstComer.address).transfer(secondComer.address, 1);
    // firstComerBalance = await scamToken.balanceOf(firstComer.address);
    // expect(firstComerBalance.toString()).to.equal("999999");
    // const secondComerBalance = await scamToken.balanceOf(secondComer.address);
    // expect(secondComerBalance.toString()).to.equal("1");
      
    // So much work, I will only include one.
  });

  it("Should test 'approve' and 'allowance'.", async function () {
    const amountForApproval = 1000000;
    await scamToken.approve(firstComer.address, amountForApproval);
    const allowance = await scamToken.allowance(publisher.address, firstComer.address);
    expect(allowance.toString()).to.equal(amountForApproval.toString());
  });

  it("Should test 'approve', 'disapprove' and 'allowance'.", async function () {
    const amountForApproval = 1000000;
    await scamToken.approve(firstComer.address, amountForApproval);
    let allowance = await scamToken.allowance(publisher.address, firstComer.address);
    expect(allowance.toString()).to.equal(amountForApproval.toString());

    await scamToken.disapprove(firstComer.address);
    await disapprovalEvent; // Use it to wait for the disapproval happen first

    allowance = await scamToken.allowance(publisher.address, firstComer.address);
    expect(allowance).to.equal(zero);
  });

  it("Should test 'approve', 'allowance' and 'transferFrom'.", async function () {
    const amountForApproval = 1000000;
    await scamToken.approve(firstComer.address, amountForApproval);
    const allowance = await scamToken.allowance(publisher.address, firstComer.address);
    expect(allowance.toString()).to.equal(amountForApproval.toString());

    // await scamToken.transferFrom(publisher.address, secondComer.address, amountForApproval, { from: firstComer.address });
    await scamToken.connect(firstComer).transferFrom(publisher.address, secondComer.address, amountForApproval);
  
    const secondComerBalance = await scamToken.balanceOf(secondComer.address);
    expect(secondComerBalance.toString()).to.equal(amountForApproval.toString());
  });

  it("Should test 'fallback' and be reverted with the error message.", async function () {
    await expectRevert(scamToken.fallback(), "No donation.");
  });
});
