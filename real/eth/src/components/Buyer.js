import React from "react";
import Button from '@material-ui/core/Button';

const Buyer = ({
    address,
    balance,

    state,

    receive,
}) => {
    return (
        <div>
            <p>You are the buyer.</p>
            <p>Your addres is {address}</p>
            <p>Your balance is {balance} ETH</p>

            <br />

            {/* {state === "Created" && <p>The price for this contract is {value} ETH. (Deposit {2 * value} ETH to start the contract)</p>} */}
            {state === "Locked" && <Button onClick={receive} variant="contained">I received the product</Button>}
        </div>
    );
}

export default Buyer;