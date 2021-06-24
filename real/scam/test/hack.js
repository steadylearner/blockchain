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

  beforeEach(async () => {
    provider = ethers.getDefaultProvider();

    SCAMToken = await ethers.getContractFactory("SCAM_Token");
    scamToken = await SCAMToken.deploy();

    HackableContract = await ethers.getContractFactory("HackableContract");
    hackableContract = await HackableContract.deploy();

    // For any reason, deposit SCAM fail with owner
    // I will use airDrop for despotior to help him to have SCAM first (25000) for HackableContract
    [owner, depositor, hacker, secondComer] = await ethers.getSigners();

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

    const zeroCount = await hackableContract.Count();
    console.log("None deposited: ", zeroCount);

    // Make a function to see these.
    // console.log(await hackableContract.addressRegistered())
    // console.log(await hackableContract.addressToId())
    // console.log(await hackableContract.balances())

    const amountToDeposit = 25000;
    await scamToken.connect(depositor).approve(hackableContract.address, amountToDeposit); // Should be called by depositor first

    await hackableContract.DepositScam(depositor.address, amountToDeposit);

    let event = await someoneDespoitScamEvent;
    console.log("SomeoneDepositScam");
    console.log(humanReadableUnixTimestamp(event.when.toString()));

    let count = await hackableContract.Count();
    console.log("First one deposited: ", count);

    await hackableContract.connect(hacker).DepositScam(hacker.address, 0);
    event = await someoneDespoitScamEvent;
    console.log("SomeoneDepositScam");
    console.log(humanReadableUnixTimestamp(event.when.toString()));

    count = await hackableContract.Count();
    console.log("Hacker deposited: ", count);

    console.log("wait");
    sleep(2);

    // Caller should be different for easy testing.
    await hackableContract.connect(secondComer).DepositScam(secondComer.address, 0);
    event = await someoneDespoitScamEvent;
    console.log("SomeoneDepositScam");
    console.log(humanReadableUnixTimestamp(event.when.toString()));

    count = await hackableContract.Count();
    console.log("Hacker deposited: ", count);

    // // This is difficult to test.
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
  });
});