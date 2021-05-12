/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface TopsInterface extends ethers.utils.Interface {
  functions: {
    "getTops()": FunctionFragment;
    "include(string)": FunctionFragment;
    "owner()": FunctionFragment;
    "remove(uint256)": FunctionFragment;
    "tops(uint256)": FunctionFragment;
    "totalTops()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "getTops", values?: undefined): string;
  encodeFunctionData(functionFragment: "include", values: [string]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "remove",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "tops", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "totalTops", values?: undefined): string;

  decodeFunctionResult(functionFragment: "getTops", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "include", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "remove", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tops", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "totalTops", data: BytesLike): Result;

  events: {};
}

export class Tops extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: TopsInterface;

  functions: {
    getTops(overrides?: CallOverrides): Promise<[string[]]>;

    "getTops()"(overrides?: CallOverrides): Promise<[string[]]>;

    include(
      top: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "include(string)"(
      top: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    "owner()"(overrides?: CallOverrides): Promise<[string]>;

    remove(
      index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "remove(uint256)"(
      index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    tops(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    "tops(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    totalTops(overrides?: CallOverrides): Promise<[BigNumber]>;

    "totalTops()"(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  getTops(overrides?: CallOverrides): Promise<string[]>;

  "getTops()"(overrides?: CallOverrides): Promise<string[]>;

  include(
    top: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "include(string)"(
    top: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  "owner()"(overrides?: CallOverrides): Promise<string>;

  remove(
    index: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "remove(uint256)"(
    index: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  tops(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  "tops(uint256)"(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  totalTops(overrides?: CallOverrides): Promise<BigNumber>;

  "totalTops()"(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    getTops(overrides?: CallOverrides): Promise<string[]>;

    "getTops()"(overrides?: CallOverrides): Promise<string[]>;

    include(top: string, overrides?: CallOverrides): Promise<void>;

    "include(string)"(top: string, overrides?: CallOverrides): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    "owner()"(overrides?: CallOverrides): Promise<string>;

    remove(index: BigNumberish, overrides?: CallOverrides): Promise<void>;

    "remove(uint256)"(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    tops(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    "tops(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    totalTops(overrides?: CallOverrides): Promise<BigNumber>;

    "totalTops()"(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    getTops(overrides?: CallOverrides): Promise<BigNumber>;

    "getTops()"(overrides?: CallOverrides): Promise<BigNumber>;

    include(
      top: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "include(string)"(
      top: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    "owner()"(overrides?: CallOverrides): Promise<BigNumber>;

    remove(
      index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "remove(uint256)"(
      index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    tops(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    "tops(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalTops(overrides?: CallOverrides): Promise<BigNumber>;

    "totalTops()"(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getTops(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "getTops()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    include(
      top: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "include(string)"(
      top: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "owner()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    remove(
      index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "remove(uint256)"(
      index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    tops(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "tops(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalTops(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "totalTops()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
