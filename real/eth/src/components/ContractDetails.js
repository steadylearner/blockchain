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
        <div>
            <p>Total sale: {sales}</p>
            <p>The current state of this escrow contract is <b>{state}</b></p>
            <p>The current balance of this escrow contract is {balance} ETH</p>

            <p>The current price for this contract is {price} ETH.</p>
        </div>
    );
}

export default ContractDetails;