const { expect } = require("chai");

// enum State { Created, Locked, Release, Inactive } // 0, 1, 2, 3?
describe("Escrow", function() {
  let provider;
  let Escrow, escrow, owner, john, jane;

  beforeEach(async () => {
    provider = ethers.getDefaultProvider();

    Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy({ value: 2 });  // This passes because it is even msg.value
    // escrow = await Escrow.deploy({ value: 10 });  // This passes because it is even msg.value 
    // escrow = await Escrow.deploy({ value: 1 }); // This fails
    [owner, john, jane, _] = await ethers.getSigners();

    // console.log(escrow.address);
    // console.log(escrow.deployTransaction);
  })

  // it("Should deploy Escrow contract", async function() {
  //   const Escrow = await ethers.getContractFactory("Escrow");
  //   // const escrow = await Escrow.deploy(10); // This fails, should start with even number, will it pass?

  //   // With this, I can send msg.value?
  //   const escrow = await Escrow.deploy(); // Should start with even number, but how can I do it? it passes the test
    
  //   await escrow.deployed();
  // });

  it("Should be inactive and send its balance to the seller", async function () {
    // contract balance should be 10
    console.log("Escrow contract balance");
    const contractBalance = await provider.getBalance(escrow.address);
    console.log(ethers.utils.formatEther(contractBalance))

    expect(await escrow.state()).to.equal(0); // Created

    // console.log("owner before abort");
    // console.log(owner);
    // console.log(escrow.balanceOf(owner));

    // console.log(await provider.getBalance(owner.address));
    expect(await provider.getBalance(owner.address)).to.equal(0); // 0
    expect(await escrow.seller()).to.equal(owner.address);

    await escrow.abort();

    // console.log(await escrow.currentState());
    // console.log(await escrow.state());
    expect(await escrow.state()).to.equal(3); // Inactive

    // expect(await provider.getBalance(owner.address)).to.equal(10);
    // console.log(await provider.getBalance(owner.address)); // Currently balance is the same

    // console.log("owner afrer abort");
    // console.log(owner);
  });
});
