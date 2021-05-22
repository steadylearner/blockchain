import React from "react";
import Button from '@material-ui/core/Button';

const Buyer = ({
    address,
    balance,

    escrowState,

    receive,
}) => {
    const fullWidth = {
        width: "100%"
    };;

    return (
        <>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <h1>You are the buyer</h1>
            </div>

            <p>Your wallet is <b>{address}.</b></p>
            <p>Your balance is <b>{balance} ETH.</b></p>

            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexFlow: "column",
            }}>
                {escrowState === "Locked" && <Button style={fullWidth} color="primary" onClick={receive} variant="contained">I received the product</Button>}
                {escrowState === "Release" && <p>"You confirmed you already received this product."</p>}
                {escrowState === "Complete" && <p>"If you want to buy a new one again, please wait for the seller to sale a car again or not."</p>}
            </div>
        </>
    )
}

export default Buyer;