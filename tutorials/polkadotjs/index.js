// Import
const { ApiPromise, WsProvider } = require('@polkadot/api');

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

    // process.exit(0);
})().catch(err => {
    console.error(err);
});

