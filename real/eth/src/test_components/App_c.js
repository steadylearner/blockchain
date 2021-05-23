// https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13
// https://github.com/ethjs/examples
// https://docs.openzeppelin.com/learn/developing-smart-contracts

// 1. Make escrow with custom price and item information
// 2. Separate UI for seller and visitor (No buyer at the moment), seller can 
// 3. When user buy the product, separate UI for seller and buyer, increase total buyers
// 4. When user receive the product, separate UI for seller and buyer and option for seller to refund money
// 5. Buyer can restart the contract with new information?
// all again until buyer end the contract

// 1. Include the link to show previousPurchases
// 2. Organize the app. Use context and separate components?

// import './App.css';
import { useEffect, useState, createRef } from 'react';
import { Contract, ethers } from 'ethers'

import moment from "moment";

// import CircularProgress from '@material-ui/core/CircularProgress';

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

const humanReadableUnixTimestamp = (timestampInt) => {
  return new Date(timestampInt * 1000);
}

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

// 1. show previousBuyers with table?, Commands to develope better,
// 2. include users to social medias and copyright with steadylearner to help me find a job.
// Use context and separate logic(components and functions),

// Improve CSS with semantic-ui-react?
// https://github.com/substrate-developer-hub/substrate-front-end-template
function App() {
  // contract.on window.location.reload();

  // Use object instead?

  // const [lastEdited, setLastEdited] = useState();

  // const [loading, setLoading] = useState(false);

  const [contractEnd, setContractEnd] = useState(true);

  const [escrow, setEscrow] = useState({
    state: null,
    balance: 0,
    price: 1, // 1 ETH by default
    sales: 0,
    previousBuyers: [],
  });

  // const [escrowState, setEscrowState] = useState();
  // const [escrowBalance, setEscrowBalance] = useState();
  // const [escrowPrice, setEscrowPrice] = useState();
  // const [escrowSales, setEscrowSales] = useState();
  // const [escrowPreviousBuyers, setEscrowPreviousBuyers] = useState();

  // Use object instead?
  const [seller, setSeller] = useState();
  const [sellerBalance, setSellerBalance] = useState();

  // Use object instead?
  const [buyer, setBuyer] = useState();
  const [buyerBalance, setBuyerBalance] = useState();

  // Use object instead?
  const [user, setUser] = useState();
  const [userBalance, setUserBalance] = useState();
  
  const [role, setRole] = useState();

  useEffect(() => {
    async function fetchData() {

      try {
        // Contract Events

        contract.on("Closed", async (when, event) => {
          event.removeListener(); // Solve memory leak with this.

          const contractState = await contract.state();
          // const contractState = await contract.showState();

          const contractBalance = await provider.getBalance(contract.address);
          const previousBuyers = await contract.listPreviousBuyers();

          setEscrow({
            ...escrow,
            state: humanReadableEscrowState(contractState), // Easier
            // state: await contractState.toString(),
            balance: ethers.utils.formatEther(contractBalance.toString()),
            previousBuyers,
          })

          const contractSeller = await contract.seller();
          const contractSellerBalance = await provider.getBalance(contractSeller);
          setSellerBalance(ethers.utils.formatEther(contractSellerBalance));

          // console.log("when");
          // console.log(when);
          // console.log(humanReadableUnixTimestamp(when));
          console.log("Event - Closed");
          console.log(`State - ${humanReadableEscrowState(contractState)}`);
          console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`)
        });

        contract.on("ConfirmPurchase", async (when, by, event) => {
          event.removeListener(); // Solve memory leak with this.

          const contractState = await contract.state();
          const contractBalance = await provider.getBalance(contract.address);
          const previousBuyers = await contract.listPreviousBuyers();

          setEscrow({
            ...escrow,
            state: humanReadableEscrowState(contractState),
            balance: ethers.utils.formatEther(contractBalance.toString()),
            previousBuyers,
          })

          setBuyer(by);
          const contractBuyerBalance = await provider.getBalance(by);
          setBuyerBalance(ethers.utils.formatEther(contractBuyerBalance));

          setRole("buyer");
          console.log("This visitor became the buyer of this contract");

          // console.log("when");
          // console.log(when);
          // console.log(humanReadableUnixTimestamp(when));
          console.log("Event - ConfirmPurchase");
          console.log(`By - ${by}`);
          console.log(`State - ${humanReadableEscrowState(contractState)}`);
          console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`)
        });

        contract.on("ConfirmReceived", async (when, by, event) => {
          event.removeListener(); // Solve memory leak with this.

          const contractState = await contract.state();
          const contractBalance = await provider.getBalance(contract.address);
          const previousBuyers = await contract.listPreviousBuyers();
          console.log(previousBuyers);

          setEscrow({
            ...escrow,
            state: humanReadableEscrowState(contractState),
            balance: ethers.utils.formatEther(contractBalance.toString()),
            previousBuyers,
          })

          setBuyer(by);
          const contractBuyerBalance = await provider.getBalance(by);
          setBuyerBalance(ethers.utils.formatEther(contractBuyerBalance));

          console.log("Event - ConfirmReceived");
          console.log(`By - ${by}`);
          console.log(`State - ${humanReadableEscrowState(contractState)}`);
          console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`)
        });

        contract.on("SellerRefunded", async (when, event) => {
          event.removeListener(); // Solve memory leak with this.

          const contractState = await contract.state();
          const contractBalance = await provider.getBalance(contract.address);

          const previousBuyers = await contract.listPreviousBuyers();
          console.log(previousBuyers);

          setEscrow({
            ...escrow,
            state: humanReadableEscrowState(contractState),
            balance: ethers.utils.formatEther(contractBalance.toString()),
            previousBuyers,
          })

          const contractSeller = await contract.seller();
          const contractSellerBalance = await provider.getBalance(contractSeller);
          setSellerBalance(ethers.utils.formatEther(contractSellerBalance));

          console.log("Event - SellerRefunded");
          console.log(`State - ${humanReadableEscrowState(contractState)}`);
          console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`)
        });

        contract.on("Restarted", async (when, event) => {
          event.removeListener();

          const contractState = await contract.state();
          const contractBalance = await provider.getBalance(contract.address);
          const previousBuyers = await contract.listPreviousBuyers();

          setEscrow({
            ...escrow,
            state: humanReadableEscrowState(contractState),
            balance: ethers.utils.formatEther(contractBalance.toString()),
            previousBuyers,
          })
          const contractSeller = await contract.seller();
          const contractSellerBalance = await provider.getBalance(contractSeller);
          setSellerBalance(ethers.utils.formatEther(contractSellerBalance));

          setBuyer();
          setBuyerBalance();

          console.log("Event - Restarted");
          console.log(`State - ${humanReadableEscrowState(contractState)}`);
          console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`)
        });

        contract.on("End", async () => {
          // This doesn't work
          // event.removeListener();
          
          setContractEnd(false);
          // setEscrow({
          //   ...escrow,
          //   state: null,
          // })
        });

        // contract.on("Restarted", async (when) => {
        //   const contractBalance = await provider.getBalance(contract.address);
        //   const contractBalance = await provider.getBalance(contract.address);

        //   // const contractSeller = await contract.seller();
        //   // const contractSellerBalance = await provider.getBalance(seller);
        //   // setSellerBalance(ethers.utils.formatEther(contractSellerBalance));
          
        //   setEscrow({
        //     ...escrow,
        //     state: "Closed",
        //     balance: ethers.utils.formatEther(contractBalance.toString()),
        //   })

        //   // console.log("when");
        //   // console.log(when);
        //   // console.log(humanReadableUnixTimestamp(when));
        //   console.log("Closed");
        //   console.log(moment(humanReadableUnixTimestamp(when)).fromNow())

        //   // setLastEdited(moment(humanReadableUnixTimestamp(when)).fromNow());

        //   // setEscrowState("Closed");
        //   // setEscrowBalance(0);
        // });

        // Contract State
        const contractState = await contract.state()
        const contractBalance = await provider.getBalance(contract.address);
        const contractPrice = await contract.price()
        // const contractSales = await contract.totalSales();
        const contractPreviousBuyers = await contract.listPreviousBuyers();
        // console.log(contractPreviousBuyers);

        setEscrow({
          state: humanReadableEscrowState(contractState),
          balance: ethers.utils.formatEther(contractBalance.toString()),
          price: ethers.utils.formatEther(contractPrice.toString()),
          // sales: contractSales.toString(),
          previousBuyers: contractPreviousBuyers,
        })

        // state: humanReadableEscrowState(contractState),
        // balance: contractBalance.toString(),
        // price: ethers.utils.formatEther(contractPrice.toString()),
        // sales: contractSales,
        // previousBuyers: contractPreviousBuyers,

        // const contractState = await contract.state()
        // setEscrowState(humanReadableEscrowState(contractState));
        // const contractBalance = await provider.getBalance(contract.address);
        // setEscrowBalance(ethers.utils.formatEther(contractBalance));
        // const contractPrice = await contract.price()
        // setEscrowPrice(ethers.utils.formatEther(contractPrice));
        // const contractSales = await contract.totalSales();
        // setEscrowSales(contractSales.toString());
        // const contractPreviousBuyers = await contract.listPreviousBuyers();
        // setEscrowPreviousBuyers(contractPreviousBuyers);
        // console.log(contractPreviousBuyers);

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
    if (!escrow.state || escrow.state !== "Sale") {
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
    if (!escrow.state || escrow.state !== "Sale") {
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
    if (!escrow.state || escrow.state !== "Locked") {
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
    if (!escrow.state) return

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
    if (!escrow.state) return

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
    if (!escrow.state) return

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

  // alert(escrowState);
  // alert(role);

  // End event
  if (!contractEnd) {
    return null;
  }

  if (!escrow.state) {
    return null;
  } 

  // if (loading) {
  //   return <div style={{
  //     width: "100vw",
  //     height: "100vh",

  //     display: "flex",
  //     alignItems: "center",
  //     justifyContent: "center",
  //   }}>
  //     <CircularProgress />
  //   </div>
  // }

  const contextRef = createRef();

  return (
    <div style={{
      margin: "1rem auto",
      display: "flex",
      flexFlow: "column",
      alignItems: "center"
    }}>
      <ContractDetails
        sales={escrow.previousBuyers.length}
        escrowState={escrow.state}
        price={escrow.price}
        balance={escrow.balance}
        // lastEdited={lastEdited}
      />

      <br />

      {role && <div style={{
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

          escrowState={escrow.state}
          close={close}
          refund={refund}

          restart={restart}
          end={end}
        />}

        {role === "visitor" && <Visitor
          address={user}
          balance={userBalance}

          escrowState={escrow.state}

          purchase={purchase}
        />}

        {/* Visitor to buyer with event listner and set state */}

        {role === "buyer" && <Buyer 
          address={buyer}
          balance={buyerBalance}

          escrowState={escrow.state}

          receive={receive}
        />}
      </div>}
    </div>
  );
}

export default App;
