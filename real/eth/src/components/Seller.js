import React from "react";
import Button from '@material-ui/core/Button';

const Seller = ({
    address,
    balance,
    
    state,

    close,
    refund,
    restart,
    end,
}) => {
    return (
        <div style={{
            maxWidth: "22.5rem",
            
            border: "1px solid black",
            borderRadius: "0.5rem",
            padding: "0 1rem 1rem 1rem",
        }} >
            {/* <p>You are the seller.</p> */}
            <h1>Seller</h1>

            <p>Your addres is {address}</p>
            <p>Your balance is {balance} ETH</p>

            {/* <br /> */}

            {/* Reload with events? */}
            {state === "Sale" && <Button onClick={close} color="secondary" variant="contained">I want to close this ad</Button>}
            {/* Incldue end here */}

            {state === "Release" && <Button onClick={refund} color="primary" variant="contained">I want to receive money from what I sold </Button>}
            {(state === "Close" || state === "Complete") && <Button onClick={restart} color="primary" variant="contained">I want to sell a car again</Button>}
            
            {(state === "Close" || state === "Complete") && <Button style={{
                marginTop: "1rem",
            }} onClick={end} color="secondary" variant="contained">I want to destroy this contract</Button>}

            {/* Include end here. */}
        </div>
    );
}

export default Seller;