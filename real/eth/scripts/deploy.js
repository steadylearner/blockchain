// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

// npx hardhat console--network localhost
// All contracts have already been compiled, skipping compilation.
// > const Box = await ethers.getContractFactory("Box")
// undefined
//   > const box = await Box.attach("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")
// undefined
//   > (await box.retrieve()).toString()
// '42'

async function main() {
  const [deployer] = await hre.ethers.getSigners(); // First of 20 from $npx hardhat node?

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const Escrow = await hre.ethers.getContractFactory("Escrow");
  // const escrow = await Escrow.deploy(); // Should be here to set value?
  // 0.002 ETH, find a better way for this

  // 0.002 ETH, how to make it easily to 2ETH?
  // https://docs.ethers.io/v5/getting-started/#getting-started--sending
  const escrow = await Escrow.deploy({ value: ethers.utils.parseEther("2.0") }); // Should be here to set value?
  // const escrow = await Escrow.deploy({ value: "1 ETHEREUM" }); // Should be here to set value?
  // const escrow = await Escrow.deploy({ value: 2000000000000000 }); // Should be here to set value?

  // Contract deployment: Escrow
  // Contract address: 0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0
  // Transaction: 0xd8fab06dae0b41dda1d2b8a4f0b8883c5dfa1da3bab5ebbc72dec6c1251e9a00
  // From: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  // Value: 2 wei
  // Gas used: 839357 of 839357
  // Block #5: 0xb6d70b5a3308639a4a3332d76aeaa113d20c3ea5136aae330171298fc5f03ef5
  
  await escrow.deployed();
  // await greeter.deployed();
  // await token.deployed();

  console.log("Escrow deployed to:", escrow.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
