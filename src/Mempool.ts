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
    if(transaction.isValidTransaction() && !this.isDoubleSpent(transaction)) {
      this.transactions = this.transactions.add(transaction);
    } else {
      console.error(`Transaction ${transaction} is invalid or double spent`);
    }
  }

  getTransactionsForBlock(): List<Transaction> {
    const transactionsForBlock = this.transactions.take(this.blockSize);
    this.clearTransactions(transactionsForBlock);

    return List(transactionsForBlock);
  }

  isDoubleSpent(transaction: Transaction): boolean {
    return this.transactions.some(tx =>
      tx.inputs.some(input => transaction.hasEqualInputs(input))
    );
  }

  clearTransactions(transactionsToClear: Set<Transaction>) {
    this.transactions = this.transactions.union(transactionsToClear);
  }

  removeTransaction(transaction: Transaction) {
    this.transactions = this.transactions.filter(tx => !tx.equals(transaction));
  }
}

export default Mempool;
