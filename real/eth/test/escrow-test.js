// https://docs.openzeppelin.com/learn/writing-automated-tests

const { expect } = require("chai");
const { expectRevert } = require('@openzeppelin/test-helpers');

// // Include balance check. (Do this and write a blog post with updated frontend.)
// // Then, event later.
describe("Escrow State", function() {
  let provider;
  let Escrow, escrow, seller, firstBuyer, secondBuyer; // seller is owner

  beforeEach(async () => {
    provider = ethers.getDefaultProvider();

    Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy({ value: ethers.utils.parseEther("2.0") });  

    [seller, firstBuyer, secondBuyer, _] = await ethers.getSigners();

    // console.log(escrow.address);
    // console.log(escrow.deployTransaction);
  })

  // Seller

  it("Should set the contract state to 'Closed'.", async function () {
    expect(await escrow.seller()).to.equal(seller.address);

    expect(await escrow.total_sales()).to.equal(0); // Should be 0
    expect(await escrow.state()).to.equal(0); // Sale

    // const beforeContractBalance = await provider.getBalance(escrow.address);
    // console.log(ethers.utils.formatEther(beforeContractBalance));
    // // expect(ethers.utils.formatEther(beforeContractBalance)).to.equal(2);

    // const beforeCloseSellerBalance = await provider.getBalance(seller.address);
    // console.log(ethers.utils.formatEther(beforeCloseSellerBalance));

    await escrow.close();

    // Why they are not modified here?
    
    // const contractBalance = await provider.getBalance(escrow.address);
    // const sellerBalance = await provider.getBalance(seller.address);

    // console.log(ethers.utils.formatEther(contractBalance));
    // console.log(ethers.utils.formatEther(sellerBalance));

    // expect(contractBalance).to.equal(0);
    // expect(sellerBalance).gt(beforeCloseSellerBalance);
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

    expect(await escrow.state()).to.equal(0); // Sale
  });

  it("Should allow the seller to end the contract when the state is 'Closed'", async function () {
    expect(await escrow.seller()).to.equal(seller.address);

    expect(await escrow.state()).to.equal(0); // Sale

    // const beforeContractBalance = await provider.getBalance(escrow.address);
    // console.log(ethers.utils.formatEther(beforeContractBalance));
    // expect(ethers.utils.formatEther(beforeContractBalance)).to.equal(2);

    // const beforeCloseSellerBalance = await provider.getBalance(seller.address);
    // console.log(ethers.utils.formatEther(beforeCloseSellerBalance));

    await escrow.close();

    expect(await escrow.state()).to.equal(3); // Closed

    // Revert with the error message "Seller shouldn't call this"
    await expectRevert(escrow.connect(firstBuyer).end(), "Only seller can call this.");
    await expectRevert(escrow.connect(secondBuyer).end(), "Only seller can call this.");

    // Only seller can call this.
    await escrow.end();
  });

  // A visitor who first sees the contract to firstBuyer

  it("Should set the contract state to 'Sale' to 'Locked' and refundSeller should fail.", async function () {
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

    // When "Locked", shouldn't allow this. Revert with the error message "revert Invalid state"
    await expectRevert(escrow.refundSeller(), "revert Invalid state");
  });

  it(`
    Should set the contract state to 'Sale' -> 'Locked' -> 'Release' (Fisrt Buyer)
    and allow refundSeller -> 'Complete' and contract should increase total_sales. (Seller)
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

    expect(await escrow.state()).to.equal(2); // Released

    await escrow.refundSeller();
    
    expect(await escrow.state()).to.equal(4); // Complete
    expect(await escrow.total_sales()).to.equal(1); // Complete
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
    expect(await escrow.total_sales()).to.equal(1); // Complete
  }

  it(`
    (First Buyer)
    Should set the contract state to 'Sale' -> 'Locked' -> 'Release' 
    (Seller)
    and allow refundSeller -> 'Complete' and contract should increase total_sales.
    Then, the seller can restart the contract.
    (First Buyer)
    Then, first buyer can rebuy
  `, async function () {

    await firstPurchase();

    await escrow.restartContract({ value: ethers.utils.parseEther("2.0") });

    expect(await escrow.state()).to.equal(0); // Sale again
    
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
    expect(await escrow.total_sales()).to.equal(2); // Complete
  });

  it(`
    (First Buyer)
    Should set the contract state to 'Sale' -> 'Locked' -> 'Release' 
    (Seller)
    and allow refundSeller -> 'Complete' and contract should increase total_sales.
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
    and allow refundSeller -> 'Complete' and contract should increase total_sales.
    Then, the seller can end the contract.
  `, async function () {

    await firstPurchase();
    
    await escrow.restartContract({ value: ethers.utils.parseEther("2.0") });

    await escrow.end();
  });

  it(`
    (Second Buyer)
    Should set the contract state to 'Sale' -> 'Locked' -> 'Release' 
    (Seller)
    and allow refundSeller -> 'Complete' and contract should increase total_sales.
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

    expect(await escrow.total_sales()).to.equal(2); // One more purchase

    await escrow.restartContract({ value: ethers.utils.parseEther("2.0") });
  });
});
