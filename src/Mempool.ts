import Transaction from "./Transaction";
import { Set, List } from "immutable";

class Mempool {
  public transactions: Set<Transaction> = Set();
  private readonly blockSize: number = 5;

  addTransaction(transaction: Transaction) {
    try {
      transaction.isValidTransaction();
      this.isTransactionDoubleSpent(transaction);
      this.transactions = this.transactions.add(transaction);
    } catch (err) {
      throw err;
    }
  }

  getTransactionsForBlock(): List<Transaction> {
    const transactionsForBlock = this.transactions.take(this.blockSize);
    this.clearTransactions(transactionsForBlock);

    return List(transactionsForBlock);
  }

  isTransactionDoubleSpent(transaction: Transaction) {
    if (this.transactions.size !== 0) {
      const isDoubleSpent = this.transactions.some(tx =>
        tx.hasSameInput(transaction)
      );
      if (isDoubleSpent) {
        throw `Transaction ${transaction} is double spent.`;
      }
    }
  }

  clearTransactions(transactionsToClear: Set<Transaction>) {
    this.transactions = this.transactions.subtract(transactionsToClear);
  }

  removeTransaction(transaction: Transaction) {
    this.transactions = this.transactions.filter(tx => !tx.equals(transaction));
  }

  toString(): string {
    return JSON.stringify(this.transactions.toJS(), null, 2);
  }
}

export default Mempool;
