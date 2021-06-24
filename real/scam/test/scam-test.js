// // ethers is global variable here.

// const { expect } = require("chai");
// const { expectRevert } = require('@openzeppelin/test-helpers');

// // 1.
// const totalSupplyBigNumberHex = ethers.BigNumber.from("0x52b7d2dcc80cd2e4000000");
// const preMineBigNumberHex = ethers.BigNumber.from("0x108b2a2c28029094000000");
// const airDropSize = "1000000000000000000000000"; // "0xD3C21BCECCEDA1000000"

// describe("SCAMToken state and transactions", function () {
//   let SCAMToken, scamToken, owner, firstComer, secondComer; // seller is owner

//   // 2.
//   beforeEach(async () => {
//     provider = ethers.getDefaultProvider();

//     SCAMToken = await ethers.getContractFactory("SCAM_Token");
//     scamToken = await SCAMToken.deploy();

//     [owner, firstComer, secondComer, _] = await ethers.getSigners();
//   });

//   it("Should test 'totalSupply' and other default values.", async function () {
//     expect(await scamToken.symbol()).to.equal("SCAM");
//     expect(await scamToken.name()).to.equal("Safe Crypto And Money");
//     expect(await scamToken.decimals()).to.equal(18);

//     // This is where hex value requried
//     const totalSupply = await scamToken.totalSupply();
//     expect(totalSupply).to.equal(totalSupplyBigNumberHex);

//     // What owner takes
//     const preMine = await scamToken.balanceOf(owner.address);
//     expect(preMine).to.equal(preMineBigNumberHex);
//   });

//   it("Should test 'airdropTokens' and the contract and receiver balance change.", async function () {
//     // If the caller is not the publisher, the airdropTokens should revert.
//     await expectRevert.unspecified(scamToken.connect(firstComer).airdropTokens(firstComer.address));
//     await expectRevert.unspecified(scamToken.connect(secondComer).airdropTokens(secondComer.address));

//     // From contract to a user
//     await scamToken.airdropTokens(firstComer.address);
//     // Include contract balance also here.
//     const firstComerBalance = await scamToken.balanceOf(firstComer.address);
//     expect(firstComerBalance.toString()).to.equal(airDropSize);
//   });

//   it("Should test 'transfer' from the owner to firstComer.", async function () {
//     // From a user to another user
//     const amountToTransfer = 1000000;
//     await scamToken.transfer(firstComer.address, amountToTransfer);

//     let firstComerBalance = await scamToken.balanceOf(firstComer.address);
//     expect(firstComerBalance.toString()).to.equal(amountToTransfer.toString());
//   });

//   it("Should test 'approve' and 'allowance' from the owner to firstComer.", async function () {
//     const amountForApproval = 1000000;
//     await scamToken.approve(firstComer.address, amountForApproval);

//     const allowance = await scamToken.allowance(owner.address, firstComer.address);
//     expect(allowance.toString()).to.equal(amountForApproval.toString());
//   });

//   it("Should test 'approve', 'allowance' and 'transferFrom'.", async function () {
//     const amountForApproval = 1000000;
//     await scamToken.approve(firstComer.address, amountForApproval);
//     const allowance = await scamToken.allowance(owner.address, firstComer.address);
//     expect(allowance.toString()).to.equal(amountForApproval.toString());

//     await scamToken.connect(firstComer).transferFrom(owner.address, secondComer.address, amountForApproval);

//     const secondComerBalance = await scamToken.balanceOf(secondComer.address);
//     expect(secondComerBalance.toString()).to.equal(amountForApproval.toString());
//   });

//   // The code is almost the same as above
//   // 5.
//   it("Should test 'releaseBNB' and it shouldn't affect the balance of other users (not owners)", async function () {
//     const amountForApproval = 1000000;
//     await scamToken.approve(firstComer.address, amountForApproval);
//     const allowance = await scamToken.allowance(owner.address, firstComer.address);
//     expect(allowance.toString()).to.equal(amountForApproval.toString());

//     await scamToken.connect(firstComer).transferFrom(owner.address, secondComer.address, amountForApproval);

//     const secondComerBalance = await scamToken.balanceOf(secondComer.address);
//     expect(secondComerBalance.toString()).to.equal(amountForApproval.toString());

//     await scamToken.releaseBNB();
//     expect(secondComerBalance.toString()).to.equal(amountForApproval.toString());
//   });
// });

// // const python = require('python-bridge');
// // const py = python(); // return value

// // async function bigNumberToHex(bigNumber) {
// //   try {
// //     const hexFromBigNumber = await py`hex(${bigNumber})`;
// //     return hexFromBigNumber;

// //   } catch (error) {
// //     console.log("error");
// //     console.error(error);
// //   } finally {
// //     end();
// //   }
// // }
// // pyscript();

// // https://www.mobilefish.com/services/big_number/big_number.php

// // steadylearner@AirdeStylearner eth % python3
// // >>> hex(1000000000000000000000000)
// // '0xd3c21bcecceda1000000'
// // >>> hex(1000000000000000000000000000000)
// // '0xc9f2c9cd04674edea40000000'
// // >>> hex(1000000000000000000000000000000000)
// // '0x314dc6448d9338c15b0a00000000'
// // >>> hex(1000000000000000000000000)
// // '0xd3c21bcecceda1000000'
// // >>> 10 ** 26
// // 100000000000000000000000000
// // >>> hex(_)
// // '0x52b7d2dcc80cd2e4000000'

// // uint256 totalSupply = 10 ** (8 + 18);
// // uint256 preMine = 2 * (10 ** (7 + 18));
// // uint airdropSize = 10 ** (6 + 18);