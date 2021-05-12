// https://substrate.dev/substrate-contracts-workshop/#/0/setup
// https://brew.sh/
// https://gist.github.com/nrubin29/bea5aa83e8dfa91370fe83b62dad6dfa

// brew erros at macbook air m1
// Use these.
// $rm -fr $(brew --repo homebrew/core)  # because you can't `brew untap homebrew/core`
// $brew tap homebrew/core

// => Use this manually instead 

// homebrew-fatal-early-eof

// ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
// $brew doctor

// then it failed.

// cd /opt/homebrew/library/taps/homebrew

// sudo rmdir homebrew-core

// git clone https://github.com/Homebrew/homebrew-core /opt/Homebrew/Library/Taps/homebrew/homebrew-core --depth=1

// Intel
// $git clone https://github.com/Homebrew/homebrew-core /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core --depth=1

// M1
// $git clone https://github.com/Homebrew/homebrew-core /opt/homebrew/Library/Taps/homebrew/homebrew-core --depth=1

// Your system is ready to brew

// When install something it shows this error. But, it will work anyway.
// Error: 
//   homebrew-core is a shallow clone.
// To `brew update`, first run:
//   git -C /opt/homebrew/Library/Taps/homebrew/homebrew-core fetch --unshallow

// Equal to metamask? https://polkadot.js.org/extension/
// $canvas --dev --tmp (dev locally)
// No need to make UI with canvas? (https://paritytech.github.io/canvas-ui)

#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod flipper {

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct Flipper {
        /// Stores a single `bool` value on the storage.
        value: bool,
    }

    impl Flipper {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(init_value: bool) -> Self {
            Self { value: init_value }
        }

        /// Constructor that initializes the `bool` value to `false`.
        ///
        /// Constructors can delegate to other constructors.
        #[ink(constructor)]
        pub fn default() -> Self {
            Self::new(Default::default())
        }

        /// A message that can be called on instantiated contracts.
        /// This one flips the value of the stored `bool` from `true`
        /// to `false` and vice versa.
        #[ink(message)]
        pub fn flip(&mut self) {
            self.value = !self.value;
        }

        /// Simply returns the current value of our `bool`.
        #[ink(message)]
        pub fn get(&self) -> bool {
            self.value
        }
    }

    /// Unit tests in Rust are normally defined within such a `#[cfg(test)]`
    /// module and test functions are marked with a `#[test]` attribute.
    /// The below code is technically just normal Rust code.
    #[cfg(test)]
    mod tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;

        /// Imports `ink_lang` so we can use `#[ink::test]`.
        use ink_lang as ink;

        /// We test if the default constructor does its job.
        #[ink::test]
        fn default_works() {
            let flipper = Flipper::default();
            assert_eq!(flipper.get(), false);
        }

        /// We test a simple use case of our contract.
        #[ink::test]
        fn it_works() {
            let mut flipper = Flipper::new(false);
            assert_eq!(flipper.get(), false);
            flipper.flip();
            assert_eq!(flipper.get(), true);
        }
    }
}
