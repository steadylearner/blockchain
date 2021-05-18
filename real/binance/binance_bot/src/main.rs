extern crate dotenv;

#[macro_use]
extern crate dotenv_codegen;

use dotenv::dotenv;
use std::{env, error::Error};

use teloxide::prelude::*;
use teloxide::utils::command::BotCommand;

use binance::api::*;
use binance::market::*;
use binance::account::*;
// /help
// /username
// /usernameandage
#[derive(BotCommand)]
#[command(rename = "lowercase", description = "These commands are supported:")]
enum Command {
  #[command(description = "display this text.")]
  Help,
  #[command(description = "handle a username.")]
  Username(String),
  #[command(description = "handle a username and an age.", parse_with = "split")]
  UsernameAndAge { username: String, age: u8 },
}

async fn responses_to_command(
    cx: UpdateWithCx<AutoSend<Bot>, Message>,
    command: Command,
) -> Result<(), Box<dyn Error + Send + Sync>> {
    match command {
        Command::Help => cx.answer(Command::descriptions()).send().await?,
        Command::Username(username) => {
            cx.answer(format!("Your username is @{}.", username)).await?
        }
        Command::UsernameAndAge { username, age } => {
            cx.answer(format!("Your username is @{} and age is {}.", username, age)).await?
        }
    };

    Ok(())
}


// cargo watch -x "run -- --release"
// cargo watch -x check
#[tokio::main]
async fn main() {
    run().await;
}

async fn run() {
  dotenv().ok(); // Read .env(TELOXIDE_TOKEN) and set env variables with this

  teloxide::enable_logging!();
  log::info!("Starting the_bot...");

  let bot = Bot::from_env().auto_send();

  // let binance_api = dotenv!("BINANCE_API");
  // let binance_secret = dotenv!("BINANCE_SECRET");

  // let market: Market = Binance::new(None, None);
  // let account: Account = Binance::new(Some(binance_api.into()), Some(binance_secret.into()));

  // match market.get_price("BTCUSDT") {
  //     Ok(answer) => println!("{:#?}", answer),
  //     Err(e) => println!("Error: {:#?}", e),
  // }
  // match account.get_account() {
  //   Ok(information) => println!("{:#?}", information.balances),
  //   Err(e) => println!("Error: {:#?}", e),
  // }

  let bot_name: String = "biannce_bot".into();

  teloxide::commands_repl(bot, bot_name, responses_to_command).await;
}

