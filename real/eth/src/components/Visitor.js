import React from "react";
import Button from '@material-ui/core/Button';

const Visitor = ({
    address,
    balance,

    state,
    
    purchase,
}) => {
    return (
        <div>
            <p>You are the visitor.</p>

            <p>Your addres is {address}</p>
            {/* <p>Your balance is {balance} ETH</p> */}

            <br />

            {state === "Created" && <Button onClick={purchase} variant="contained">Buy</Button>}
        </div>
    );
}

export default Visitor;