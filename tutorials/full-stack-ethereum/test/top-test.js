// https://github.com/ethers-io/ethers.js/issues/1051

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Top", function() {
  let Top, top, owner, john, jane;

  beforeEach(async () => {
    Top = await ethers.getContractFactory("Top");
    top = await Top.deploy();
    [owner, john, jane, _] = await ethers.getSigners();

    owner
  })

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await top.owner()).to.equal(owner.address);
      // expect(await top.owner()).to.equal(owner.getAddress());
    });

    it("Start with 0 number of items in the top list", async () => {
      expect(await top.totalTops()).to.equal(0);
    });
  })

  describe("Owner", () => {
    it("Should include an item from the top list", async () => {
      // await top.include("Rust", { from: owner }); // This doesn't work.
      await top.include("Rust", { from: owner.address });
      expect(await top.totalTops()).to.equal(1);
    })

    it("Should remove an item from the top list", async () => {
      await top.include("Rust", { from: owner.address });
      expect(await top.totalTops()).to.equal(1);

      await top.remove(0, { from: owner.address });
      const tops = await top.getTops();
      expect(tops).to.deep.equal(['']);
    })
  })

  describe("Not Owners", () => {
    it("Should be able to use public totalTops, getTops etc", async () => {
      await top.totalTops();
      await top.getTops();
    })

    it("Shouldn't be able to use owner only functions totalTops, getTops etc", async () => {
      // Error: Contract with a Signer cannot override from(operation = "overrides.from", code = UNSUPPORTED_OPERATION, version = contracts / 5.0.12)
      // Search this afrer reading https://hardhat.org/getting-started/ docs.

      console.log("owner.address");
      console.log(owner.address);
      
      // expect(await top.include("Rust", { from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92267" })).to.equal(1);
      // await top.include("Rust", { from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" });
      // expect(await top.include("Rust", { from: john.address })).to.be.revertedWith("Not enough tokens");
      // expect(await top.include("Rust", { from: jane.address })).to.be.revertedWith("Not enough tokens");

      // expect(await top.remove(0, { from: jane.address })).to.be.revertedWith("Not enough tokens");
      // expect(await top.remove(1, { from: jane.address })).to.be.revertedWith("Not enough tokens");
    })

    // it("Should fail if not enough tokens", async () => {
    //   const initialOwnerBalance = await token.balanceOf(owner.address)
    //   await expect(token.connect(addr1).transfer(owner.address, 1))
    //     .to.be.revertedWith("Not enough tokens")

    //   expect(
    //     await token.balanceOf(owner.address)
    //   ).to.equal(initialOwnerBalance)
    // })
  })
});
