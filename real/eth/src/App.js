import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'

import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'

// Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// Greeter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
// Token deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

// localhost
const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" 

// robsten (https://ropsten.etherscan.io/address/0x341ad76727ea38a1d091081138cd4d68394993de)
// const greeterAddress = "0x341ad76727EA38A1d091081138CD4D68394993dE" 

function App() {
  const [greeting, setGreetingValue] = useState()
  const [userAccount, setUserAccount] = useState()
  const [amount, setAmount] = useState()

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      console.log({ provider })
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)

      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider })
      
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      
      fetchGreeting()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
        <button onClick={setGreeting}>Set Greeting</button>
      </header>
    </div>
  );
}

export default App;
