import Peer from "./Peer";
const peer = new Peer();

function cli(vorpal) {
  vorpal
  .use(welcome)
  .use(connectCommand)
  .use(discoverCommand)
  .use(blockchainCommand)
  .use(peersCommand)
  .use(mineCommand)
  .use(openCommand)
  .delimiter('blockchain →')
  .show()
}

module.exports = cli;

// COMMANDS
function welcome(vorpal) {
  vorpal.log("Welcome to Coin CLI!");
  vorpal.exec("help");
}

function connectCommand(vorpal) {
  vorpal
  .command('connect <host> <port>', "Connect to a new peer. Eg: connect localhost 2727")
  .alias('c')
  .action(function(args, callback) {
    if(args.host && args.port) {
      try {
        .connectToPeer(args.host, args.port);
      } catch(err) {
        this.log(err);
      }
    }
    callback();
  })
}

function discoverCommand(vorpal) {
  vorpal
  .command('discover', 'Discover new peers from your connected peers.')
  .alias('d')
  .action(function(args, callback) {
    try {
      p2p.discoverPeers();
    } catch(err) {
      this.log(err);
    }
    callback();
  })
}

function blockchainCommand(vorpal) {
  vorpal
    .command('blockchain', 'See the current state of the blockchain.')
    .alias('bc')
    .action(function(args, callback) {
      this.log(blockchain)
      callback();
    })
}

function peersCommand(vorpal) {
  vorpal
    .command('peers', 'Get the list of connected peers.')
    .alias('p')
    .action((args, callback) => {

      // p2p.peers.forEach(peer => {
      //   this.log(`${peer.pxpPeer.socket._host} \n`)
      // }, this)
      callback();
    })
}

function mineCommand(vorpal) {
  vorpal
    .command('mine <data>', 'Mine a new block. Eg: mine hello!')
    .alias('m')
    .action(function(args, callback) {
      if (args.data) {
        blockchain.mine(args.data);
        p2p.broadcastLatest(); 
      }
      callback();
    })
}

function openCommand(vorpal) {
  vorpal
    .command('open <port>', 'Open port to accept incoming connections. Eg: open 2727')
    .alias('o')
    .action((args, callback) => {
      try {
        peer.startServer(args.port);
      } catch(e) {
        console.error(e);
      }
      callback();
    })
}