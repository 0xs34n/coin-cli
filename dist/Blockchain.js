"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const util_1 = require("./util");
const crypto_1 = require("crypto");
class Blockchain {
    constructor() {
        this._chain = immutable_1.List([util_1.genesisBlock()]);
    }
    get chain() {
        return this._chain;
    }
    get latestBlock() {
        return this.chain[this.chain.size - 1];
    }
    get difficulty() {
        return Math.round(this.chain.size / 50) + 1;
    }
    set chain(chain) {
        try {
            if (this.shouldReplaceChain(chain)) {
                this._chain = chain;
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    mine(transactions) {
        const nextBlock = this.generateNextBlock(transactions);
        try {
            this.addBlock(nextBlock);
        }
        catch (e) {
            console.error(e);
        }
    }
    addBlock(block) {
        try {
            this.isValidNextBlock(block, this.latestBlock);
        }
        catch (e) {
            throw `Failed to add block: ${e}`;
        }
        this.chain = this.chain.push(block);
    }
    generateNextBlock(transactions) {
        const previousBlock = this.latestBlock;
        const index = previousBlock.index + 1;
        const previousHash = previousBlock.hash;
        let nonce = 0;
        let timestamp = new Date().getTime();
        let hash = this.calculateHash(index, previousHash, timestamp, transactions, nonce);
        // hashcash proof-of-work
        while (!this.isHashDifficult(hash)) {
            nonce = nonce + 1;
            timestamp = new Date().getTime();
            hash = this.calculateHash(index, previousHash, timestamp, transactions, nonce);
        }
        return { index, previousHash, timestamp, transactions, hash, nonce };
    }
    calculateHash(index, previousHash, timestamp, transactions, nonce) {
        return crypto_1.default
            .createHash("sha256")
            .update(index +
            previousHash +
            timestamp +
            JSON.stringify(transactions.toJS()) +
            nonce)
            .digest("hex");
    }
    calculateHashForBlock(block) {
        const { index, previousHash, timestamp, transactions, nonce } = block;
        return this.calculateHash(index, previousHash, timestamp, transactions, nonce);
    }
    isHashDifficult(hash) {
        for (var i = 0; i < hash.length; i += 1) {
            if (hash[i] !== "0") {
                break;
            }
        }
        return i >= this.difficulty;
    }
    shouldReplaceChain(chain) {
        try {
            this.isValidGenesis(chain);
            this.isValidLength(chain);
            this.isValidBlocks(chain);
        }
        catch (e) {
            throw `Invalid Chain Error: ${e}`;
        }
        return true;
    }
    isValidGenesis(chain) {
        if (JSON.stringify(chain.first()) !== JSON.stringify(this.chain.first())) {
            throw `Genesis ${chain.first()} is different from current genesis ${this.chain.first()}`;
        }
        return true;
    }
    isValidLength(chain) {
        if (chain.size <= this.chain.size) {
            throw `Length ${chain.size} shorter than length ${this.chain.size}`;
        }
        return true;
    }
    isValidBlocks(chain) {
        let tempBlocks = immutable_1.List([chain.first()]);
        let nextBlock;
        let previousBlock;
        for (let i = 1; i < chain.size; i += 1) {
            nextBlock = chain.get(i);
            previousBlock = tempBlocks.get(i - 1);
            try {
                this.isValidNextBlock(nextBlock, previousBlock);
            }
            catch (e) {
                throw e;
            }
            tempBlocks = tempBlocks.push(nextBlock);
        }
        return true;
    }
    isValidNextBlock(nextBlock, previousBlock) {
        try {
            this.isValidIndex(nextBlock, previousBlock);
            this.isValidPreviousHash(nextBlock, previousBlock);
            this.isValidHash(nextBlock);
            this.isValidDifficulty(nextBlock);
        }
        catch (e) {
            throw `Invalid Block Error: ${e}`;
        }
        return true;
    }
    isValidIndex(nextBlock, previousBlock) {
        const previousIndex = previousBlock.index;
        const index = nextBlock.index;
        if (previousIndex + 1 !== index) {
            throw `Previous index ${previousIndex} should be 1 less than index ${index}`;
        }
        return true;
    }
    isValidPreviousHash(nextBlock, previousBlock) {
        const previousHash = previousBlock.hash;
        const blockPreviousHash = nextBlock.previousHash;
        if (previousHash !== blockPreviousHash) {
            throw `Previous hash ${previousHash} should equal next previous hash ${blockPreviousHash}`;
        }
        return true;
    }
    isValidHash(nextBlock) {
        const calculatedHash = this.calculateHashForBlock(nextBlock);
        const hash = nextBlock.hash;
        if (calculatedHash !== hash) {
            throw `Calculated hash ${calculatedHash} not equal hash ${hash}`;
        }
        return true;
    }
    isValidDifficulty(block) {
        const hash = block.hash;
        if (!this.isHashDifficult(hash)) {
            throw `Hash ${hash} does not meet difficulty ${this.difficulty}`;
        }
        return true;
    }
}
exports.default = Blockchain;
//# sourceMappingURL=Blockchain.js.map