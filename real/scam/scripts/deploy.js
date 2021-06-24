// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  // Uncomment for each step.

  // 1. Deploy SCAM
  // const SCAM = await hre.ethers.getContractFactory("SCAM_Token");

  // const scam = await SCAM.deploy();
  // await scam.deployed();

  // console.log("SCAM_Token deployed to:", scam.address);

  // 2. Deploy HackableContract
  const HackableContract = await hre.ethers.getContractFactory("HackableContract");

  const hackable_contract = await HackableContract.deploy();
  await hackable_contract.deployed();

  console.log("HackableContract deployed to:", hackable_contract.address);
  // Use until this to see HackableContract can be deployed with SCAM locally.
  // Move to test

  // 3. Deposit with console?

  // await hackable_contract.DepositScam(deployer.address, 25000);

  // const addressRegsitered = await hackable_contract.addressRegsitered();
  // console.log(addressRegsitered);

  // 2. Deploy Hackable contract 
  
  // 3. Deposit it to 25000 $SCAM

  // 3. Test Hackable Drain

  // 4. Extract it
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
