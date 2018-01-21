import { List, isImmutable } from "immutable";
import * as net from "net";
import * as wrtc from "wrtc";
import * as Exchange from "peer-exchange";
import Block from "./Block";
import Blockchain from "./Blockchain";
import Node from "./Node";
import Transaction from "./Transaction";
import Input from "./Input";
import Message from "./Message";
import MessageType from "./MessageType";
import MessageCreator from "./MessageCreator";

const p2p = new Exchange("coin", { wrtc: wrtc });

class Peer extends Node {
  public connectedPeers: List<any> = List();

  startServer(port: number) {
    net
      .createServer(socket =>
        p2p.accept(socket, (err, peer) => {
          if (err) {
            throw err;
          } else {
            this.incomingConnection.call(this, peer);
          }
        })
      )
      .listen(port);
  }

  incomingConnection(peer) {
    this.connectedPeers = this.connectedPeers.push(peer);
    this.incomingMsgHandler(peer);
    this.peerErrorHandler(peer);
    this.sendMsg(peer, MessageCreator.getLatestBlock());
    this.sendMsg(peer, MessageCreator.getTransactions());
  }

  sendMsg(peer, payload: Message) {
    const payloadStr = JSON.stringify(payload);
    peer.write(payloadStr);
  }

  incomingMsgHandler(peer) {
    peer.on("data", message => {
      const messageJS = JSON.parse(message.toString("utf8"));
      try {
        this.handleIncomingMsg(peer, messageJS);
      } catch (e) {}
    });
  }

  peerErrorHandler(peer) {
    peer.on("error", e => {});
  }

  handleIncomingMsg(peer, message: Message) {
    switch (message.type) {
      case MessageType.REQUEST_LATEST_BLOCK:
        const latestBlock = this.blockchain.latestBlock;
        this.sendMsg(peer, MessageCreator.sendLatestBlock(latestBlock));
        break;
      case MessageType.REQUEST_BLOCKCHAIN:
        const chain = this.blockchain.chain;
        this.sendMsg(peer, MessageCreator.sendBlockchain(chain));
        break;
      case MessageType.RECEIVE_BLOCKCHAIN:
        this.handleReceivedBlockchain(peer, message.payload);
        break;
      case MessageType.RECEIVE_LATEST_BLOCK:
        this.handleReceivedLatestBlock(peer, message.payload);
        break;
      case MessageType.REQUEST_TRANSACTIONS:
        this.sendMsg(peer, MessageCreator.getTransactions());
        break;
      case MessageType.RECEIVE_TRANSACTIONS:
        const receivedTransactions = message.payload;
        receivedTransactions.forEach(transactionJS => {
          const transaction = Transaction.fromJS(transactionJS);
          this.mempool.addTransaction(transaction);
        });
        break;
      case MessageType.RECEIVE_LATEST_TRANSACTION:
        this.mempool.addTransaction(Transaction.fromJS(message.payload));
        break;
      case MessageType.RECEIVE_REMOVE_TRANSACTION:
        this.mempool.removeTransaction(Transaction.fromJS(message.payload));
        break;
      default:
        throw `Invalid message type ${message.type} from ${peer}`;
    }
  }

  handleReceivedBlockchain(peer, blockchain) {
    const receivedBlockchain: List<Block> = Blockchain.fromJS(blockchain);
    try {
      this.blockchain.chain = receivedBlockchain;
      this.broadcast(
        MessageCreator.sendLatestBlock(this.blockchain.latestBlock)
      );
    } catch (e) {
      throw e;
    }
  }

  handleReceivedLatestBlock(peer, block) {
    const latestBlockReceived = {
      ...block,
      transactions: List(block.transactions.map(tx => Transaction.fromJS(tx)))
    };
    const latestBlockHeld = this.blockchain.latestBlock;
    try {
      this.blockchain.addBlock(latestBlockReceived);
      this.broadcast(MessageCreator.sendLatestBlock(latestBlockReceived));
    } catch (e) {
      throw e;
    } finally {
      this.sendMsg(peer, MessageCreator.getBlockchain());
    }
  }

  broadcast(data: Message) {
    this.connectedPeers.forEach(peer => this.sendMsg(peer, data));
  }

  connectToPeer(host, port) {
    const socket = net.connect(port, host, () =>
      p2p.connect(socket, (err, peer) => {
        if (err) {
          throw err;
        } else {
          this.incomingConnection.call(this, peer);
        }
      })
    );
  }

  closeConnection() {
    p2p.close(err => {
      throw err;
    });
  }

  discoverPeers() {
    p2p.getNewPeer((err, peer) => {
      if (err) {
        throw err;
      } else {
        this.incomingConnection.call(this, peer);
      }
    });
  }
}

export default Peer;