import Transaction from "./Transaction";
import { List, Map } from "immutable";

interface Block {
  readonly index: number;
  readonly previousHash: string;
  readonly timestamp: number;
  readonly transactions: List<Transaction>;
  readonly hash: string;
  readonly nonce: number;
}

export function genesisBlock(): Block {
  return {
    index: 0,
    previousHash: "0",
    timestamp: 1509412270,
    transactions: List(),
    hash: "000a74a688a49ea784f3c7a4548febdc73ba6978691f39ac4a9dd6520cf8e89f",
    nonce: 620
  };
}

export default Block