import React from "react";
import Button from '@material-ui/core/Button';

const Seller = ({
    address,
    balance,
    
    state,
    abort,
}) => {
    return (
        <div>
            <p>You are the seller.</p>

            <p>Your addres is {address}</p>
            <p>Your balance is {balance} ETH</p>

            <br />

            {state === "Created" && <Button onClick={abort} variant="contained">Abort</Button>}
            {/* Include end here. */}
        </div>
    );
}

export default Seller;