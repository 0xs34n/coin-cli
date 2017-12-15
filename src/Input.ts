import * as crypto from "crypto";
import EC from "elliptic";
const ec = new EC.ec("secp256k1");

interface InputInterface {
  readonly txHash: string;
  readonly txIndex: number;
  readonly amount: number;
  readonly address: string;
  readonly signature: string;

  verifySignature(): boolean;
}

class Input implements InputInterface {
  public readonly txHash: string;
  public readonly txIndex: number;
  public readonly amount: number;
  public readonly address: string;
  private _signature: string;

  constructor(
    txIndex: number,
    txHash: string,
    amount: number,
    address: string
  ) {
    this.txIndex = txIndex;
    this.txHash = txHash;
    this.amount = amount;
    this.address = address;
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

  verifySignature(): boolean {
    const inputHash = crypto
      .createHash("sha256")
      .update(this.txHash + this.txIndex + this.amount + this.address)
      .digest("hex");
    const key = ec.keyFromPublic(this.address, "hex");
    return key.verify(inputHash, this.signature);
  }

  sign(secretKey) {
    const key = ec.keyFromPrivate(secretKey);
    const signature = key.sign(this.hash).toDER();

    this._signature = signature;
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
}

export default Input;
