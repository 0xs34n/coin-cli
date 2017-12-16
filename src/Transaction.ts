import Input from "./Input";
import Output from "./Output";
import { List } from "immutable";
import * as crypto from "crypto";

interface TransactionInterface {
  readonly type: "regular" | "fee" | "reward";
  readonly inputs: List<Input>;
  readonly outputs: List<Output>;
  readonly hash: string;
  readonly fee: number;
}

class Transaction implements TransactionInterface {
  public readonly type: "regular" | "fee" | "reward";
  public readonly inputs: List<Input>;
  public readonly outputs: List<Output>;
  public static readonly reward: number = 100;

  constructor(
    type: "regular" | "fee" | "reward",
    inputs: List<Input>,
    outputs: List<Output>
  ) {
    this.type = type;
    this.inputs = inputs;
    this.outputs = outputs;
  }

  get hash() {
    const inputs = JSON.stringify(this.inputs.toJS());
    const outputs = JSON.stringify(this.outputs.toJS());

    return crypto
      .createHash("sha256")
      .update(this.type + inputs + outputs)
      .digest("hex");
  }

  get inputTotal(): number {
    return this.inputs.reduce((total, input) => total + input.amount, 0);
  }

  get outputTotal(): number {
    return this.outputs.reduce((total, output) => total + output.amount, 0);
  }

  get fee(): number {
    return this.inputTotal - this.outputTotal;
  }

  isInputsMoreThanOutputs() {
    const inputTotal = this.inputTotal;
    const outputTotal = this.outputTotal;

    if (inputTotal < outputTotal) {
      throw `Insufficient balance: inputs ${inputTotal} < outputs ${outputTotal}`;
    }
  }

  verifyInputSignatures() {
    try {
      this.inputs.forEach(input => input.verifySignature());
    } catch (err) {
      throw err;
    }
  }

  hasEqualInputs(tx): boolean {
    return tx.inputs.some(input => this.inputs.some(i => i.equals(input)));
  }

  isValidTransaction(): boolean {
    try {
      this.isInputsMoreThanOutputs();
      this.verifyInputSignatures();
      return true;
    } catch (err) {
      throw err;
    }
  }

  equals(tx): boolean {
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

  feeTransaction(address: string) {
    const inputTotal = this.inputTotal;
    const outputTotal = this.outputTotal;

    if (inputTotal > outputTotal) {
      const fee = inputTotal - outputTotal;
      const outputs: List<Output> = List([{ address, amount: fee }]);
      return new Transaction("fee", List(), outputs);
    } else {
      throw `No fees for transaction`;
    }
  }

  static rewardTransaction(address: string) {
    const outputs: List<Output> = List([
      { address, amount: Transaction.reward }
    ]);
    return new Transaction("reward", List(), outputs);
  }
}

export default Transaction;
