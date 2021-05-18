// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

// Compile locally - $npx hardhat compile and verify src/artifcats/contracts, edit scripts/deploy.js also with contract name
// Test - $npx hardhat test

// $npx hardhat node to develope locally
// $npx hardhat run scripts/deploy.js --network localhost, this will help you get the deployed contract acccount

// Write UI for this - Edit src/App.js 
// $yarn start with metamask

// Include self destrcut function to test contract.balance?
// sudo state

// Organize the project with frontend
contract Escrow {
    uint public value;

    address payable public seller;
    address payable public buyer;

    uint public total_successful_purchases;

    // increase it with restart button

    struct Item {
        string name;
        string image;
        string description;
        string external_link;
    }

    Item public item;

    enum State { Sale, Locked, Release, Closed, Complete, End } // 0, 1, 2, 3?
    // The state variable has a default value of the first member, `State.created`
    State public state;

    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    modifier onlyBuyer() {
        require(
            msg.sender == buyer,
            "Only buyer can call this."
        );
        _;
    }

    modifier onlySeller() {
        require(
            msg.sender == seller,
            "Only seller can call this."
        );
        _;
    }

    modifier notSeller() {
        require(
            msg.sender != seller,
            "Seller shouldn't call this."
        );
        _;
    }

    modifier inState(State _state) {
        require(
            state == _state,
            "Invalid state."
        );
        _;
    }

    event Closed();
    event PurchaseConfirmed();
    event ItemReceived();
    event SellerRefunded();
    event Resell();
    event End();

    /// Ensure that `msg.value` is an even number.
    /// Division will truncate if it is an odd number.
    /// Check via multiplication that it wasn't an odd number.
    /// 1.
    constructor(Item memory itemInformation) payable {
        // How to start with more value for the contract?
        // after you deploy contract, the account balance becomes from 10000 to 9999.9968
        seller = payable(msg.sender);

        value = msg.value / 2; // Is this automatically caluclated?

        item = itemInformation;
        
        require((2 * value) == msg.value, "Value has to be even.");
    }

    /// Close the purchase and reclaim the ether.
    /// Can only be called by the seller before
    /// the contract is locked.
    /// 2.
    function close()
        public
        onlySeller
        inState(State.Sale)
    {
        emit Closed(); // How to listen to this?
        state = State.Closed;
        // We use transfer here directly. It is
        // reentrancy-safe, because it is the
        // last call in this function and we
        // already changed the state.
        seller.transfer(address(this).balance); // Should manually check the change at metamask?
    }

    // /// Confirm the purchase as buyer.
    // /// Transaction has to include `2 * value` ether.
    // /// The ether will be locked until confirmReceived
    // /// is called.
    function confirmPurchase()
        public
        notSeller
        inState(State.Sale)
        condition(msg.value == (2 * value))
        payable
    {
        emit PurchaseConfirmed();
        buyer = payable(msg.sender);
        state = State.Locked;
    }

    // /// Confirm that you (the buyer) received the item.
    // /// This will release the locked ether.
    function confirmReceived()
        public
        onlyBuyer
        inState(State.Locked)
    {
        emit ItemReceived();
        // It is important to change the state first because
        // otherwise, the contracts called using `send` below
        // can call in again here.
        state = State.Release;

        total_successful_purchases = total_successful_purchases + 1;

        buyer.transfer(value); // Buyer receive 1 x value here
    }

    /// This function refunds the seller, i.e.
    /// pays back the locked funds of the seller.
    function refundSeller()
        public
        onlySeller
        inState(State.Release)
    {
        emit SellerRefunded();
        // It is important to change the state first because
        // oth.erwise, the contracts called using `send` below
        // can call in again here.
        state = State.Complete;

        seller.transfer(3 * value); // Seller receive 3 x value here
    }

    function restartContract() 
        public
        onlySeller
        inState(State.Complete)
        payable
    {
        require((2 * value) == msg.value, "Value has to be equal to what started the contract.");

        emit SellerRefunded();

        state = State.Sale;
    }

    function end() 
        public
        onlySeller
    {
        if (state == State.Closed || state == State.Complete) {
            emit End();
            // After a contract calls selfdestruct, the code and storage associated with the contract are removed from the Ethereum's World State.
            // Transactions after that point will behave as if the address were an externally owned account, i.e. transaction will be accepted, no processing will be done, and the transaction status will be success.
            // Transactions will do nothing, but you still have to pay the transaction fee. You can even transfer ether. It will be locked forever or until someone finds one of the private keys associated with that address.
            selfdestruct(seller);
        }
    }
}