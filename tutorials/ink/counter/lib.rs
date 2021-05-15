#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

// Start a project with $cargo contract <name>
// $cargo c to download packages to your project.
// Build a proejct with $cargo contract build and only target/ink/<name>.contract matters.
// Run canvas node locally with $canvas --dev --tmp and visit https://paritytech.github.io/canvas-ui/#/
// Upload your contract <name> and test its functions.

#[ink::contract]
mod counter {

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct Counter {
        /// Stores a single `bool` value on the storage.
        value: i64,
    }

    impl Counter {
        /// Constructor that initializes the `i64` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(init_value: i64) -> Self {
            Self { value: init_value }
        }

        /// Constructor that initializes the `init` value to `0`.
        ///
        /// Constructors can delegate to other constructors.
        #[ink(constructor)]
        pub fn default() -> Self {
            Self::new(Default::default())
        }

        #[ink(message)]
        pub fn plus(&mut self) {
            self.value = self.value + 1;
        }

        #[ink(message)]
        pub fn minus(&mut self) {
            self.value = self.value - 1;
        }

        #[ink(message)]
        pub fn set(&mut self, new_value: i64) {
            self.value = new_value;
        }

        #[ink(message)]
        pub fn to_zero(&mut self) {
            self.value = 0i64;
        }

        // #[ink(message)]
        // pub fn min(&mut self) {
        //     self.value = i64::MIN;
        // }

        // #[ink(message)]
        // pub fn max(&mut self) {
        //     self.value = i64::MAX;
        // }

        /// Simply returns the current value of our `i64`.
        #[ink(message)]
        pub fn get(&self) -> i64 {
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
            let counter = Counter::default();
            assert_eq!(counter.get(), 0i64);
        }

        /// We test a simple use case of our contract.
        #[ink::test]
        fn it_works() {
            let mut counter = Counter::new(0i64);

            assert_eq!(counter.get(), 0i64);
            counter.plus();
            assert_eq!(counter.get(), 1i64);
            counter.minus();
            assert_eq!(counter.get(), 0i64);
            counter.set(10i64);
            assert_eq!(counter.get(), 10i64);
            counter.to_zero();
            assert_eq!(counter.get(), 0i64);
            // counter.max();
            // assert_eq!(counter.get(), i64::MAX);
            // counter.min();
            // assert_eq!(counter.get(), i64::MIN);
        }
    }
}
