import * as crypto from "crypto";
import Base58 from "./Base58";
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Input {
  public readonly txHash: string;
  public readonly txIndex: number;
  public readonly amount: number;
  public readonly address: string;
  private _signature: string;

  constructor(
    txIndex: number,
    txHash: string,
    amount: number,
    address: string,
    signature?: string
  ) {
    this.txIndex = txIndex;
    this.txHash = txHash;
    this.amount = amount;
    this.address = address;
    if (signature) this._signature = signature;
  }

  get signature() {
    return this._signature;
  }

  get hash(): string {
    return crypto
      .createHash("sha256")
      .update(this.txHash + this.txIndex + this.amount + this.address)
      .digest("hex");
  }

  sign(secretKey) {
    const key = ec.keyFromPrivate(secretKey);
    const signature = key.sign(this.hash);

    this._signature = signature.toDER();  
  }

  verifySignature() {
    const inputHash = crypto
      .createHash("sha256")
      .update(this.txHash + this.txIndex + this.amount + this.address)
      .digest("hex");
    const key = ec.keyFromPublic(Base58.decodeAddress(this.address), "hex");
    if (!key.verify(inputHash, this.signature)) {
      throw `Input ${this} has wrong signature.`;
    }
  }

  equals(input: Input): boolean {
    return (
      this.txIndex === input.txIndex &&
      this.txHash === input.txHash &&
      this.amount === input.amount &&
      this.address === input.address
    );
  }

  hashCode(input: Input): number {
    return parseInt(String(parseInt(this.hash, 10)), 32);
  }

  static fromJS(json): Input {
    const { txIndex, txHash, amount, address, _signature } = json;
    const input = new Input(txIndex, txHash, amount, address, _signature);
    return input;
  }
}

export default Input;