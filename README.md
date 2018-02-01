<h1 align="center">
  <br>
  <a href="https://coindemo.io" rel="noopener noreferrer" target="_blank"><img src="https://raw.githubusercontent.com/seanjameshan/coin-cli/master/media/logo.png" width="200"></a>
  <br>
    <a href="https://coindemo.io" rel="noopener noreferrer" target="_blank">Coin CLI</a>
  <br>
</h1>

<h4 align="center">A minimal cryptocurrency CLI implementation in TypeScript & Immutable.js</h4>

<br>

## Demo

#### Connect
![alt text](https://raw.githubusercontent.com/seanjameshan/coin-cli/master/media/demo/connect.gif)

#### Mining
![alt text](https://raw.githubusercontent.com/seanjameshan/coin-cli/master/media/demo/mine.png)

#### Payment
![alt text](https://raw.githubusercontent.com/seanjameshan/coin-cli/master/media/demo/pay.png)

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
$ git clone https://github.com/seanjameshan/coin-cli

# Go into the repository
$ cd coin-cli

# Install dependencies
$ npm install

# Run the app
$ npm start
```

#### [NPM]() 
<!-- add npm link above -->
```bash
$ npm install ts-node -g
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

<br>

<h1 align="center">
<a rel="noopener noreferrer" target="_blank" href="https://www.buymeacoffee.com/seanhan"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" target="_blank"></a>
</h1>

<br>

