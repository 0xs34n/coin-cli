"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
class Mempool {
    constructor() {
        this.transactions = immutable_1.List();
    }
    addTransaction(transaction) {
    }
    getTransactionsForBlock() {
        return immutable_1.List();
    }
    clearTransactions(transactionsToClear) {
    }
}
exports.default = Mempool;
//# sourceMappingURL=Mempool.js.map