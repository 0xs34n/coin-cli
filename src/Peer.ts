import { List } from "immutable";
import * as net from "net";
import wrtc from "wrtc";
import Exchange from "peer-exchange";
import Block from "./Block";
import Blockchain from "./Blockchain";
import Node from "./Node";
import Transaction from "./Transaction";
import Input from "./Input";
const p2p = new Exchange('coin', { wrtc: wrtc });

enum DataType {
  REQUEST_LATEST_BLOCK,
  RECEIVE_LATEST_BLOCK,
  REQUEST_BLOCKCHAIN,
  RECEIVE_BLOCKCHAIN,
  REQUEST_TRANSACTIONS,
  RECEIVE_LATEST_TRANSACTION,
  RECEIVE_TRANSACTIONS,
  RECEIVE_REMOVE_TRANSACTION
}

interface Data {
  type: DataType;
  data?: any;
}

class Peer extends Node {
  public connectedPeers: List<any> = List();

  startServer(port) {
    net.createServer(socket => p2p.accept(socket, (err, peer) => {
      if (err) {
        throw err;
      } else {
        this.incomingConnection.call(this, peer);
      }
    })).listen(port);
  }

  incomingConnection(peer) {
    this.connectedPeers = this.connectedPeers.push(peer);
    this.incomingDataHandler(peer);
    this.initErrorHandler(peer);
    this.sendData(peer, Action.getLatestBlock());
    this.sendData(peer, Action.getTransactions());
  }

  sendData(peer, data: Data) {
    peer.write(JSON.stringify(data));
  }

  incomingDataHandler(peer) {
    peer.on('data', data => {
      const dataObj = JSON.parse(data.toStirng('utf8'));
      try {
        this.handleIncomingData(peer, dataObj);
      } catch(e) {
        console.error(e);
      }
    })
  }

  initErrorHandler(peer) {
    peer.on("error", error => {
      console.error(error);
    })
  }

  handleIncomingData(peer, data) {
    switch(data.type) {
      case DataType.REQUEST_LATEST_BLOCK:
        this.sendData(peer, Action.getLatestBlock());
        break;
      case DataType.REQUEST_BLOCKCHAIN:
        this.sendData(peer, Action.getBlockchain());
        break;
      case DataType.RECEIVE_BLOCKCHAIN:
        this.handleReceivedBlockchain(peer, data.data);
        break;
      case DataType.RECEIVE_LATEST_BLOCK:
        this.handleReceivedLatestBlock(peer, data.data);
        break;
      case DataType.REQUEST_TRANSACTIONS:
        this.sendData(peer, Action.getTransactions());
        break;
      case DataType.RECEIVE_TRANSACTIONS:
        const receivedTransactions = JSON.parse(data.data);
        receivedTransactions.forEach(tx => this.mempool.addTransaction(tx));
        break;
      case DataType.RECEIVE_LATEST_TRANSACTION:
        this.mempool.addTransaction(data.data);
        break;
      case DataType.RECEIVE_REMOVE_TRANSACTION:
        this.mempool.removeTransaction(JSON.parse(data.data))
        break;
      default:
        throw `Invalid data type from ${peer}`;
    }   
  }

  handleReceivedBlockchain(peer, blockchain) {
    const receivedBlockchain: List<Block> = List(JSON.parse(blockchain));
    try {
      this.blockchain.chain = receivedBlockchain;
    } catch(e) {
      console.error(e);
    }
  }

  handleReceivedLatestBlock(peer, block: Block) {
    const latestBlockReceived = JSON.parse(block);
    const latestBlockHeld = this.blockchain.latestBlock;

    try {
      this.blockchain.addBlock(latestBlockReceived);
    } catch(e) {
      console.error(e);
      this.sendData(peer, Action.getBlockchain());
    }
  }

  broadcast(data) {
    this.connectedPeers.forEach(peer => this.sendData(peer, data));
  }
}

export default Peer;

abstract class Action {
  public static getLatestBlock(): Data {
    return {
      type: DataType.REQUEST_LATEST_BLOCK
    };
  }

  public static sendLatestBlock(block: Block): Data {
    return {
      type: DataType.RECEIVE_LATEST_BLOCK,
      data: block
    };
  }

  public static getBlockchain(): Data {
    return {
      type: DataType.REQUEST_BLOCKCHAIN
    };
  }

  public static sendBlockchain(blockchain: List<Block>): Data {
    return {
      type: DataType.RECEIVE_BLOCKCHAIN,
      data: blockchain
    };
  }

  public static getTransactions(): Data {
    return {
      type: DataType.REQUEST_TRANSACTIONS
    };
  }

  public static sendTransactions(transactions: List<Transaction>): Data {
    return {
      type: DataType.RECEIVE_TRANSACTIONS,
      data: transactions
    };
  }

  public static sendRemoveTransaction(transaction: Transaction): Data {
    return {
      type: DataType.RECEIVE_REMOVE_TRANSACTION,
      data: transaction
    };
  }
}