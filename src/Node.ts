import { List, Set } from "immutable";
import Blockchain from "./Blockchain";
import Mempool from "./Mempool";
import Wallet from "./Wallet";
import Payment from "./Payment";
import Peer from "./Peer";
import Input from "./Input";
import Output from "./Output";
import Transaction from "./Transaction";

class Node {
  public readonly blockchain: Blockchain = new Blockchain();
  public readonly mempool: Mempool = new Mempool();
  public wallet: Wallet;
  private readonly reward: number = 100;

  newWallet(password: string) {
    this.wallet = new Wallet(password);
  }

  mine(address: string = this.wallet.publicKey) {
    const regTxs: List<Transaction> = this.mempool.getTransactionsForBlock();
    const rewardTx: Transaction = this.rewardTransaction(address);
    let txs: List<Transaction> = regTxs.push(rewardTx);
    try {
      const feeTx: Transaction = this.getFeeTransaction(regTxs, address);
      txs = txs.push(feeTx);
    } catch(e) {
      // log error but not fatal ?
    } finally {
      const nextBlock = this.blockchain.generateNextBlock(txs);
      try {
        this.blockchain.addBlock(nextBlock);
      } catch (e) {
        throw e;
      }
    }
  }

  getBalance(address: string = this.wallet.publicKey): number {
    const inputs = this.getUnspentInputs();
    const inputsForAddress = inputs.filter(input => input.address === address);
    return inputsForAddress.reduce((total, input) => total + input.amount, 0);
  }

  createTransaction(payments: List<Payment>, password: string): Transaction {
    const paidTotal = payments.reduce((total, paid) => total + paid.amount, 0);
    const fee = payments.reduce((total, payment) => total + payment.fee, 0);
    const unspentInputs: List<Input> = this.getUnspentInputs();

    let inputTotal: number = 0;
    let inputs: List<Input> = unspentInputs.takeUntil(output => {
      if (inputTotal < paidTotal + fee ) {
        inputTotal = inputTotal + output.amount;
        return false;
      } else {
        return true;
      }
    });

    let outputs: List<Output> = payments.map(payment => ({
      amount: payment.amount,
      address: payment.address
    }));
    
    let change = inputTotal - paidTotal - fee;
    if (change > 0) {
      const changeOutput = { amount: change, address: this.wallet.publicKey };
      outputs = outputs.push(changeOutput);
    }

    try {
      inputs = this.signInputs(inputs, password);
      return new Transaction("regular", inputs, outputs);
    } catch (err) {
      throw `Failed to create transactions: ${err}`;
    }
  }

  signInputs(inputs: List<Input>, password: string): List<Input> {
    try {
      const privateKey = this.wallet.getPrivateKey(password);
      return inputs.map(input => {
        input.sign(privateKey);
        return input;
      });
    } catch (err) {
      throw `Error signing inputs ${inputs}: ${err}`;
    }
  }

  // helper
  getUnspentInputs(): List<Input> {
    let inputs = this.getInputs();
    let outputs = this.getOutputs();
    const unspentOutputs = outputs.filterNot(output => inputs.includes(output));
    
    return unspentOutputs;
  }

  // helper
  getInputs(): List<Input> {
    let inputs = List();
    this.blockchain.chain.forEach(block => {
      block.transactions.forEach(transaction => {
        transaction.inputs.forEach(input => {
          if (input.address === this.wallet.publicKey) {
            inputs = inputs.push(input);
          }
        });
      });
    });
    return inputs;
  }

  // helper
  getOutputs(): List<Input> {
    let outputs = List();
    this.blockchain.chain.forEach(block => {
      block.transactions.forEach((tx, i) => {
        tx.outputs.forEach(output => {
          if (output.address === this.wallet.publicKey) {
            let input = new Input(i, tx.hash, output.amount, output.address);
            outputs = outputs.push(input);
          }
        });
      });
    });
    return outputs;
  }

  getFeeTransaction(regTxs: List<Transaction>, address: string): Transaction {
    const totalFee = regTxs.reduce((total, transaction) => {
      return total + transaction.fee;
    }, 0);
    if(totalFee > 0) {
      const outputs: List<Output> = List([{ address, amount: totalFee }]);
      return new Transaction("fee", List(), outputs);
    } else {
     throw "No fees in Transaction.";
    }
  }

  rewardTransaction(address: string): Transaction {
    const outputs: List<Output> = List([{ address, amount: this.reward }]);
    return new Transaction("reward", List(), outputs);
  }
}

export default Node;
