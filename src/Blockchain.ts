import Block, { genesisBlock } from "./Block";
import Transaction from "./Transaction";
import { List } from "immutable";
import * as crypto from "crypto";

interface chain {
  chain: List<Block>;
  readonly difficulty: number; // difficulty starts from 1 and increases to 2 @ block 25 - then increases by 1 every 50 blocks
  readonly latestBlock: Block;

  generateNextBlock(transactions: List<Transaction>): Block;
  addBlock(block: Block);
}

class Blockchain {
  private _chain: List<Block> = List([genesisBlock()]);

  get chain() {
    return this._chain;
  }

  toString(): string {
    return JSON.stringify(this.chain.toJS(), null, 2);
  }

  get latestBlock(): Block {
    return this.chain.get(this.chain.size - 1);
  }

  get difficulty(): number {
    return Math.round(this.chain.size / 50) + 3;
  }

  set chain(chain: List<Block>) {
    try {
      if (this.shouldReplaceChain(chain)) {
        this._chain = chain;
      }
    } catch (e) {
      throw e;
    }
  }

  addBlock(block: Block) {
    try {
      this.isValidNextBlock(block, this.latestBlock);
      this.chain = this.chain.push(block);
    } catch (e) {
      throw `Failed to add block: ${e}`;
    }
  }

  generateNextBlock(transactions: List<Transaction>): Block {
    const previousBlock: Block = this.latestBlock;
    const index: number = previousBlock.index + 1;
    const previousHash: string = previousBlock.hash;
    let nonce: number = 0;
    let timestamp: number = new Date().getTime();
    let hash: string = this.calculateHash(
      index,
      previousHash,
      timestamp,
      transactions,
      nonce
    );

    // hashcash proof-of-work
    while (!this.isHashDifficult(hash)) {
      nonce = nonce + 1;
      timestamp = new Date().getTime();
      hash = this.calculateHash(
        index,
        previousHash,
        timestamp,
        transactions,
        nonce
      );
    }

    return { index, previousHash, timestamp, transactions, hash, nonce };
  }

  calculateHash(
    index: number,
    previousHash: string,
    timestamp: number,
    transactions: List<Transaction>,
    nonce: number
  ): string {
    return crypto
      .createHash("sha256")
      .update(
        index +
          previousHash +
          timestamp +
          JSON.stringify(transactions.toJS()) +
          nonce
      )
      .digest("hex");
  }

  calculateHashForBlock(block: Block): string {
    const { index, previousHash, timestamp, transactions, nonce } = block;
    return this.calculateHash(
      index,
      previousHash,
      timestamp,
      transactions,
      nonce
    );
  }

  isHashDifficult(hash: string): boolean {
    for (var i = 0; i < hash.length; i += 1) {
      if (hash[i] !== "0") {
        break;
      }
    }
    return i >= this.difficulty;
  }

  shouldReplaceChain(chain: List<Block>): boolean {
    try {
      this.isValidGenesis(chain);
      this.isValidLength(chain);
      this.isValidBlocks(chain);
    } catch (e) {
      throw `Invalid Chain Error: ${e}`;
    }
    return true;
  }

  isValidGenesis(chain: List<Block>): boolean {
    if (JSON.stringify(chain.first()) !== JSON.stringify(this.chain.first())) {
      throw `Genesis ${chain.first()} is different from current genesis ${this.chain.first()}`;
    }
    return true;
  }

  isValidLength(chain: List<Block>): boolean {
    if (chain.size <= this.chain.size) {
      throw `Length ${chain.size} shorter than length ${this.chain.size}`;
    }
    return true;
  }

  isValidBlocks(chain: List<Block>): boolean {
    let tempBlocks = List([chain.first()]);
    let nextBlock;
    let previousBlock;

    for (let i = 1; i < chain.size; i += 1) {
      nextBlock = chain.get(i);
      previousBlock = tempBlocks.get(i - 1);

      try {
        this.isValidNextBlock(nextBlock, previousBlock);
      } catch (e) {
        throw e;
      }
      tempBlocks = tempBlocks.push(nextBlock);
    }
    return true;
  }

  isValidNextBlock(nextBlock: Block, previousBlock: Block): boolean {
    try {
      this.isValidIndex(nextBlock, previousBlock);
      this.isValidPreviousHash(nextBlock, previousBlock);
      this.isValidHash(nextBlock);
      this.isValidDifficulty(nextBlock);
    } catch (e) {
      throw `Invalid Block Error: ${e}`;
    }
    return true;
  }

  isValidIndex(nextBlock: Block, previousBlock: Block): boolean {
    const previousIndex = previousBlock.index;
    const index = nextBlock.index;

    if (previousIndex + 1 !== index) {
      throw `Previous index ${previousIndex} should be 1 less than index ${index}`;
    }
    return true;
  }

  isValidPreviousHash(nextBlock: Block, previousBlock: Block): boolean {
    const previousHash = previousBlock.hash;
    const blockPreviousHash = nextBlock.previousHash;

    if (previousHash !== blockPreviousHash) {
      throw `Previous hash ${previousHash} should equal next previous hash ${blockPreviousHash}`;
    }
    return true;
  }

  isValidHash(nextBlock: Block): boolean {
    const calculatedHash = this.calculateHashForBlock(nextBlock);
    const hash = nextBlock.hash;
    if (calculatedHash !== hash) {
      throw `Calculated hash ${calculatedHash} not equal hash ${hash}`;
    }
    return true;
  }

  isValidDifficulty(block: Block) {
    const hash = block.hash;
    if (!this.isHashDifficult(hash)) {
      throw `Hash ${hash} does not meet difficulty ${this.difficulty}`;
    }
    return true;
  }
}

export default Blockchain;
