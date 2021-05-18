// https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13
// https://github.com/ethjs/examples
// https://docs.openzeppelin.com/learn/developing-smart-contracts

import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'

import Escrow from './artifacts/contracts/Escrow.sol/Escrow.json'

// localhost
const escrowAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

// 1. Show contract state
// 2. Show participants address
// 3. Show participants balance for each action

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
  const [escrowState, setEscrowState] = useState();
  // const [escrowBalance, setEscrowBalance] = useState();
  const [contractAddress, setContractAddresss] = useState();
  // const [currentSigner, setCurrentSigner] = useState();

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function showCurrentEscrowValue() {
    // 1. Get state

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(escrowAddress, Escrow.abi, provider)

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

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(escrowAddress, Escrow.abi, provider)
    setContractAddresss(contract.address);

    const contractBalance =  await provider.getBalance(contract.address);
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
    // 1. Get state

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(escrowAddress, Escrow.abi, provider)

    try {
      const seller = await contract.seller()
      
      console.log('seller'); 
      console.log(seller);

      console.log("seller balance");
      const sellerBalance = await provider.getBalance(seller);
      console.log(ethers.utils.formatEther(sellerBalance));
      // seller
      // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
      // 9999.995745032
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  // I had nonce too high problem, it was solved by resetting transaciton history at metamask configruation
  async function abort() {
    if (!escrowState) return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(); // Your current metamask account;

      // console.log("signer");
      // console.log(signer);

      const contract = new ethers.Contract(escrowAddress, Escrow.abi, signer); // Should I make this all the time?

      contract.on("Aborted", () => {
        alert("Aborted");
      })

      const transaction = await contract.abort();
      await transaction.wait();

      // provider.on("Aborted", (event) => {
      //   console.log("aborted event information");
      //   console.log(event);
      //   // Emitted on every block change
      // })

      // let eventFilter = contract.filters.ContractEvent()
      // let events = await contract.queryFilter(eventFilter)
      // console.log(events);

      // call currentEscrowState here and it will show you inactive at the screen
      // fetchGreeting()
    }
  }

  // Should use another account
  async function purchase() {
    if (!escrowState) return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider.on("Aborted", (event) => {
        console.log("abort event listener");
        console.log(event);
      })

      const signer = provider.getSigner(); // Your current metamask account;

      const contract = new ethers.Contract(escrowAddress, Escrow.abi, signer); // Should I make this all the time?
      
      contract.on("PurchaseConfirmed", () => {
        alert("PurchaseConfirmed");
      })

      const transaction = await contract.confirmPurchase({ value: ethers.utils.parseEther("2.0") });
      // const transaction = await contract.confirmPurchase({ value: 2000000000000000 });
      await transaction.wait();

      // call currentEscrowState here and it will show you inactive at the screen
      // fetchGreeting()
    }
  }

  // Only show this after purchase
  async function showBuyer() {
    // 1. Get state

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(escrowAddress, Escrow.abi, provider)

    try {
      const buyer = await contract.buyer()

      console.log('buyer');
      console.log(buyer);

      // Before purchase
      // buyer
      // 0x0000000000000000000000000000000000000000 (unset)?

      // after
      // buyer
      // 0xdD2FD4581271e230360230F9337D5c0430Bf44C0

      console.log("buyer balance");
      const buyerBalance = await provider.getBalance(buyer);
      console.log(ethers.utils.formatEther(buyerBalance));

      // Should make this work and listen to the event
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  async function receive() {
    if (!escrowState) return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider.on("error", (tx) => {
        // Emitted when any error occurs
        console.log("tx");
        console.log(tx);
      });

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

      const provider = new ethers.providers.Web3Provider(window.ethereum);
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

      // Save this locally?
      const provider = new ethers.providers.Web3Provider(window.ethereum);
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
        <h1>{escrowState} ({contractAddress})</h1>

        <br />
        
        <button onClick={showSeller}>Show seller at console</button>
        <button onClick={abort}>Abort</button>
        <button onClick={refund}>Refund</button>
        <button onClick={end}>End</button>
        
        <br />
        {/* Only show this after purchase later */}
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
