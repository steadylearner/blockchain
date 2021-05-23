import React from "react";
import Button from '@material-ui/core/Button';

const Seller = ({
    address,
    balance,

    escrowState,

    close,
    refund,
    restart,
    end,
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
                <h1>You are the seller</h1>
            </div>

            <p>Your wallet is <b>{address}.</b></p>
            <p>Your balance is <b>{balance} ETH.</b></p>

            {escrowState === "Sale" && <p>"You need to have a buyer to sell this first."</p>}

            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexFlow: "column",
            }}>
                {escrowState === "Sale" && <Button style={fullWidth} onClick={close} color="secondary" variant="contained">I want to close this ad</Button>}
                
                {escrowState === "Locked" && <p>"Send the car to the client and wait for confirmation of your client before you receive the money."</p>}
                {escrowState === "Release" && <Button style={fullWidth} onClick={refund} color="primary" variant="contained">I want to receive money from what I sold </Button>}
                {(escrowState === "Closed" || escrowState === "Complete") && <Button style={fullWidth} onClick={restart} color="primary" variant="contained">I want to sell a car again</Button>}

                {(escrowState === "Closed" || escrowState === "Complete") && <Button style={{
                    marginTop: "1rem",
                    ...fullWidth,
                }} onClick={end} color="secondary" variant="contained">I want to destroy this contract</Button>}
            </div>
        </>
    )
};

export default Seller;