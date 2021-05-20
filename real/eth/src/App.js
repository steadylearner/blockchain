// https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13
// https://github.com/ethjs/examples
// https://docs.openzeppelin.com/learn/developing-smart-contracts

// Should make UI for visitor, seller and buyer

// 1. Make escrow with custom price and item information
// 2. Separate UI for seller and visitor (No buyer at the moment), seller can 
// 3. When user buy the product, separate UI for seller and buyer, increase total buyers
// 4. When user receive the product, separate UI for seller and buyer and option for seller to refund money
// 5. Buyer can restart the contract with new information?
// all again until buyer end the contract

import { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

// import Avatar from '@material-ui/core/Avatar'; // Seller or Buyer should use this
// import AccountCircle from '@material-ui/icons/AccountCircle'; // Visitor should use this

// import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

import { ethers } from 'ethers'
import Escrow from './artifacts/contracts/Escrow.sol/Escrow.json'

import ContractDetails from "./components/ContractDetails";

import Seller from "./components/Seller";

import Visitor from "./components/Visitor";
import Buyer from "./components/Buyer";

// localhost
const escrowAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

// Include to context?
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(escrowAddress, Escrow.abi, provider);

// Show metamask for users to decide if they will pay or not
async function requestAccount() {
  await window.ethereum.request({ method: 'eth_requestAccounts' });
}

const humanReadableEscrowState = (state) => {
  if (state === 0) {
    return "Created";
  } else if (state === 1) {
    return "Locked";
  } else if (state === 2) {
    return "Release";
  } else if (state === 3) {
    return "Inactive";
  }
}

// Should listen to abort event
function App() {
  // Include this.
  // const contractBalance = await provider.getBalance(contract.address);
  // setEscrowBalance(contractBalance);
  // alert(`Current contract balance is ${ethers.utils.formatEther(contractBalance)} ETH`);

  // Include to context?
  const [escrowBalance, setEscrowBalance] = useState();
  const [escrowState, setEscrowState] = useState();
  // const [contractState, setContractState] = useState();

  const [value, setValue] = useState();
  // const [balance, setBalance] = useState();
  // Should find how to get contract balance also.

  const [seller, setSeller] = useState();
  const [sellerBalance, setSellerBalance] = useState();
  const [buyer, setBuyer] = useState();
  const [buyerBalance, setBuyerBalance] = useState();

  const [user, setUser] = useState();
  const [userBalance, setUserBalance] = useState();

  useEffect(() => {
    async function fetchData() {

      try {
        const contractBalance = await provider.getBalance(contract.address);
        setEscrowBalance(ethers.utils.formatEther(contractBalance));
        // const contractBalance = await contract.balance()
        // setBalance(ethers.utils.formatEther(contractBalance));

        const state = await contract.state()
        setEscrowState(humanReadableEscrowState(state));

        // Should find how to get contract balance also.
        const contractValue = await contract.value()
        setValue(ethers.utils.formatEther(contractValue));

        const contractSeller = await contract.seller();
        setSeller(contractSeller);

        const contractSellerBalance = await provider.getBalance(contractSeller);
        setSellerBalance(ethers.utils.formatEther(contractSellerBalance));

        const contractBuyer = await contract.buyer()
        setBuyer(contractBuyer);

        const contractBuyerBalance = await provider.getBalance(contractBuyer);
        setBuyerBalance(ethers.utils.formatEther(contractBuyerBalance));

        // https://docs.ethers.io/v5/single-page/#/v5/getting-started/-%23-getting-started--history
        const signer = provider.getSigner(); // user
        // console.log(signer);

        // setUser(await signer.getAddress());
        const contractUser = await signer.getAddress();
        setUser(contractUser);

        const contractUserBalance = await provider.getBalance(contractUser);
        setUserBalance(ethers.utils.formatEther(contractUserBalance));

      } catch (error) {
        console.log("error");
        console.error(error);
      }
    }

    fetchData();
  }, []);

  async function abort() {
    if (!escrowState || escrowState !== "Created") {
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;

      // console.log("signer");
      // console.log(signer);

      const forAbort = new ethers.Contract(escrowAddress, Escrow.abi, signer); // Should I make this all the time?

      // contract.on("Aborted", () => {
      //   alert("Aborted");
      // })

      const transaction = await forAbort.abort();
      await transaction.wait();
    }
  }

  // Visitor
  async function purchase() {
    if (!escrowState || escrowState !== "Created") {
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;
      const forPurchase = new ethers.Contract(escrowAddress, Escrow.abi, signer); // Should I make this all the time?

      // contract.on("PurchaseConfirmed", () => {
      //   alert("PurchaseConfirmed");
      // })

      const transaction = await forPurchase.confirmPurchase({ value: ethers.utils.parseEther("2.0") });
      await transaction.wait();
    }
  }

  async function receive() {
    if (!escrowState || escrowState !== "Locked") {
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;
      const contract = new ethers.Contract(escrowAddress, Escrow.abi, signer);

      // contract.on("PurchaseConfirmed", () => {
      //   alert("PurchaseConfirmed");
      // })

      const transaction = await contract.confirmReceived();
      await transaction.wait();

      // call currentEscrowState here and it will show you inactive at the screen
      // fetchGreeting()
    }
  }

  // const classes = useStyles();

  // user === null? no metamask?
  if (!user) {
    // return null;
    return <p>
      Include any signer such as Metamask.
    </p>;
  }

  // Include role?

  // Seller.js
  if (user === seller) {
    return (<div>
      <ContractDetails 
        state={escrowState}
        price={value}
        balance={escrowBalance}
      />

      <br />

      <Seller 
        address={seller}
        balance={sellerBalance}

        state={escrowState}

        abort={abort}
      />

    </div>);
  }

  // Buyer.js
  if (user === buyer) {
    return (<div>
      <ContractDetails
        state={escrowState}
        price={value}
        balance={escrowBalance}
      />

      <br />

      <Buyer
        address={seller}
        balance={buyerBalance}

        state={escrowState}

        receive={receive}
      />
    </div>);
  }

  // Visitor.js
  return (<div>
    <ContractDetails
      state={escrowState}
      price={value}
      balance={escrowBalance}
    />

    <br />

   <Visitor 
      address={seller}
      // balance={buyerBalance}

      state={escrowState}

      purchase={purchase}
   />
    
    {/* Include purchase button to use here */}
  </div>);
}

export default App;

{/* <Button variant="contained">Default</Button>
      <Button variant="contained" color="primary">
    Primary
      </Button>
      <Button variant="contained" color="secondary">
    Secondary
      </Button>
      <Button variant="contained" disabled>
    Disabled
      </Button> */}