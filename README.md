<h1 align="center">
  <br>
  <a href="https://coindemo.io" rel="noopener noreferrer" target="_blank"><img src="https://raw.githubusercontent.com/seanjameshan/coin-ts/master/logo.png" width="200"></a>
  <br>
    <a href="https://coindemo.io" rel="noopener noreferrer" target="_blank">Coin CLI</a>
  <br>
</h1>

<h4 align="center">A minimal cryptocurrency CLI and implementation</h4>

<br>

![screenshot](https://raw.githubusercontent.com/seanjameshab/coin-ts/master/demo.gif)

## 🎉 Features
- 💰 Wallet with public and private key.
- 💳 Make Payments between wallets.
- 🔑 Inputs are signed with the wallet's private key.
- 🔗 Blocks with index, hash, data, transactions, and timestamp.
- ⛏ Proof-of-work implementation.
- ⛓ In-memory JavaScript array to store the blockchain.
- ✅ Block & Transaction integrity validation.
- 📡 Decentralized and distributed peer-to-peer communication.
- ✨ Minimal cryptocurrency implementation in 900 lines of code.

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

#### NPM

```bash
$ npm install coin-cli -g
$ coin
```

## 🕹️ Command (alias) <inputs...>
###### help [command...]
- Provides help for a given command

###### exit
- Exits application.

###### open <port>
- Open port <port> to accept incoming connections.
- Eg., `open 5000`
- Alias is `o`

###### connect <host> <port>
- Connect to a new peer with <host> and <port>.
- Eg., `connect localhost 5000 `
- Alias is `c`

###### blockchain
- See the current state of the blockchain.
- Alias is `bc`

###### peers
- Get the list of connected peers.
- Alias is `p`

###### mine [address]
- Mine a new block with rewards going to optional [address]. 
- Defaults to current wallet address
- Eg., `mine` or `mine 040e05438372765a150b668860aa93160281c3ffbcc98c73a1608574f23597e548bf127280fe997ef7aa3205490b36045fad2edfed663e9df0f9be5f94baec17ab`
- Alias is `m`

###### transactions 
- See unconfirmed transactions that can be mined.
- Alias is `tx`

###### wallet <password>
- Create a new wallet with <password>
- Eg., `wallet mypassword`
- Alias is `w`

###### key
- Get your public key
- Alias is `k`

###### pay <address> <amount> <fee> <password>
- Make a payment to <address> with <amount> and <fee> using wallet <password>
- Eg., `pay 040e05438372765a150b668860aa93160281c3ffbcc98c73a1608574f23597e548bf127280fe997ef7aa3205490b36045fad2edfed663e9df0f9be5f94baec17ab 10 5 mypassword`
- Alias is `p`

###### balance [address]
- Balance of optional [address]

## Implementation






