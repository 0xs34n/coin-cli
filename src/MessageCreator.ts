import MessageType from "./MessageType";
import Block from "./Block";
import Message from "./Message";
import Transaction from "./Transaction";
import { List } from "immutable";

abstract class MessageCreator {

  public static getLatestBlock(): Message {
    return {
      type: MessageType.REQUEST_LATEST_BLOCK
    };
  }

  public static sendLatestBlock(block: Block): Message {
    return {
      type: MessageType.RECEIVE_LATEST_BLOCK,
      payload: block
    };
  }

  public static getBlockchain(): Message {
    return {
      type: MessageType.REQUEST_BLOCKCHAIN
    };
  }

  public static sendBlockchain(blockchain: List<Block>): Message {
    return {
      type: MessageType.RECEIVE_BLOCKCHAIN,
      payload: blockchain.toJS()
    };
  }

  public static getTransactions(): Message {
    return {
      type: MessageType.REQUEST_TRANSACTIONS
    };
  }

  public static sendTransactions(transactions: List<Transaction>): Message {
    return {
      type: MessageType.RECEIVE_TRANSACTIONS,
      payload: transactions.toJS()
    };
  }

  public static sendLatestTransaction(transaction: Transaction): Message {
    return {
      type: MessageType.RECEIVE_LATEST_TRANSACTION,
      payload: transaction
    };
  }
  
  public static sendRemovedTransaction(transaction: Transaction): Message {
    return {
      type: MessageType.RECEIVE_REMOVE_TRANSACTION,
      payload: transaction
    };
  }
}

export default MessageCreator;
