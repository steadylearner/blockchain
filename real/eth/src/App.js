// https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13
// https://github.com/ethjs/examples
// https://docs.openzeppelin.com/learn/developing-smart-contracts

// 1. Make escrow with custom price and item information
// 2. Separate UI for seller and visitor (No buyer at the moment), seller can 
// 3. When user buy the product, separate UI for seller and buyer, increase total buyers
// 4. When user receive the product, separate UI for seller and buyer and option for seller to refund money
// 5. Buyer can restart the contract with new information?
// all again until buyer end the contract

// Organize the app. Use context and separate components?

// import './App.css';
import { useEffect, useState, createRef } from 'react';
import { Contract, ethers } from 'ethers'

import moment from "moment";

// import CircularProgress from '@material-ui/core/CircularProgress';

// import Button from '@material-ui/core/Button';

import { Container, Dimmer, Loader, Grid, Sticky, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import Escrow from './artifacts/contracts/Escrow.sol/Escrow.json'

import {
  humanReadableEscrowState,
  humanReadableUnixTimestamp,
} from "./formatters";

import ContractDetails from "./components/ContractDetails";
import Balance from "./components/Balance";

import Seller from "./components/users/Seller";
import Visitor from "./components/users/Visitor";
import Buyer from "./components/users/Buyer";
import PreviousBuyers from "./components/PreviousBuyers";

// localhost
const escrowAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

// Move this to context?
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(escrowAddress, Escrow.abi, provider);

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

// 1. Use context and separate logic(components and functions),

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

        contract.on("SellerRefundBuyer", async (when, event) => {
          event.removeListener(); // Solve memory leak with this.

          const contractState = await contract.state();
          // const contractBalance = await provider.getBalance(contract.address);
          // const previousBuyers = await contract.listPreviousBuyers();

          setEscrow({
            ...escrow,
            state: humanReadableEscrowState(contractState),
            // balance: ethers.utils.formatEther(contractBalance.toString()),
            // previousBuyers,
          })

          console.log("This seller refunded the buyer of this contract");

          // console.log("when");
          // console.log(when);
          // console.log(humanReadableUnixTimestamp(when));
          console.log("Event - SellerRefundBuyer");
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
          console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`);
        });

        contract.on("End", async (_when, _event) => {
          // This doesn't work
          // event.removeListener();

          // console.log("Event - End");
          // console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`)
          setContractEnd(false);
        });

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

      const forClose = new ethers.Contract(escrowAddress, Escrow.abi, signer);

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

  async function refundBuyer() {
    if (!escrow.state || escrow.state !== "Locked") return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const signer = provider.getSigner(); // Your current metamask account;

      const forRefund = new ethers.Contract(escrowAddress, Escrow.abi, signer);
      const transaction = await forRefund.refundBuyer();
      await transaction.wait();

      // call currentEscrowState here and it will show you inactive at the screen
      // fetchGreeting()
    }
  }

  async function refundSeller() {
    if (!escrow.state || escrow.state !== "Release") return

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
    // if (!escrow.state || escrow.state !== "Closed" || escrow.state !== "Complete" ) return

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
    // if (!escrow.state || escrow.state !== "Closed" || escrow.state !== "Complete") return

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

  // const contextRef = createRef();

  let balance;
  if (role === "seller") {
    balance = sellerBalance
  } else if (role === "buyer") {
    balance = buyerBalance;
  } else {
    balance = userBalance;
  }

  return (
    <div>
      <Sticky >
        <Balance
          balance={balance}
        // setAccountAddress={setAccountAddress} 
        />
      </Sticky>
      <div style={{
        // borderTop: "1px solid black",
        margin: "0 auto",
        display: "flex",
        flexFlow: "column",
        alignItems: "center",

        background: "#efefef",
        minHeight: "100vh",
      }}>
        <ContractDetails
          address={contract.address}
          sales={escrow.previousBuyers.length}
          escrowState={escrow.state}
          price={escrow.price}
          balance={escrow.balance}
        // lastEdited={lastEdited}
        />

        <br />

        {escrow.previousBuyers.length > 0 && <div style={{
          // marginTop: "1rem",
          // marginLeft: "1rem",

          width: "28rem",
          marginBottom: "1.5rem",

          border: "1px solid black",
          borderRadius: "0.5rem",
          padding: "0.5rem 1rem 1rem 1rem",

          background: "white",
        }} ><PreviousBuyers previousBuyers={escrow.previousBuyers} /></div>}

        {role && <div style={{
          // marginTop: "1rem",
          // marginLeft: "1rem",

          width: "28rem",
          marginBottom: "1.5rem",

          border: "1px solid black",
          borderRadius: "0.5rem",
          padding: "0.5rem 1rem 1rem 1rem",

          background: "white",
        }} >
          {role === "seller" && <Seller
            address={seller}
            buyer={buyer}
            // balance={sellerBalance}

            escrowState={escrow.state}
            close={close}

            refundBuyer={refundBuyer}
            refundSeller={refundSeller}

            restart={restart}
            end={end}
          />}

          {role === "visitor" && <Visitor
            address={user}
            seller={seller}
            // balance={userBalance}

            escrowState={escrow.state}

            purchase={purchase}
          />}

          {/* Visitor to buyer with event listener and set state */}

          {role === "buyer" && <Buyer
            address={buyer}
            seller={seller}
            // balance={buyerBalance}

            escrowState={escrow.state}

            receive={receive}
          />}
        </div>}
      </div>
    </div>
  );
}

export default App;