import React from "react";
import Button from '@material-ui/core/Button';

const Buyer = ({
    address,
    balance,

    state,

    receive,
}) => {
    return (
        <div style={{
            maxWidth: "22.5rem",
            
            border: "1px solid black",
            borderRadius: "0.5rem",
            padding: "0 1rem 1rem 1rem",
        }} >
            {/* <p>You are the buyer.</p> */}
            <h1>Buyer</h1>

            <p>Your addres is {address}</p>
            <p>Your balance is {balance} ETH</p>

            {/* <br /> */}

            {/* {state === "Created" && <p>The price for this contract is {value} ETH. (Deposit {2 * value} ETH to start the contract)</p>} */}
            {state === "Locked" && <Button onClick={receive} variant="contained">I received the product</Button>}
            {state === "Release" && <p>"You told you already received this product."</p>}
        </div>
    );
}

export default Buyer;