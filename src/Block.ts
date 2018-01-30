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

export default Block;