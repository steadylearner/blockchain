// https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13
// https://github.com/ethjs/examples
// https://docs.openzeppelin.com/learn/developing-smart-contracts

// 1. Make escrow with custom price and item information
// 2. Separate UI for seller and visitor (No buyer at the moment), seller can 
// 3. When user buy the product, separate UI for seller and buyer, increase total buyers
// 4. When user receive the product, separate UI for seller and buyer and option for seller to refund money
// 5. Buyer can restart the contract with new information?
// all again until buyer end the contract

// Update frontend and include event

// import './App.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers'

import Escrow from './artifacts/contracts/Escrow.sol/Escrow.json'

// localhost
const escrowAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

// (await box.retrieve()).toString()
// Retrieve accounts from the local node
// const accounts = await ethers.provider.listAccounts();
// console.log(accounts);

// Created, Locked, Release, Inactive
// Use switch instead later?
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
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(escrowAddress, Escrow.abi, provider);

  const [seller, setSeller] = useState();
  const [sellerBalance, setSellerBalance] = useState();

  const [buyer, setBuyer] = useState();
  const [buyerBalance, setBuyerBalance] = useState();

  const [escrowState, setEscrowState] = useState();
  // const [escrowBalance, setEscrowBalance] = useState();
  // const [contractAddress, setContractAddresss] = useState();
  // const [currentSigner, setCurrentSigner] = useState();

  
  useEffect(() => {
    async function fetchData() {
      // You can await here
      const contractSeller = await contract.seller()
      setSeller(contractSeller);

      const contractSellerBalance = await provider.getBalance(contractSeller);
      setSellerBalance(ethers.utils.formatEther(contractSellerBalance));
    }

    fetchData();
  }, []);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function showCurrentEscrowValue() {
    // 1. Get state

    try {
      const value = await contract.value() // How to manually set this?
      // alert(value);
      alert(`${ethers.utils.formatEther(value)} ETH`);

      // console.log('state: ', state) // 0
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  async function showCurrentEscrowState() {
    // 1. Get state

    // setContractAddresss(contract.address);

    const contractBalance = await provider.getBalance(contract.address);
    // setEscrowBalance(contractBalance);

    alert(`Current contract balance is ${ethers.utils.formatEther(contractBalance)} ETH`);

    try {
      const state = await contract.state()
      setEscrowState(humanReadableEscrowState(state));

      // console.log('state: ', state) // 0
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  async function showSeller() {

    try {
      console.log('seller');
      console.log(seller);

      console.log("seller balance");
      console.log(sellerBalance);
      // 9999.995745032
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  // // I had nonce too high problem, it was solved by resetting transaciton history at metamask configruation
  async function abort() {
    if (!escrowState) return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;

      // console.log("signer");
      // console.log(signer);

      const contract = new ethers.Contract(escrowAddress, Escrow.abi, signer); // Should I make this all the time?

      contract.on("Aborted", () => {
        alert("Aborted");
      })

      const transaction = await contract.abort();
      await transaction.wait();
    }
  }

  // // Should use another account
  // This is not working currently
  async function purchase() {
    if (!escrowState) return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;
      const contract = new ethers.Contract(escrowAddress, Escrow.abi, signer); // Should I make this all the time?

      contract.on("PurchaseConfirmed", () => {
        alert("PurchaseConfirmed");
      })

      const transaction = await contract.confirmPurchase({ value: ethers.utils.parseEther("2.0") });
      await transaction.wait();
    }
  }

  // // Only show this after purchase
  async function showBuyer() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(escrowAddress, Escrow.abi, provider)

    try {
      const contractBuyer = await contract.buyer();
      setBuyer(contractBuyer);
      console.log(contractBuyer);
      
      const contractBuyerBalance = await provider.getBalance(buyer);
      setBuyerBalance(contractBuyerBalance);
      console.log(contractBuyerBalance.toString());

      // Should make this work and listen to the event
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  async function receive() {
    if (!escrowState) return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;
      const contract = new ethers.Contract(escrowAddress, Escrow.abi, signer);
      
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

      const contract = new ethers.Contract(escrowAddress, Escrow.abi, signer);
      const transaction = await contract.refundSeller();
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

      const contract = new ethers.Contract(escrowAddress, Escrow.abi, signer);
      contract.on("End", () => {
        alert("End"); // Contract is detroyed
      })

      const transaction = await contract.end();
      await transaction.wait();

      // call currentEscrowState here and it will show you inactive at the screen
      // fetchGreeting()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={showCurrentEscrowValue} >Show me the price(value) of the contract</button>
        <button onClick={showCurrentEscrowState} >Show me the current state of the contract</button>
        <h1>{escrowState} ({contract.address})</h1>

        <br />

        <button onClick={showSeller}>Show seller at console</button>
        <button onClick={abort}>Abort</button>
        <button onClick={refund}>Refund</button>
        <button onClick={end}>End</button>

        <br />

        <button onClick={purchase}>Purchase</button>
        <button onClick={showBuyer}>Show Buyer at console</button>
        <button onClick={receive}>Receive</button>

        {/* <br />

        <button onClick={confirmPurchase}>Confirm Purchase</button>
        <button onClick={confirmReceived}>Confirm Received</button>

        <br />
        
        <button onClick={refundSeller}>Refund Seller</button> */}
      </header>
    </div>
  );
}

export default App;
