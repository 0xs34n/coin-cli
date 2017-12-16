const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Wallet {
  private readonly keyPair = ec.genKeyPair();
  private readonly password: string;

  constructor(password) {
    this.password = password;
  }

  get publicKey() {
    return this.keyPair.getPublic("hex");
  }

  getPrivateKey(password) {
    if (password === this.password) {
      return this.keyPair.getPrivate("hex");
    } else {
      throw `Incorrect wallet password`;
    }
  }
}


export default Wallet;