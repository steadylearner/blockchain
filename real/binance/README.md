In this post, you will learn how to make a simple cryptocurrency Telegram chat bot similar to the cover of this post.

The Rust programming language will be used mainly for this post.

[🦀 Why Rust?](https://www.rust-lang.org/)

> Rust is blazingly fast and memory-efficient: with no runtime or garbage collector, it can power performance-critical services, run on embedded devices, and easily integrate with other languages.

While the code used here is very simple, hope it can be helpful to you to start with the language. [You can find code used for this post here.](https://github.com/steadylearner/blockchain/tree/main/real/binance/binance_bot)

We will use [Teloxide](https://github.com/teloxide/teloxide) and [binance-rs](https://github.com/wisespace-io/binance-rs). Please, spend time to read the documentations before you read on.

There are a few Rust Telegram framework but I decided to use Teloxide because you can get help from its authors easily with [its Telegram channel](https://t.me/teloxide).

If you don't have Rust in your machine yet, please follow [the instruction](https://www.rust-lang.org/tools/install) of the official Rust website. 

You can also optionally install [cargo edit](https://github.com/passcod/cargo-watch) and [cargo watch](https://github.com/killercup/cargo-edit) to help you develop better.

```console
$cargo install cargo-edit
$cargo install cargo-watch
```

I referred [it](https://dev.to/olefyrenko/how-to-create-a-telegram-crypto-bot-in-javascript-57cg) before I write this post. If you are familiar with JavaScript, it can be helpful to read that first.

To test this tutorial, you need at least [a Telegram account](https://www.google.com/search?q=how+to+install+telegram).

You can also create an account at [Binance](https://accounts.binance.com/en/register?ref=SQ86TYC5) if you want to use its API more later.

<h2 class="blue">Table of Contents</h2>

1. Set up a Telegram bot with BotFather.
2. Prepare the development environment to use Teloxide and binance-rs.
3. Build your Telegram bot to find a cryptocurrency price with Binance.
4. Conclusion

---

<br />

## 1. Set up Telegram bot with BotFather

To make a Telegram bot, we need to make an API token and set it up. 

First, please visit [the BotFather page](https://web.telegram.org/#/im?p=@BotFather) 

Then, use the `/help` command there. It will show the commands you can use with it.

![botfather commands by /help](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kc7xii37sizt3t8lnyms.png)

There are many of them but you will need only a few to start with.

```console
CREATE, LIST, DELETE
/newbot - create a new bot
/mybots - list your bots
/deletebot - delete a bot

UPDATE META DATA
/setdescription - change bot description
/setabouttext - change bot about info
/setuserpic - change bot profile photo
```

You can start your bot with /newbot command and follow its instruction. Use binance_bot for your botname or use another if you want.

You will have a token if you see the message similar to this. 

![Telegram bot API token from botfather](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/i2pzeq6antt21h743cgs.png)

Save it well and we will use it later at .env file we will make.

Then, you can use `/setuserpic` to save your bot image.

![botfather /setuserpic command](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/r85i2wb4pf7eqvfv0z3m.png)

I used [Binance](https://accounts.binance.com/en/register?ref=SQ86TYC5) image. But, you can use others.

Congratulations, if you could make it to this point, you are ready to write a Telegram bot with whatever programming language.

## 2. Prepare the development environment to use Teloxide and binance-rs

Previously, we could set up a Telegram bot and get a API token to remotely control it with the Rust code we will write. 

In this part, we will install Teloxide and binance-rs crates and set up a minimal development environment.

Use this commands first to start a Rust project.

```console
$cargo new binance_bot
```

This will create a few files in binance_bot folder. Edit your Cargo.toml file in it with this.

```toml
[package]
name = "binance_bot"
version = "0.1.0"
edition = "2018"

[dependencies]
# 1.
dotenv = "0.15.0"
dotenv_codegen = "0.15.0"

# 2. 
teloxide = { version = "0.4", features = ["frunk", "macros", "auto-send"] } 

log = "0.4.8"
pretty_env_logger = "0.4.0"
tokio = { version =  "1.3", features = ["rt-multi-thread", "macros"] }

binance = { git = "https://github.com/wisespace-io/binance-rs.git" }
```

It won't be that different from what REAMD.md file from Teloxide gives you. But, there are some differences you need to know.

**1.** We will use dotenv instead of manually setting TELOXIDE_TOKEN different from the command given by its documentation.

```console
# Unix-like
$ export TELOXIDE_TOKEN=<Your token here>

# Windows
$ set TELOXIDE_TOKEN=<Your token here>
```

**2.** If you don't include **macros** to teloxide features, some of its examples won't work with 'can't find derive macro' etc.

Then, create a .env file with `$touch .env` and include your token to it.

```env
TELOXIDE_TOKEN=<YOUR TOKEN FROM THE PREVIOUS PART>
```

src/main.rs file shoud be made for you already.

Paste this code adapted from the official example to use .env file to it.

```rs
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
```

Use `$cargo run --release` and wait a little bit before the Rust compiler ends its job. 

Then, while it is working at your console, visit your Telegram bot you made and type whatever you want. It will show somewhat similar to this.

![Teloxide dice example](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/clkige681by9r3y5oinp.png)

Hope you could make it. You verified that you can use Teloxide crate in your machine. In the next part, we will use binance-rs along with it. You can edit your main.rs file with this to see binance-rs crate will work at your development environment.

```rs
use binance::api::*;
use binance::market::*;

fn main() {
    let market: Market = Binance::new(None, None);

    // Latest price for ALL symbols
    // match market.get_all_prices() {
    //     Ok(answer) => println!("{:#?}", answer),
    //     Err(e) => println!("Error: {:#?}", e),
    // }

    match market.get_price("BTCUSDT") {
        Ok(answer) => println!("{:#?}", answer),
        Err(e) => println!("Error: {:#?}", e),
    }
}
```

Test the example code above with `$cargo run --release` command. It should show current Bitcoin price for USDT token at your console.

I used Macbook air with M1 chip to compile it. But it failed to compile with arm64 architecture. 

[Search how to use i386 arch instead if you find an issue with it.](https://www.google.com/search?q=how+to+use+i386+in+macbook+air+m1) You can see which arch your machine uses with `$arch`.

## 3. Build a Telegram bot to find a cryptocurrency price with Binance.

In this part, we will modify [the commands example](https://github.com/teloxide/teloxide#commands) from Teloxide.

Please, read and test its code first. Then, you can modify your main.rs file similar to this.

```rs
use dotenv::dotenv;
use std::{env, error::Error};

use teloxide::{payloads::SendMessageSetters, prelude::*};
use teloxide::utils::command::BotCommand;
use teloxide::{utils::markdown::link};
use teloxide::types::ParseMode::MarkdownV2;

use binance::api::*;
use binance::market::*;

fn to_uppercase(string: &str) -> String {
    string.chars().map(|c| c.to_ascii_uppercase()).collect()
}

// Command examples

// /help
// /register
// /price BTC
// /price BTC USDT
// /price btc sudt
// /price BNB BTC
// /price bnb btc
#[derive(BotCommand)]
#[command(rename = "lowercase", description = "These commands are supported:")]
// 1.
enum Command {
  #[command(description = "display this text.")]
  Help,
  #[command(description = "show a Binance sign up page.")]
  Register,
  #[command(description = "show a cryptcurrency price in USDT by default.")]
  Price(String),
}

async fn responses_to_command(
    cx: UpdateWithCx<AutoSend<Bot>, Message>,
    command: Command,
) -> Result<(), Box<dyn Error + Send + Sync>> {
    let market: Market = Binance::new(None, None);

    match command {
        // 1.
        Command::Help => cx.answer(Command::descriptions()).send().await?, 
        // 2.
        Command::Register => {
            let register_link = link("https://accounts.binance.com/en/register?ref=SQ86TYC5", "Don't have a Binance account yet? You can register here\\.");

            cx.answer(register_link).parse_mode(MarkdownV2).send().await?
        },
        // 3.
        Command::Price(crpytocurrency) => {
            let mut iter = crpytocurrency.split_whitespace();

            if let Some(first_crypto_symbol) = iter.next() {

                let second_crypto_symbol = if let Some(second_crypto_symbol) = iter.next() {
                    println!("There was a second_crypto_symbol.");
                    second_crypto_symbol
                } else {
                    println!("There was no second_crypto_symbol. Use default.");
                    "USDT"
                };

                let target = to_uppercase(
                    &format!("{}{}", &first_crypto_symbol, &second_crypto_symbol)
                );

                match market.get_price(target) {
                    Ok(symbol_price) => {
                        println!("{:#?}", &symbol_price);
                        cx.answer(format!("The price you want is {:#?}. ", &symbol_price.price)).await?
                    },
                    Err(e) => {
                        eprint!("{:#?}", e);

                        cx.answer(format!("Something went wrong. Did you use the correct cryptocurrency pair?")).await?
                    },
                }
            } else {
                cx.answer("Cryptocurrency symbols were not specified. To start with, you can use /price ETH or /price ETH USDT.").await?
            }
        }
    };

    Ok(())
}

#[tokio::main]
async fn main() {
    run().await;
}

async fn run() {
    dotenv().ok();

    teloxide::enable_logging!();
    log::info!("Starting the_bot...");

    let bot = Bot::from_env().auto_send();
    let bot_name: String = "binance_bot".into();

    teloxide::commands_repl(bot, bot_name, responses_to_command).await;
}
```

Use **$cargo run --release** and visit your bot.

Type **/help** there, then test a few commands similar to these below.

```
/help
/register

/price BTC
/price BTC USDT
/price btc usdt
/price BNB BTC
/price bnb btc
```

Some of them will show results similar to these.

![Bitcoin Price before](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/u4y1j2u6mad4gklixn54.png)

![Bitcoin Price](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dgss5ffsfbbgau106h6q.png)

(Well, it is interesting to see its historical drop while writing this post. First one is from when I wrote the code for this and the latter is from when I write this post.)

The payloads here will be command relevant parts and others are for set up. So, I will explain them only.

**1.** It shows the description texts you define from `enum Command` part. You need to edit there only.

**2.** It wasn't easy to find how to use markdown with Teloxide by reading its documentation. It will be helpful to know [Telegram](https://core.telegram.org/bots/api#markdownv2-style) wants you to use \\\\ for some characters when you use markdown.

**3.** The user can send various inputs along with /price commands. You can see we can handle them easily with Rust API.

For example, user can send an empty input, input without second cryptocurrency symbol (it is handled by default USDT), input with more than 2 cryptocurrency symbols etc.

You could find the beauty of the Rust language if you thought the code to handle this with other programming languages.

If you have any question with the Teloxide, you can refer to [its documenation](https://docs.rs/teloxide/0.4.0/teloxide/).

<br />

## 4. Conclusion

In this post, we learnt how to set up Rust env to use Teloxide framework, hope you can make all of this part work without any issue. I included many images to help you follow the example better.

If you are familiar with Binance, you can write more commands to use its account relevant API also.

If you liked the post, please share it with others. I am plan to share more blockchain relevant stuffs. I am interested in ETH and POLKADOT.

I will write a blog post to deploy this if many people find this post useful.

Thanks.