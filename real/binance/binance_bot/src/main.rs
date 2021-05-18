// TODO
// Include more commands.
// Read more https://github.com/teloxide/teloxide, https://github.com/wisespace-io/binance-rs

extern crate dotenv;

#[macro_use]
extern crate dotenv_codegen;

use dotenv::dotenv;
use std::{env, error::Error};

use teloxide::prelude::*;
use teloxide::utils::command::BotCommand;

use binance::api::*;
use binance::market::*;
// use binance::account::*;

fn to_uppercase(string: &str) -> String {
    string.chars().map(|c| c.to_ascii_uppercase()).collect()
}

// /help
// /price BTC
// /price BTC USDT
// /price btc sudt
// /price BNB BTC
// /price bnb btc
#[derive(BotCommand)]
#[command(rename = "lowercase", description = "These commands are supported:")]
enum Command {
  #[command(description = "display this text.")]
  Help,
  #[command(description = "show a cryptcurrency price in USDT by default.")]
  Price(String),
//   #[command(description = "handle a username and an age.", parse_with = "split")]
//   UsernameAndAge { username: String, age: u8 },
}

async fn responses_to_command(
    cx: UpdateWithCx<AutoSend<Bot>, Message>,
    command: Command,
) -> Result<(), Box<dyn Error + Send + Sync>> {
    // let binance_api = dotenv!("BINANCE_API");
    // let binance_secret = dotenv!("BINANCE_SECRET");

    let market: Market = Binance::new(None, None);
    // let account: Account = Binance::new(Some(binance_api.into()), Some(binance_secret.into()));

    // match market.get_price("BTCUSDT") {
    //     Ok(answer) => println!("{:#?}", answer),
    //     Err(e) => println!("Error: {:#?}", e),
    // }

    match command {
        Command::Help => cx.answer(Command::descriptions()).send().await?,
        Command::Price(crpytocurrency) => {
            let mut iter = crpytocurrency.split_whitespace();

            // println!("{:#?}", &iter);

            // SplitWhitespace {
            //     inner: Filter {
            //         iter: Split(
            //             SplitInternal {
            //                 start: 0,
            //                 end: 8,
            //                 matcher: CharPredicateSearcher {
            //                     haystack: "ETH USDT",
            //                     char_indices: CharIndices {
            //                         front_offset: 0,
            //                         iter: Chars([
            //                             'E',
            //                             'T',
            //                             'H',
            //                             ' ',
            //                             'U',
            //                             'S',
            //                             'D',
            //                             'T',
            //                         ]),
            //                     },
            //                 },
            //                 allow_trailing_empty: true,
            //                 finished: false,
            //             },
            //         ),
            //     },
            // }

            if let Some(first_crypto_symbol) = iter.next() {

                let second_crypto_symbol = if let Some(second_crypto_symbol) = iter.next() {
                    println!("There was second_crypto_symbol.");
                    second_crypto_symbol
                } else {
                    println!("There was no second_crypto_symbol. Use default.");
                    "USDT"
                };
                // We won't iter anymore so we don't need to handle the third symbol(characters)

                let target = to_uppercase(
                    &format!("{}{}", &first_crypto_symbol, &second_crypto_symbol)
                );

                match market.get_price(target) {
                    Ok(symbol_price) => {
                        println!("{:#?}", &symbol_price); // Use log instead? log::info!(&symbol_price);
                        // cx.answer(format!("The price you want is {:#?}.", &symbol_price.price)).await?
                        cx.answer(format!("The price you want is {:#?}. ", &symbol_price.price)).await?
                    },
                    Err(e) => {
                        eprint!("{:#?}", e); // Use log instead? log::error!(e);

                        cx.answer(format!("Something went wrong. Did you use the correct cryptocurrency pair?")).await?
                    },
                }
            } else {
                cx.answer("Cryptocurrency symbols were not specified. To start with, you can use /price ETH USD.").await?
                // Without the code above, Teloxide shows this error internally.
                // ERROR teloxide::error_handlers > Error: ApiError { kind: MessageTextIsEmpty, status_code: 400 }
            }
        }

        // Command::UsernameAndAge { username, age } => {
        //     cx.answer(format!("Your username is @{} and age is {}.", username, age)).await?
        // }
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
    let bot_name: String = "biannce_bot".into();

    teloxide::commands_repl(bot, bot_name, responses_to_command).await;
}
