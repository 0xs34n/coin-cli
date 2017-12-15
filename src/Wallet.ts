const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Wallet {
  public readonly name: string;
  public readonly publicKey: string;
  private readonly _privateKey: string;
  private readonly _password: string

  constructor(name) {
    this.name = name;
    const keyPair = ec.genKeyPair();
    this.publicKey = keyPair.getPublic("hex");
    this._privateKey = keyPair.getPrivate("hex");
  }

  get privateKey() {
    return this._privateKey
  }
}


export default Wallet;