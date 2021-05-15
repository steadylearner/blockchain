#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

// Start a project with $cargo contract <name>
// $cargo c to download packages to your project.
// Build a proejct with $cargo contract build and only target/ink/<name>.contract matters.
// Run canvas node locally with $canvas --dev --tmp and visit https://paritytech.github.io/canvas-ui/#/
// Upload your contract <name> and test its functions.

#[ink::contract]
mod incrementer {
    #[ink(storage)]
    pub struct Incrementer {
        value: i32,
        my_value: ink_storage::collections::HashMap<AccountId, i32>,
    }

    impl Incrementer {
        #[ink(constructor)]
        pub fn new(init_value: i32) -> Self {
            Self {
                value: init_value,
                my_value: ink_storage::collections::HashMap::new(),
            }
        }

        #[ink(constructor)]
        pub fn default() -> Self {
            Self {
                value: 0,
                my_value: Default::default(),
            }
        }

        #[ink(message)]
        pub fn get(&self) -> i32 {
            self.value
        }

        #[ink(message)]
        pub fn inc(&mut self, by: i32) {
            self.value += by;
        }

        #[ink(message)]
        pub fn get_mine(&self) -> i32 {
            self.my_value_or_zero(&self.env().caller())
        }

        #[ink(message)]
        pub fn inc_mine(&mut self, by: i32) {
            let caller = Self::env().caller();
            let my_value = self.my_value_or_zero(&caller);
            self.my_value.insert(caller, my_value + by);
        }

        fn my_value_or_zero(&self, of: &AccountId) -> i32 {
            *self.my_value.get(of).unwrap_or(&0)
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        use ink_lang as ink;

        #[ink::test]
        fn default_works() {
            let contract = Incrementer::default();
            assert_eq!(contract.get(), 0);
        }

        #[ink::test]
        fn it_works() {
            let mut contract = Incrementer::new(42);
            assert_eq!(contract.get(), 42);
            contract.inc(5);
            assert_eq!(contract.get(), 47);
            contract.inc(-50);
            assert_eq!(contract.get(), -3);
        }

        #[ink::test]
        fn my_value_works() {
            let mut contract = Incrementer::new(11);
            assert_eq!(contract.get(), 11);
            assert_eq!(contract.get_mine(), 0);
            contract.inc_mine(5);
            assert_eq!(contract.get_mine(), 5);
            contract.inc_mine(10);
            assert_eq!(contract.get_mine(), 15);
        }
    }
}

// HashMap Entry API
// https://doc.rust-lang.org/beta/std/collections/hash_map/enum.Entry.html

// upsert

// let caller = self.env().caller();
// self.my_number_map
//     .entry(caller)
//     .and_modify(|old_value| *old_value += by)
//     .or_insert(by);

// owner

// pub struct Hashmap {
//     owner: AccountId, // msg.sender at eth
// }

// impl MyContract {
//     #[ink(constructor)]
//     pub fn new() -> Self {
//         Self {
//             owner: Self::env().caller(); // msg.sender at eth
//         }
//     }
// }