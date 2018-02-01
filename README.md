<h1 align="center">
  <br>
  <a href="https://coindemo.io" rel="noopener noreferrer" target="_blank"><img src="https://raw.githubusercontent.com/seanjameshan/coin-ts/master/logo.png" width="200"></a>
  <br>
    <a href="https://coindemo.io" rel="noopener noreferrer" target="_blank">Coin CLI</a>
  <br>
</h1>

<h4 align="center">A minimal cryptocurrency CLI implementation in TypeScript & Immutable.js</h4>

<br>

![screenshot](https://raw.githubusercontent.com/seanjameshab/coin-ts/master/demo.gif)

## 🎉 Features
- 💰 Wallet with public and private key.
- 💳 Make Payments between wallets.
- 🔑 Transactions are signed with the wallet's private key.
- 🔗 Blocks with index, hash, data, transactions, and timestamp.
- ⛏ Proof-of-work implementation.
- ⛓ In-memory JavaScript array to store the blockchain.
- ✅ Block & Transaction integrity validation.
- 📡 Decentralized and distributed peer-to-peer communication.
- ✨ Minimal implementation in 900 lines of code.

## 📦 Installation

To install this application, you'll need
[Node.js](https://nodejs.org/en/download/) 7+ (which comes with
[npm](http://npmjs.com)) installed on your computer. From your command line:

#### Source (recommended)

You'll need [Git](https://git-scm.com) to run the project from source. From your
command line:

```bash
# Clone this repository
$ git clone https://github.com/seanseany/blockchain

# Go into the repository
$ cd blockchain

# Install dependencies
$ npm install

# Run the app
$ npm start
```

#### [NPM]() 
<!-- add npm link above -->
```bash
$ npm install coin-cli -g
$ coin
```

## 🕹️ Usage
| Command                                  | Alias | Description                                                               | Example                    |
|------------------------------------------|-------|---------------------------------------------------------------------------|----------------------------|
| open <port>                              | o     | Open <port> to accept incoming connections.                               | open 5000                  |
| connect <host> <port>                    | c     | Connect to a new peer with <host> and <peer>                              | connect localhost 5000     |
| blockchain                               | bc    | See the current state of the blockchain.                                  |                            |
| peers                                    | p     | Get the list of connected peers.                                          |                            |
| mine [address]                           | m     | Mine a new block with rewards going to optional [address].                | mine or mine xxx...        |
| transactions                             | tx    | See unconfirmed transactions that can be mined.                           |                            |
| wallet <password>                        | w     | Create a new wallet with <password>                                       | wallet mypassword          |
| key                                      | k     | Get your public key                                                       |                            |
| pay <address> <amount> <fee> <password>  | p     | Make payment to <address> with <amount> and <fee> using wallet <password> | pay xxx... 10 5 mypassword |
| balance [address]                        | b     | Balance of optional <address>                                             | balance or balance xxx...  |
| help [command...]                        |       | Provides help for a given command                                         | help balance or help       |
| exit                                     |       | Exits application.                                                        |                            |
<style>.bmc-button img{box-shadow: none !important;border: none !important;vertical-align: middle !important;}.bmc-button{text-decoration: none !important;display:inline-block !important;padding:5px 10px !important;color:#FFFFFF !important;background-color:#FF813F !important;border-radius: 3px !important;border: 1px solid transparent !important;font-size: 26px !important;box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;-webkit-transition: 0.3s all linear !important;transition: 0.3s all linear !important;margin: 0 auto !important;font-family:"Cookie", cursive !important;}.bmc-button:hover, .bmc-button:active, .bmc-button:focus {-webkit-box-shadow: 0 4px 16px 0 rgba(190, 190, 190,.45) !important;text-decoration: none !important;box-shadow: 0 4px 16px 0 rgba(190, 190, 190,.45) !important;opacity: 0.85 !important;color:#FFFFFF !important;}</style><link href="https://fonts.googleapis.com/css?family=Cookie" rel="stylesheet"><a class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/seanhan"><img src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg" alt=""><span style="margin-left:5px">Buy me a coffee</span></a>




