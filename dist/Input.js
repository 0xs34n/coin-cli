"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const elliptic_1 = require("elliptic");
const ec = new elliptic_1.default.ec("secp256k1");
class Input {
    verifySignature() {
        const inputHash = crypto
            .createHash("sha256")
            .update(this.txHash + this.txIndex + this.amount + this.fromAddress)
            .digest("hex");
        const key = ec.keyFromPublic(this.fromAddress, "hex");
        return key.verify(inputHash, this.signature);
    }
}
exports.default = Input;
//# sourceMappingURL=Input.js.map