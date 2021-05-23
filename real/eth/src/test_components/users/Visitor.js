import React from "react";
import Button from '@material-ui/core/Button';

const Visitor = ({
    address,
    balance,

    escrowState,
    
    purchase,
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
                <h1>You are a visitor</h1>
            </div>

            <p>Your wallet is <b>{address}.</b></p>
            <p>Your balance is <b>{balance} ETH.</b></p>

            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexFlow: "column",
            }}>
                {escrowState === "Sale" && <Button style={fullWidth} onClick={purchase} color="primary" variant="contained">I want to buy this</Button>}
                {escrowState === "Locked" && <p>"The seller is sending a car to another client. Please, visit this page again later if you want to buy a car with this seller."</p>}
                {escrowState === "Complete" && <p>"Wait for the seller to sale a car again or not."</p>}
                {escrowState === "Release" && <p>"The seller will decide to sell a car again or not. Please wait if you want to buy it."</p>}
            </div>
        </>
    )
}

export default Visitor;