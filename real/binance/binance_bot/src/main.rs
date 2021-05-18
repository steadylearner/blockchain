extern crate dotenv;

#[macro_use]
extern crate dotenv_codegen;

use dotenv::dotenv;
use std::env;

use teloxide::prelude::*;

use binance::api::*;
use binance::market::*;
use binance::account::*;

// cargo watch -x "run -- --release"
// cargo watch -x check
#[tokio::main]
async fn main() {
    run().await;
}

async fn run() {
  dotenv().ok(); // Read .env(TELOXIDE_TOKEN) and set env variables with this

  teloxide::enable_logging!();
  log::info!("Starting binance_bot...");
  let bot = Bot::from_env().auto_send();

  let binance_api = dotenv!("BINANCE_API");
  let binance_secret = dotenv!("BINANCE_SECRET");

  let market: Market = Binance::new(None, None);
  let account: Account = Binance::new(Some(binance_api.into()), Some(binance_secret.into()));

  match market.get_price("BTCUSDT") {
      Ok(answer) => println!("{:#?}", answer),
      Err(e) => println!("Error: {:#?}", e),
  }
  match account.get_account() {
    Ok(information) => println!("{:#?}", information.balances),
    Err(e) => println!("Error: {:#?}", e),
  }
  
  teloxide::repl(bot, |message| async move {
    message.answer_dice().await?;
    respond(())
  })
  .await;
}

