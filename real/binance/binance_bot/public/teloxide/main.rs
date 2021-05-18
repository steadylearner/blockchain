// TODO
// Bot image
// Bot description etc

// Setup .env with this.

// https://github.com/passcod/cargo-watch
// $cargo install cargo-watch

// $cargo new binance_bot

// https://github.com/killercup/cargo-edit
// https://github.com/dotenv-rs/dotenv
// $cargo add dotenv dotenv_codegen

// #[macro_use]
// extern crate dotenv_codegen;

// fn main() {
//   let telegram = dotenv!("TELOXIDE_TOKEN");

//   println!("{}", &telegram);
// }

// Minimum exmaple from https://github.com/teloxide/teloxide

extern crate dotenv;

use dotenv::dotenv;
use std::env;

use teloxide::prelude::*;

#[tokio::main]
async fn main() {
    run().await;
}

async fn run() {
  dotenv().ok(); // Read .env and set env variables with this

  teloxide::enable_logging!();
  log::info!("Starting dices_bot...");

  let bot = Bot::from_env().auto_send();

  teloxide::repl(bot, |message| async move {
    println!("dice");
    message.answer_dice().await?;
    respond(())
  })
  .await;
  // INFO  binance_bot > Starting dices_bot...
}
