// This fails with m1 chip.
// Use i386
// $arch
// binance = { git = "https://github.com/wisespace-io/binance-rs.git" }
// API with this
// https://www.google.com/search?q=binance+api+key

use binance::api::*;
use binance::market::*;

// cargo watch -x "run -- --release"
// cargo watch -x check
fn main() {
    let market: Market = Binance::new(None, None);

    // Latest price for ALL symbols
    // match market.get_all_prices() {
    //     Ok(answer) => println!("{:#?}", answer),
    //     Err(e) => println!("Error: {:#?}", e),
    // }

    // BNB Coin is a cryptocurrency that is used primarily to pay transaction and trading fees on the Binance exchange
    // // Latest price for ONE symbol
    match market.get_price("BTCUSDT") {
        Ok(answer) => println!("{:#?}", answer),
        Err(e) => println!("Error: {:#?}", e),
    }

    // match market.get_price("BNBBTC") {
    //     Ok(answer) => println!("{:#?}", answer),
    //     Err(e) => println!("Error: {:#?}", e),
    // }

    // match market.get_price("BNBUSDT") {
    //     Ok(answer) => println!("{:#?}", answer),
    //     Err(e) => println!("Error: {:#?}", e),
    // }

    // match market.get_price("BNBETH") {
    //     Ok(answer) => println!("{:#?}", answer),
    //     Err(e) => println!("Error: {:#?}", e),
    // }
}