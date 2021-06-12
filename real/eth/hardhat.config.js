require("@nomiclabs/hardhat-waffle");
require("hardhat-typechain");
require("@nomiclabs/hardhat-web3");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

task("balance", "Prints an account's balance")
.addParam("account", "The account's address")
.setAction(async taskArgs => {
  const account = web3.utils.toChecksumAddress(taskArgs.account);
  const balance = await web3.eth.getBalance(account);

  console.log(web3.utils.fromWei(balance, "ether"), "ETH");
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    // $npx hardhat run scripts/deploy.js --network localhost
    // https://hardhat.org/config/
    hardhat: {
      chainId: 1337, // Use this for frontend with metamaks?
    },
    // $npx hardhat run scripts/deploy.js --network ropsten
    ropsten: {
      url: "https://ropsten.infura.io/v3/2b69870b8c29439f9192145f37967f67",
      accounts: [`0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e`]
      // accounts: [`0x${your-private-key}`]
      // 
    },
    // rinkeby: {
    //   url: "https://rinkeby.infura.io/v3/projectid",
    //   accounts: [process.env.a2key]
    // }
  },
  solidity: "0.8.3",
};

