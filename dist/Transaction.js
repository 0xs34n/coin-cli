"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
class Transaction {
    constructor(type, inputs, outputs) {
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
    get inputTotal() {
        return this.inputs.reduce((total, input) => total + input.amount, 0);
    }
    get outputTotal() {
        return this.outputs.reduce((total, output) => total + output.amount, 0);
    }
    get fee() {
        return this.inputTotal - this.outputTotal;
    }
    verifyInputSignatures() {
        return this.inputs.every(input => input.verifySignature());
    }
    isInputsMoreThanOutputs() {
        return this.inputTotal >= this.outputTotal;
    }
    equals(tx) {
        return (this.type === tx.type &&
            this.inputs.equals(tx.inputs) &&
            this.outputs.equals(tx.outputs) &&
            this.hash === tx.hash);
    }
    hashCode() {
        return parseInt(String(parseInt(this.hash, 10)), 32);
    }
}
exports.default = Transaction;
//# sourceMappingURL=Transaction.js.map