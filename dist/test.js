"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const crypto = require("crypto");
class Transaction {
    constructor(type, inputs, outputs) {
        this.type = type;
        this.inputs = inputs;
        this.outputs = outputs;
    }
    get hash() {
        return crypto
            .createHash("sha256")
            .update(this.type +
            JSON.stringify(this.inputs.toJS()) +
            JSON.stringify(this.outputs.toJS()))
            .digest("hex");
    }
    equals(tx) {
        console.log('howbout this');
        console.log(this.type === tx.type, this.inputs.equals(tx.inputs), this.outputs.equals(tx.outputs), this.hash === tx.hash);
        return (this.type === tx.type &&
            this.inputs.equals(tx.inputs) &&
            this.outputs.equals(tx.outputs) &&
            this.hash === tx.hash);
    }
    hashCode() {
        return parseInt(String(parseInt(this.hash, 10)), 32);
    }
}
const tx1 = new Transaction("regular", immutable_1.List([1, 2, 3]), immutable_1.List([4, 5, 6]));
const tx2 = new Transaction("regular", immutable_1.List([1, 2, 3]), immutable_1.List([4, 5, 6]));
const tx3 = new Transaction("regular", immutable_1.List([1, 2, 3]), immutable_1.List([4, 5, 6]));
const tx4 = new Transaction("regular", immutable_1.List([1, 2, 3]), immutable_1.List([4, 5, 6]));
const tx5 = new Transaction("regular", immutable_1.List([1, 2, 3]), immutable_1.List([4, 5, 6]));
const tx6 = new Transaction("regular", immutable_1.List([1, 2, 3]), immutable_1.List([4, 5, 6]));
const listOfTx = immutable_1.List([tx1, tx2, tx3]);
const listOfTx2 = immutable_1.List([tx4, tx5, tx6]);
console.log(listOfTx.equals(listOfTx2));
//# sourceMappingURL=test.js.map