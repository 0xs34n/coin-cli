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
  protected blockchain: Blockchain = new Blockchain();
  protected mempool: Mempool = new Mempool();
  private wallet: Wallet

  newWallet(name) {
    this.wallet = new Wallet(name);
  }

  getBalance(): number {
    const outputs = this.getUnspentInputs();
    const balance = outputs.reduce((total, output) => total + output.amount, 0);
    return balance;
  }

  createTransaction(payments: List<Payment>) {
    const paidTotal = payments.reduce((total, paid) => total + paid.amount, 0);
    const fee = payments.reduce((total, payment) => total + payment.fee, 0);
    const unspentOutputs: List<Input> = this.getUnspentInputs();

    let inputTotal: number;
    let inputs: List<Input> = unspentOutputs.takeUntil(output => {
      inputTotal = inputTotal + output.amount;
      return inputTotal >= paidTotal + fee;
    });
    if (inputTotal < paidTotal + fee) {
      throw `Insufficient funds: ${inputTotal} less than payment total ${paidTotal} + fee ${fee}`;
    }

    let change = inputTotal - paidTotal - fee;
    const changeOutput = { amount: change, address: this.wallet.publicKey };
    const outputs: List<Output> = payments
      .map(payment => ({ amount: payment.amount, address: payment.address }))
      .push(changeOutput);

    const transaction = new Transaction("regular", inputs, outputs);
    this.mempool.addTransaction(transaction);
  }

  // helper
  getUnspentInputs(): List<Input> {
    let inputs = Set(this.getInputs());
    let outputs = Set(this.getOutputs());
    const unspentOutputs = List(outputs.union(inputs));
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
            input.sign(this.wallet.privateKey);
            outputs = outputs.push(input);
          }
        });
      });
    });
    return outputs;
  }
}

export default Node;
