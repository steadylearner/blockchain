use binance::{api::*, market::*};
use std::error::Error;
use teloxide::{prelude::*, utils::command::BotCommand};

#[derive(BotCommand)]
#[command(rename = "lowercase", description = "These commands are supported:")]
enum Command {
    #[command(description = "Show ETH Price")]
    ETH,
}

async fn answer(
    cx: UpdateWithCx<AutoSend<Bot>, Message>,
    command: Command,
) -> Result<(), Box<dyn Error + Send + Sync>> {
    let market: Market = Binance::new(None, None);
    match command {
        Command::ETH => {
            let pair: String = "ETHUSDT".to_string();
            match market.get_average_price(pair) {
                Ok(answer) => println!("{:?}", answer),
                Err(e) => println!("Error: {:?}", e),
            };
            cx.answer("Test").await?
        }
    };

    Ok(())
}

#[tokio::main]
async fn main() {
    run().await;
}

async fn run() {
    teloxide::enable_logging!();
    log::info!("Starting...");

    let bot = Bot::new("160175....").auto_send(); // I used my bot

    let bot_name: String = "binance_bot".into();
    teloxide::commands_repl(bot, bot_name, answer).await;
}