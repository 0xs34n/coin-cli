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

  isInputsMoreThanOutputs(): boolean {
    return this.inputTotal >= this.outputTotal;
  }
  
  verifyInputSignatures(): boolean {
    return this.inputs.every(input => input.verifySignature());
  }

  hasEqualInputs(tx): boolean {
    return tx.inputs.some(input => this.inputs.some(i => i.equals(input)));
  }

  isValidTransaction(): boolean {
    const isValidBalance = this.isInputsMoreThanOutputs();
    const isValidSignatures = this.verifyInputSignatures();
    return isValidBalance && isValidSignatures;
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
}

export default Transaction;
