import React from "react";
import Button from '@material-ui/core/Button';

const Visitor = ({
    address,
    balance,

    state,
    
    purchase,
}) => {
    return (
        <div style={{
            maxWidth: "22.5rem",
            
            border: "1px solid black",
            borderRadius: "0.5rem",
            padding: "0 1rem 1rem 1rem",
        }} >
            {/* <p>You are the visitor.</p> */}
            <h1>Visitor</h1>

            <p>Your addres is {address}</p>
            <p>Your balance is {balance} ETH</p>

            {/* <br /> */}

            {state === "Sale" && <Button onClick={purchase} color="primary" variant="contained">I want to buy this</Button>}
        </div>
    );
}

export default Visitor;