// Show details of the escrow
// current state, balance, total_successful_purchase, created_at etc?

import React from "react";

const ContractDetails = ({
    sales,
    balance,
    price,
    state,
}) => {
    return (
        <div style={{
            maxWidth: "22.5rem",
            maxHeight: "28rem",

            border: "1px solid black",
            borderRadius: "0.5rem",
            padding: "0 1rem 0.5rem 1rem",
        }}>
            <h1>Contract</h1>
            
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
            <p>The current state of this escrow contract is <b>{state}</b></p>
            <p>The current balance of this escrow contract is <b>{balance} ETH</b></p>

            <p>The current price for this contract is <b>{price} ETH.</b></p>
        </div>
    );
}

export default ContractDetails;