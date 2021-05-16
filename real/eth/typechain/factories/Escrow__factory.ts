/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, PayableOverrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { Escrow } from "../Escrow";

export class Escrow__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<Escrow> {
    return super.deploy(overrides || {}) as Promise<Escrow>;
  }
  getDeployTransaction(
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Escrow {
    return super.attach(address) as Escrow;
  }
  connect(signer: Signer): Escrow__factory {
    return super.connect(signer) as Escrow__factory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Escrow {
    return new Contract(address, _abi, signerOrProvider) as Escrow;
  }
}

const _abi = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [],
    name: "Aborted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "ItemReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "PurchaseConfirmed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "SellerRefunded",
    type: "event",
  },
  {
    inputs: [],
    name: "abort",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "buyer",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "confirmPurchase",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "confirmReceived",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "end",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "refundSeller",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "seller",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "state",
    outputs: [
      {
        internalType: "enum Escrow.State",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "value",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405233600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506002346200005491906200010f565b6000819055503460005460026200006c919062000147565b14620000af576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000a690620000dc565b60405180910390fd5b62000239565b6000620000c4601583620000fe565b9150620000d18262000210565b602082019050919050565b60006020820190508181036000830152620000f781620000b5565b9050919050565b600082825260208201905092915050565b60006200011c82620001a8565b91506200012983620001a8565b9250826200013c576200013b620001e1565b5b828204905092915050565b60006200015482620001a8565b91506200016183620001a8565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156200019d576200019c620001b2565b5b828202905092915050565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f56616c75652068617320746f206265206576656e2e0000000000000000000000600082015250565b61102680620002496000396000f3fe6080604052600436106100865760003560e01c806373fac6f01161005957806373fac6f014610123578063c19d93fb1461013a578063c7981b1b14610165578063d69606971461017c578063efbe1c1c1461018657610086565b806308551a531461008b57806335a063b4146100b65780633fa4f245146100cd5780637150d8ae146100f8575b600080fd5b34801561009757600080fd5b506100a061019d565b6040516100ad9190610d3d565b60405180910390f35b3480156100c257600080fd5b506100cb6101c3565b005b3480156100d957600080fd5b506100e26103ff565b6040516100ef9190610df3565b60405180910390f35b34801561010457600080fd5b5061010d610405565b60405161011a9190610d3d565b60405180910390f35b34801561012f57600080fd5b5061013861042b565b005b34801561014657600080fd5b5061014f610668565b60405161015c9190610d58565b60405180910390f35b34801561017157600080fd5b5061017a61067b565b005b6101846108c5565b005b34801561019257600080fd5b5061019b610af6565b005b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610253576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161024a90610db3565b60405180910390fd5b600080600381111561028e577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600260149054906101000a900460ff1660038111156102d6577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14610316576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161030d90610d93565b60405180910390fd5b7f72c874aeff0b183a56e2b79c71b46e1aed4dee5e09862134b8821ba2fddbf8bf60405160405180910390a16003600260146101000a81548160ff0219169083600381111561038e577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b0217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc479081150290604051600060405180830381858888f193505050501580156103fb573d6000803e3d6000fd5b5050565b60005481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146104bb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104b290610d73565b60405180910390fd5b60018060038111156104f6577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600260149054906101000a900460ff16600381111561053e577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b1461057e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161057590610d93565b60405180910390fd5b7fe89152acd703c9d8c7d28829d443260b411454d45394e7995815140c8cbcbcf760405160405180910390a160028060146101000a81548160ff021916908360038111156105f5577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b0217905550600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6000549081150290604051600060405180830381858888f19350505050158015610664573d6000803e3d6000fd5b5050565b600260149054906101000a900460ff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461070b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161070290610db3565b60405180910390fd5b6002806003811115610746577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600260149054906101000a900460ff16600381111561078e577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b146107ce576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107c590610d93565b60405180910390fd5b7ffda69c32bcfdba840a167777906b173b607eb8b4d8853b97a80d26e613d858db60405160405180910390a16003600260146101000a81548160ff02191690836003811115610846577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b0217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc60005460036108969190610e1f565b9081150290604051600060405180830381858888f193505050501580156108c1573d6000803e3d6000fd5b5050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610956576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161094d90610dd3565b60405180910390fd5b6000806003811115610991577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600260149054906101000a900460ff1660038111156109d9577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14610a19576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a1090610d93565b60405180910390fd5b6000546002610a289190610e1f565b341480610a3457600080fd5b7fd5d55c8a68912e9a110618df8d5e2e83b8d83211c57a8ddd1203df92885dc88160405160405180910390a133600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600260146101000a81548160ff02191690836003811115610aed577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b02179055505050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b86576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b7d90610db3565b60405180910390fd5b6003806003811115610bc1577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600260149054906101000a900460ff166003811115610c09577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14610c49576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c4090610d93565b60405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b610c8d81610e79565b82525050565b610c9c81610ec8565b82525050565b6000610caf601983610e0e565b9150610cba82610f38565b602082019050919050565b6000610cd2600e83610e0e565b9150610cdd82610f61565b602082019050919050565b6000610cf5601a83610e0e565b9150610d0082610f8a565b602082019050919050565b6000610d18601b83610e0e565b9150610d2382610fb3565b602082019050919050565b610d3781610ebe565b82525050565b6000602082019050610d526000830184610c84565b92915050565b6000602082019050610d6d6000830184610c93565b92915050565b60006020820190508181036000830152610d8c81610ca2565b9050919050565b60006020820190508181036000830152610dac81610cc5565b9050919050565b60006020820190508181036000830152610dcc81610ce8565b9050919050565b60006020820190508181036000830152610dec81610d0b565b9050919050565b6000602082019050610e086000830184610d2e565b92915050565b600082825260208201905092915050565b6000610e2a82610ebe565b9150610e3583610ebe565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615610e6e57610e6d610eda565b5b828202905092915050565b6000610e8482610e9e565b9050919050565b6000819050610e9982610fdc565b919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6000610ed382610e8b565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7f4f6e6c792062757965722063616e2063616c6c20746869732e00000000000000600082015250565b7f496e76616c69642073746174652e000000000000000000000000000000000000600082015250565b7f4f6e6c792073656c6c65722063616e2063616c6c20746869732e000000000000600082015250565b7f53656c6c65722073686f756c646e27742063616c6c20746869732e0000000000600082015250565b60048110610fed57610fec610f09565b5b5056fea264697066735822122097f408346bb29b8247c98cb4976c171987f45758a092701115b8aea8c9f6c18264736f6c63430008030033";
