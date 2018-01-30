import * as tape from "tape";
import { List } from "immutable";
import Node from "../src/Node";


tape(('simple payment'), function (t: tape.Test) {

  t.comment("start two nodes node1 and node2");
  const node1 = new Node();
  const node2 = new Node();

  node1.newWallet('pw1');
  node2.newWallet('pw2');

  t.comment('node1 mines new block');
  node1.mine();

  t.comment('add new block to node2');
  node2.blockchain.addBlock(node1.blockchain.chain.get(1));

  t.comment('node1 should have 100 coins');
  t.equal(node1.getBalance(), 100);

  t.comment('create transaction where node1 gives node2 10 coins with fee of 5');
  const tx = node1.createTransaction(List([{ amount: 10, address: node2.wallet.publicKey, fee: 5 }]), 'pw1');

  t.comment('add the transaction to node2');
  node2.mempool.addTransaction(tx);
  t.equal(node2.mempool.transactions.size, 1);

  t.comment('node2 mines the new transaction');
  node2.mine();

  t.comment('node2 should have 115 coins');
  t.equal(node2.getBalance(), 115);

  t.comment('add block to node1');
  node1.blockchain.addBlock(node2.blockchain.chain.get(2));

  t.comment('node1 should have 85 coins');
  t.equal(node1.getBalance(), 85);

  t.end();
})

tape(('error payment'), function (t: tape.Test) {
  t.comment("start two nodes node1 and node2");
  const node1 = new Node();
  const node2 = new Node();

  node1.newWallet('pw1');
  node2.newWallet('pw2');

  t.comment('node1 mines new block');
  node1.mine();

  t.comment('create transaction where node1 gives node2 10 coins with fee of 5');
  const tx = node1.createTransaction(List([{ amount: 200, address: node2.wallet.publicKey, fee: 5 }]), 'pw1');
  try {
    node1.mempool.addTransaction(tx);
  } catch(e) {
    console.error(e);
  }

  t.end();
});

tape(('complex payment'), function (t: tape.Test) {
  const node1 = new Node();
  const node2 = new Node();
  const node3 = new Node();
  const node4 = new Node();
  const node5 = new Node();
  const node6 = new Node();
  const node7 = new Node();

  node1.newWallet('pw1');
  node2.newWallet('pw2');
  node3.newWallet('pw3');
  node4.newWallet('pw4');
  node5.newWallet('pw5');
  node6.newWallet('pw6');
  node7.newWallet('pw7');

  t.comment('node1 mines new block');
  node1.mine();

  t.comment('add new block to other nodes');
  node2.blockchain.addBlock(node1.blockchain.chain.get(1));
  node3.blockchain.addBlock(node1.blockchain.chain.get(1));
  node4.blockchain.addBlock(node1.blockchain.chain.get(1));
  node5.blockchain.addBlock(node1.blockchain.chain.get(1));
  node6.blockchain.addBlock(node1.blockchain.chain.get(1));
  node7.blockchain.addBlock(node1.blockchain.chain.get(1));

  t.comment("3. create a transaction where A gives B 10 coins");
  const tx1 = { address: node2.wallet.publicKey, amount: 10, fee: 1 };

  t.comment("3a. create a transaction where A gives C 10 coins");
  const tx2 = { address: node3.wallet.publicKey, amount: 10, fee: 1 };

  t.comment("3b. create a transaction where A gives D 10 coins");
  const tx3 = { address: node4.wallet.publicKey, amount: 10, fee: 1 };

  t.comment('3c. create a transaction where A gives E 10 coins');
  const tx4 = { address: node5.wallet.publicKey, amount: 10, fee: 1 };

  t.comment('3d. create a transaction where A gives F 10 coins');
  const tx5 = { address: node6.wallet.publicKey, amount: 10, fee: 1 };

  t.comment('3e. create a transaction where A gives G 10 coins');
  const tx6 = { address: node7.wallet.publicKey, amount: 10, fee: 1 };

  const tx = node1.createTransaction(List([tx1, tx2, tx3, tx4, tx5, tx6]), 'pw1');

  t.comment('add the transaction to node2');
  node2.mempool.addTransaction(tx);
  t.equal(node2.mempool.transactions.size, 1);

  t.comment('node2 mines new block');
  node2.mine();

  t.comment('add block to node1');
  node1.blockchain.addBlock(node2.blockchain.chain.get(2));

  t.comment('add block to node3');
  node3.blockchain.addBlock(node2.blockchain.chain.get(2));

  t.comment('add block to node4');
  node4.blockchain.addBlock(node2.blockchain.chain.get(2));

  t.comment('add block to node5');
  node5.blockchain.addBlock(node2.blockchain.chain.get(2));

  t.comment('add block to node6');
  node6.blockchain.addBlock(node2.blockchain.chain.get(2));

  t.comment('add block to node7');
  node7.blockchain.addBlock(node2.blockchain.chain.get(2));

  t.comment('node1 should have 34 coins');
  t.equal(node1.getBalance(), 34); // 100 - 60 - 6 

  t.comment('node2 should have 116 coins');
  t.equal(node2.getBalance(), 116); 

  t.comment('node3 should have 10 coins');
  t.equal(node3.getBalance(), 10);

  t.comment('node4 should have 10 coins');
  t.equal(node4.getBalance(), 10);

  t.comment('node5 should have 10 coins');
  t.equal(node5.getBalance(), 10);

  t.comment('node6 should have 10 coins');
  t.equal(node6.getBalance(), 10);

  t.end();
});

tape(('double spend test'), function (t: tape.Test) {
  const node1 = new Node();
  const node2 = new Node();
  const node3 = new Node();

  node1.newWallet('pw1');
  node2.newWallet('pw2');
  node3.newWallet('pw3');

  t.comment('node1 mines new block');
  node1.mine();

  t.comment('add new block to node2 and node 3');
  node2.blockchain.addBlock(node1.blockchain.chain.get(1));
  node3.blockchain.addBlock(node1.blockchain.chain.get(1));

  t.comment('create transaction where node1 gives node2 10 coins with fee of 1');
  const tx1 = node1.createTransaction(List([{ amount: 10, address: node2.wallet.publicKey, fee: 1 }]), 'pw1');

  t.comment('create transaction where node1 gives node2 10 coins with fee of 1');
  const tx2 = node1.createTransaction(List([{ amount: 10, address: node3.wallet.publicKey, fee: 1 }]), 'pw1');

  t.comment('add tx1 to node1');
  node1.mempool.addTransaction(tx1);

  t.comment('add tx2 to node1');
  try {
    node1.mempool.addTransaction(tx2);
  } catch(e) {
    console.error(e);
  }

  t.comment("mine the new transaction");
  node1.mine();
  node2.blockchain.addBlock(node1.blockchain.chain.get(2));
  node3.blockchain.addBlock(node1.blockchain.chain.get(2));

  t.comment("Only one transaction in the 3rd block");
  t.equal(node1.blockchain.chain.get(2).transactions.size, 3);

  t.comment("The one transaction in the 3rd block should be tx2");
  t.equal(node1.blockchain.chain.get(2).transactions.get(0).equals(tx1), true);
  t.equal(node2.mempool.transactions.size, 0);

  t.end();
});