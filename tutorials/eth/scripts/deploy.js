// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners(); // First of 20 from $npx hardhat node?

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const Top = await hre.ethers.getContractFactory("Top");
  const top = await Top.deploy();
  
  // const Greeter = await hre.ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, World!"); // Include constructor params here.

  // const Token = await hre.ethers.getContractFactory("Token");
  // const token = await Token.deploy();
  
  await top.deployed();
  // await greeter.deployed();
  // await token.deployed();

  console.log("Top deployed to:", top.address);
  // console.log("Greeter deployed to:", greeter.address);
  // console.log("Token deployed to:", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
