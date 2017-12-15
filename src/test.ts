import { List } from "immutable";
import * as crypto from "crypto";

class Transaction {
  public readonly type: "regular" | "fee" | "reward";
  public readonly inputs: List<number>;
  public readonly outputs: List<number>;

  constructor(
    type: "regular" | "fee" | "reward",
    inputs: List<any>,
    outputs: List<any>
  ) {
    this.type = type;
    this.inputs = inputs;
    this.outputs = outputs;
  }

  get hash() {
    return crypto
    .createHash("sha256")
    .update(
        this.type +
        JSON.stringify(this.inputs.toJS()) +
        JSON.stringify(this.outputs.toJS())
    )
    .digest("hex");
  }

  equals(tx): boolean {
    console.log('howbout this');
    console.log(this.type === tx.type, this.inputs.equals(tx.inputs), this.outputs.equals(tx.outputs), this.hash === tx.hash)
    return (
      this.type === tx.type &&
      this.inputs.equals(tx.inputs) &&
      this.outputs.equals(tx.outputs) &&
      this.hash === tx.hash
    );
  }

  hashCode(): number {
    return parseInt(String(parseInt(this.hash, 10)), 32);
  }
}

const tx1 = new Transaction("regular", List([1, 2, 3]), List([4, 5, 6]));
const tx2 = new Transaction("regular", List([1, 2, 3]), List([4, 5, 6]));
const tx3 = new Transaction("regular", List([1, 2, 3]), List([4, 5, 6]));

const tx4 = new Transaction("regular", List([1, 2, 3]), List([4, 5, 6]));
const tx5 = new Transaction("regular", List([1, 2, 3]), List([4, 5, 6]));
const tx6 = new Transaction("regular", List([1, 2, 3]), List([4, 5, 6]));

const listOfTx = List([tx1, tx2, tx3]);
const listOfTx2 = List([tx4, tx5, tx6]);

console.log(listOfTx.equals(listOfTx2));
