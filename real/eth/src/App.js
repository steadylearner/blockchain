// https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13
// https://github.com/ethjs/examples
// https://docs.openzeppelin.com/learn/developing-smart-contracts

// 1. Make escrow with custom price and item information
// 2. Separate UI for seller and visitor (No buyer at the moment), seller can 
// 3. When user buy the product, separate UI for seller and buyer, increase total buyers
// 4. When user receive the product, separate UI for seller and buyer and option for seller to refund money
// 5. Buyer can restart the contract with new information?
// all again until buyer end the contract

// Update frontend and include event listeners for it and test also?
// Use context and separate components?

// import './App.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers'

// import Button from '@material-ui/core/Button';

// import { Container, Dimmer, Loader, Grid, Sticky, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import Escrow from './artifacts/contracts/Escrow.sol/Escrow.json'

import ContractDetails from "./components/ContractDetails";

import Seller from "./components/users/Seller";
import Visitor from "./components/users/Visitor";
import Buyer from "./components/users/Buyer";

// localhost
const escrowAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

// Move this to context?
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(escrowAddress, Escrow.abi, provider);

const humanReadableEscrowState = (escrowState) => {
  if (escrowState === 0) {
    return "Sale";
  } else if (escrowState === 1) {
    return "Locked";
  } else if (escrowState === 2) {
    return "Release";
  } else if (escrowState === 3) {
    return "Closed";
  } else if (escrowState === 4) {
    return "Complete";
  }
  // else if (state === 5) {
  //   return "End";
  // }
}

// Show metamask for users to decide if they will pay or not
async function requestAccount() {
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    console.log("error");
    console.error(error);

    alert("Login to Metamask first");
  }
}

// 1.
// Include event listener and setState 
// for total_sales, role, userBalance, escrowState, escrowBalance 
// or simply reload the page
// 2. Use context and separate logic(components and functions)

// Commands to develope better

// Improve CSS with semantic-ui-react?
// https://github.com/substrate-developer-hub/substrate-front-end-template
function App() {
  // Include to context?
  
  // contract.on window.location.reload();

  const [escrowState, setEscrowState] = useState();
  const [escrowBalance, setEscrowBalance] = useState();
  const [escrowPrice, setEscrowPrice] = useState();
  const [escrowSales, setEscrowSales] = useState();

  const [seller, setSeller] = useState();
  const [sellerBalance, setSellerBalance] = useState();
  const [buyer, setBuyer] = useState();
  const [buyerBalance, setBuyerBalance] = useState();

  const [user, setUser] = useState();
  const [userBalance, setUserBalance] = useState();
  
  const [role, setRole] = useState();

  useEffect(() => {
    async function fetchData() {

      try {
        // Contract 
        const contractState = await contract.state()
        setEscrowState(humanReadableEscrowState(contractState));
        const contractBalance = await provider.getBalance(contract.address);
        setEscrowBalance(ethers.utils.formatEther(contractBalance));
        const contractPrice = await contract.price()
        setEscrowPrice(ethers.utils.formatEther(contractPrice));
        const contractSales = await contract.total_sales();
        setEscrowSales(contractSales.toString());

        const contractSeller = await contract.seller();
        setSeller(contractSeller);
        const contractSellerBalance = await provider.getBalance(contractSeller);
        setSellerBalance(ethers.utils.formatEther(contractSellerBalance));

        const contractBuyer = await contract.buyer()
        setBuyer(contractBuyer);
        const contractBuyerBalance = await provider.getBalance(contractBuyer);
        setBuyerBalance(ethers.utils.formatEther(contractBuyerBalance)); // Should make this part work again.

        const signer = provider.getSigner(); // user

        const contractUser = await signer.getAddress();
        setUser(contractUser);
        const contractUserBalance = await provider.getBalance(contractUser);
        setUserBalance(ethers.utils.formatEther(contractUserBalance));

        if (contractUser === contractSeller) {
          setRole("seller");
        } else if (contractUser === contractBuyer) {
          setRole("buyer");
        } else {
          setRole("visitor");
        }
      } catch (error) {
        console.log("error");
        console.error(error);
      }
    }

    fetchData();
  }, []);

  // Use context to save Contract and Provider and sperad these functions to each components that need them.

  async function close() {
    if (!escrowState || escrowState !== "Sale") {
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;

      // console.log("signer");
      // console.log(signer);

      const forClose = new ethers.Contract(escrowAddress, Escrow.abi, signer); // Should I make this all the time?

      // contract.on("Aborted", () => {
      //   alert("Aborted");
      // })

      const transaction = await forClose.close();
      await transaction.wait();
    }
  }

  // Visitor
  async function purchase() {
    if (!escrowState || escrowState !== "Sale") {
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

  async function refund() {
    if (!escrowState) return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;

      const forRefund = new ethers.Contract(escrowAddress, Escrow.abi, signer);
      const transaction = await forRefund.refundSeller();
      await transaction.wait();

      // call currentEscrowState here and it will show you inactive at the screen
      // fetchGreeting()
    }
  }

  async function restart() {
    if (!escrowState) return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;

      const forRestart = new ethers.Contract(escrowAddress, Escrow.abi, signer);
      const transaction = await forRestart.restartContract({ value: ethers.utils.parseEther("2.0") });
      await transaction.wait();

      // call currentEscrowState here and it will show you inactive at the screen
      // fetchGreeting()
    }
  }

  async function end() {
    if (!escrowState) return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;

      const forEnd = new ethers.Contract(escrowAddress, Escrow.abi, signer);
      const transaction = await forEnd.end();
      await transaction.wait();

      // call currentEscrowState here and it will show you inactive at the screen
      // fetchGreeting()
    }
  }

  if (!escrowState) {
    return null;
  } 

  return (
    <div style={{
      margin: "1rem auto",
      display: "flex",
      flexFlow: "column",
      alignItems: "center"
    }}>
      <ContractDetails
        sales={escrowSales}
        escrowState={escrowState}
        price={escrowPrice}
        balance={escrowBalance}
      />

      <br />

      <div style={{
        // marginTop: "1rem",
        marginLeft: "1rem",

        maxWidth: "28rem",

        border: "1px solid black",
        borderRadius: "0.5rem",
        padding: "0.5rem 1rem 1rem 1rem",
      }} >
        {role === "seller" && <Seller 
          address={seller}
          balance={sellerBalance}

          escrowState={escrowState}
          close={close}
          refund={refund}

          restart={restart}
          end={end}
        />}

        {role === "visitor" && <Visitor
          address={user}
          balance={userBalance}

          escrowState={escrowState}

          purchase={purchase}
        />}

        {/* Visitor to buyer with event listner and set state */}

        {role === "buyer" && <Buyer 
          address={buyer}
          balance={buyerBalance}

          escrowState={escrowState}

          receive={receive}
        />}
      </div>
    </div>
  );
}

export default App;
