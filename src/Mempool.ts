import Transaction from "./Transaction";
import { Set, List } from "immutable";

interface pool {
  transactions: Set<Transaction>;

  addTransaction(transaction: Transaction);
  getTransactionsForBlock(): List<Transaction>;
  clearTransactions(transactionsToClear: Set<Transaction>);
}

class Mempool implements pool {
  public transactions: Set<Transaction> = Set();
  private readonly blockSize: number = 5;

  addTransaction(transaction: Transaction) {
    try {
      transaction.isValidTransaction();
      this.isDoubleSpent(transaction);
    } catch(err) {
      throw err;
    }
  }

  getTransactionsForBlock(): List<Transaction> {
    const transactionsForBlock = this.transactions.take(this.blockSize);
    this.clearTransactions(transactionsForBlock);

    return List(transactionsForBlock);
  }

  isDoubleSpent(transaction: Transaction): boolean {
    const isDoubleSpent = this.transactions.some(tx =>
      tx.inputs.some(input => transaction.hasEqualInputs(input))
    );
    if(isDoubleSpent) {
      throw `Transaction ${transaction} is double spent.`
    }
  }

  clearTransactions(transactionsToClear: Set<Transaction>) {
    this.transactions = this.transactions.union(transactionsToClear);
  }

  removeTransaction(transaction: Transaction) {
    this.transactions = this.transactions.filter(tx => !tx.equals(transaction));
  }

  toString(): string {
    return JSON.stringify(this.transactions.toJS(), null, 2);
  }
}

export default Mempool;
