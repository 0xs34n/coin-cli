#!/usr/bin/env ts-node

import Peer from "./src/Peer";
import Message from "./src/Message";
import MessageType from "./src/MessageType";
import MessageCreator from "./src/MessageCreator";
import { List } from "immutable";
import Block from "./src/Block";
import Payment from "./src/Payment";
import Transaction from "./src/Transaction";
const peer = new Peer();
const vorpal = require("vorpal")();
import * as util from "util";

vorpal
  .use(connect)
  .use(discover)
  .use(blockchain)
  .use(peers)
  .use(mine)
  .use(open)
  .use(transaction)
  .use(newWallet)
  .use(getPublicKey)
  .use(pay)
  .use(balance)
  .use(welcome)
  .delimiter("coin >")
  .show();


// COMMANDS
function welcome(vorpal) {
  this.log("Welcome to Coin CLI!");
  vorpal.exec("help");
}

function connect(vorpal) {
  vorpal
    .command(
      "connect <host> <port>",
      "Connect to a new peer with <host> and <port>."
    )
    .alias("c")
    .action((args, callback) => {
      try {
        peer.connectToPeer(args.host, args.port);
      } catch (err) {
        this.log(err);
      } finally {
        callback();
      }
    });
}

function discover(vorpal) {
  vorpal
    .command("discover", "Discover new peers from your connected peers.")
    .alias("d")
    .action((args, callback) => {
      try {
        peer.discoverPeers();
      } catch (err) {
        this.log(err);
      } finally {
        callback();
      }
    });
}

function blockchain(vorpal) {
  vorpal
    .command("blockchain", "See the current state of the blockchain.")
    .alias("bc")
    .action((args, callback) => {
      this.log(peer.blockchain.toString());
      callback();
    });
}

function peers(vorpal) {
  vorpal
    .command("peers", "Get the list of connected peers.")
    .alias("p")
    .action((args, callback) => {
      peer.connectedPeers.forEach(peer => {
        this.log(`${JSON.stringify(peer.pxpPeer.socket.address())}\n`);
      }, this);
      callback();
    });
}

function mine(vorpal) {
  vorpal
    .command("mine [address]", "Mine a new block with rewards going to optional [address].")
    .alias("m")
    .action((args, callback) => {
      try {
        peer.mine();
        const latestBlock: Block = peer.blockchain.latestBlock
        const blockMessage: Message = MessageCreator.sendLatestBlock(latestBlock);
        peer.broadcast(blockMessage);

        const txsToClear: List<Transaction> = latestBlock.transactions;
        txsToClear.forEach(tx => peer.broadcast(MessageCreator.sendRemovedTransaction(tx)));
      } catch (e) {
        if (e instanceof TypeError) {
          handleTypeError.call(this, e);
        } else {
          this.log(e);
        }
      } finally {
        callback();
      }
    });
}

function open(vorpal) {
  vorpal
    .command("open <port>", "Open port <port> to accept incoming connections.")
    .alias("o")
    .action((args, callback) => {
      try {
        peer.startServer(args.port);
        this.log(`Listening to peers on ${args.port}`);
      } catch (err) {
        this.log(err);
      } finally {
        callback();
      }
    });
}

function transaction(vorpal) {
  vorpal
    .command("transactions", "See unconfirmed transactions that can be mined.")
    .alias("tx")
    .action((args, callback) => {
      this.log(peer.mempool.toString());
      callback();
    });
}

function newWallet(vorpal) {
  vorpal
    .command("wallet <password>", "Create a new wallet with <password>")
    .alias("w")
    .action((args, callback) => {
      peer.newWallet(args.password);
      const hidePass = args.password.replace(/./g, "*");
      this.log(`Created new wallet with password ${hidePass}.\n`);
      this.log(`Address: ${peer.wallet.publicKey}\n`);
      callback();
    });
}

function getPublicKey(vorpal) {
  vorpal
    .command("key", "Get your public key")
    .alias("k")
    .action((args, callback) => {
      try {
        this.log(peer.wallet.publicKey);
      } catch (e) {
        if (e instanceof TypeError) {
          handleTypeError.call(this, e);
        } else {
          this.log(e);
        }
      } finally {
        callback();
      }
    });
}

function pay(vorpal) {
  vorpal
    .command(
      "pay <address> <amount> <fee> <password>",
      "Make a payment to <address> with <amount> and <fee> using wallet <password>"
    )
    .action((args, callback) => {
      const address = args.address;
      const amount = args.amount;
      const password = args.password;
      const fee = args.fee;
      try {
        const transaction = peer.createTransaction(
          List([{ amount, address, fee }]),
          password
        );
        peer.mempool.addTransaction(transaction);
        const action: Message = MessageCreator.sendLatestTransaction(transaction);
        peer.broadcast(action);
      } catch (err) {
        this.log(err);
      } finally {
        callback();
      }
    });
}

function balance(vorpal) {
  vorpal
    .command("balance [address]", "Balance of optional [address]")
    .alias("b")
    .action((args, callback) => {
      try {
        this.log(peer.getBalance(args.address))
      } catch(e) {
        if(e instanceof TypeError) {
          handleTypeError.call(this, e);
        }
      } finally {
        callback();
      }
    })
}

// Error Handlers
function handleTypeError(e) {
  if (e.message.includes("'publicKey'")) {
    this.log('\nPlease create a wallet. Enter "help wallet" to see usage.\n');
  } else {
    this.log(e);
  }
}