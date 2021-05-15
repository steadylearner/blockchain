// Import
const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const { stringToU8a, u8aToHex } = require ('@polkadot/util');


// Construct
const websocketProvider = "wss://rpc.polkadot.io"; // Default ws://127.0.0.1:9944

const wsProvider = new WsProvider(websocketProvider);

(async () => {
    const api = await ApiPromise.create({ provider: wsProvider });
    // Do something
    console.log(api.genesisHash.toHex());

    // The length of an epoch (session) in Babe
    console.log(api.consts.babe.epochDuration.toNumber());

    const ADDR = '5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE';

    // QUERY
    
    // Retrieve the last timestamp
    const now = await api.query.timestamp.now();
    // Retrieve the account balance & nonce via the system module
    const { nonce, data: balance } = await api.query.system.account(ADDR);

    console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`);

    // Retrieve the chain name
    const chain = await api.rpc.system.chain();

    // Retrieve the latest header
    const lastBlockHeader = await api.rpc.chain.getHeader();

    // Log the information
    console.log(`${chain}: last block header #${lastBlockHeader.number} has hash ${lastBlockHeader.hash}`);

    // Subscribe to the new headers
    // await api.rpc.chain.subscribeNewHeads((lastHeader) => {
    //     console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
    // });

    // SUBSCRIBE

    let count = 0;
    // Subscribe to the new headers
    const unsubHeads = await api.rpc.chain.subscribeNewHeads((lastHeader) => {
        console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);

        if (++count === 10) {
            unsubHeads();
        }
    });

    // Subscribe to balance changes for our account
    // const unsub = await api.query.system.account(ADDR, ({ nonce, data: balance }) => {
    //     console.log(`free balance is ${balance.free} with ${balance.reserved} reserved and a nonce of ${nonce}`);
    // });

    // Polkadot: last block header #5057414 has hash 0x83a452a99bdce129055dfaf5a61a6302c7830bb794021edb3d92d7050dfa9780

    // The amount required to create a new account
    // console.log(api.consts.balances.creationFee.toNumber());

    // The amount required per byte on an extrinsic
    // console.log(api.consts.balances.transactionByteFee.toNumber());

    // Subscribe to balance changes for 2 accounts, ADDR1 & ADDR2 (already defined)
    const unsub = await api.query.system.account.multi([ADDR1, ADDR2], (balances) => {
        const [{ data: balance1 }, { data: balance2 }] = balances;

        console.log(`The balances are ${balance1.free} and ${balance2.free}`);
    });

    // DERIVE

    // const unsub = await api.derive.chain.subscribeNewHeads((lastHeader) => {
    //     console.log(`#${lastHeader.number} was authored by ${lastHeader.author}`);
    // });

    // Sign and send a transfer from Alice to Bob
    const txHash = await api.tx.balances
        .transfer(BOB, 12345)
        .signAndSend(alice);

    // Show the hash
    console.log(`Submitted with hash ${txHash}`);

    // KEYRING

    const keyring = new Keyring({ type: 'sr25519' });

    const PHRASE = 'entire material egg meadow latin bargain dutch coral blood melt acoustic thought';

    // Add an account, straight mnemonic
    const newPair = keyring.addFromUri(PHRASE);

    // (Advanced) add an account with a derivation path (hard & soft)
    const newDeri = keyring.addFromUri(`${PHRASE}//hard-derived/soft-derived`);

    // (Advanced, development-only) add with an implied dev seed and hard derivation
    const alice = keyring.addFromUri('//Alice', { name: 'Alice default' });

    // Add our Alice dev account
    const alice = keyring.addFromUri('//Alice', { name: 'Alice default' });

    // Log some info
    console.log(`${alice.meta.name}: has address ${alice.address} with publicKey [${alice.publicKey}]`);

    // Convert message, sign and then verify
    const message = stringToU8a('this is our message');
    const signature = alice.sign(message);
    const isValid = alice.verify(message, signature);

    // Log info
    console.log(`The signature ${u8aToHex(signature)}, is ${isValid ? '' : 'in'}valid`)

    // Create alice (carry-over from the keyring section)
    const alice = keyring.addFromUri('//Alice');

    // Make a transfer from Alice to BOB, waiting for inclusion
    const unsub = await api.tx.balances
        .transfer(BOB, 12345)
        .signAndSend(alice, (result) => {
            console.log(`Current status is ${result.status}`);

            if (result.status.isInBlock) {
                console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
            } else if (result.status.isFinalized) {
                console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
                unsub();
            }
        });

    // PREVIEW TRANSACTION
    
    // construct a transaction
    // const transfer = api.tx.balances.transfer(BOB, 12345);

    // // retrieve the payment info
    // const { partialFee, weight } = await transfer.paymentInfo(alice);

    // console.log(`transaction will have a weight of ${weight}, with ${partialFee.toHuman()} weight fees`);

    // // send the tx
    // transfer.signAndSend(alice, ({ events = [], status }) => { ... });

    // SUDO FOR TEST

    // const sudoKey = await api.query.sudo.key();

    // // Lookup from keyring (assuming we have added all, on --dev this would be `//Alice`)
    // const sudoPair = keyring.getPair(sudoKey);

    // // Send the actual sudo transaction
    // const unsub = await api.tx.sudo
    //     .sudo(
    //         api.tx.balances.setBalance(ADDR, 12345, 678)
    //     )
    //     .signAndSend(sudoPair, (result) => { ... });

    // process.exit(0);
})().catch(err => {
    console.error(err);
});

