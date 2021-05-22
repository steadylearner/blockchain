// Show details of the escrow
// current state, balance, total_successful_purchase, created_at etc?

import React from "react";

const ContractDetails = ({
    sales,
    balance,
    price,
    escrowState,
    lastEdited,
}) => {
    return (
        <div style={{
            marginTop: "1rem",
            marginLeft: "1rem",
            
            minWidth: "28rem",
            maxHeight: "28rem",

            border: "1px solid black",
            borderRadius: "0.5rem",
            padding: "0.5rem 1rem 1rem 1rem",
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <h1>Car Escrow Contract</h1>
            </div>
            
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <img
                    style={{
                        maxWidth: "15rem",
                        // maxHeight: "10rem",
                    }}
                    src="/car.jpeg" // Should be image from item later
                />
            </div>
            
            <p>Total sales: <b>{sales}</b></p>
            {/* {lastEdited && <p>Last edited: {lastEdited}</p>} */}
            <p>The current state of this escrow contract is <b>{escrowState}</b>.</p>
            <p>The current balance of this escrow contract is <b>{balance} ETH</b>.</p>

            <p>The price for this contract is <b>{price} ETH.</b></p>
        </div>
    );
}

export default ContractDetails;