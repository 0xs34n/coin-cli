"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const net_1 = require("net");
const wrtc_1 = require("wrtc");
const peer_exchange_1 = require("peer-exchange");
const p2p = new peer_exchange_1.default('coin', { wrtc: wrtc_1.default });
var DataType;
(function (DataType) {
    DataType[DataType["REQUEST_LATEST_BLOCK"] = 0] = "REQUEST_LATEST_BLOCK";
    DataType[DataType["RECEIVE_LATEST_BLOCK"] = 1] = "RECEIVE_LATEST_BLOCK";
    DataType[DataType["REQUEST_BLOCKCHAIN"] = 2] = "REQUEST_BLOCKCHAIN";
    DataType[DataType["RECEIVE_BLOCKCHAIN"] = 3] = "RECEIVE_BLOCKCHAIN";
    DataType[DataType["REQUEST_TRANSACTIONS"] = 4] = "REQUEST_TRANSACTIONS";
    DataType[DataType["RECEIVE_LATEST_TRANSACTION"] = 5] = "RECEIVE_LATEST_TRANSACTION";
    DataType[DataType["RECEIVE_TRANSACTIONS"] = 6] = "RECEIVE_TRANSACTIONS";
    DataType[DataType["RECEIVE_REMOVE_TRANSACTION"] = 7] = "RECEIVE_REMOVE_TRANSACTION";
})(DataType || (DataType = {}));
class Peer {
    constructor() {
        this.port = 5000;
        this.peers = immutable_1.List();
    }
    startServer() {
        net_1.default.createServer(socket => p2p.accept(socket, (err, peer) => {
            if (err) {
                throw err;
            }
            else {
                this.incomingConnection.call(this, peer);
            }
        })).listen(this.port);
    }
    incomingConnection(peer) {
        this.peers = this.peers.push(peer);
        this.incomingDataHandler(peer);
        this.initErrorHandler(peer);
        this.sendData(peer, this.requestLatestBlockData());
    }
    sendData(peer, data) {
        peer.write(JSON.stringify(data));
    }
    incomingDataHandler(peer) {
        peer.on('data', data => {
            const dataObj = JSON.parse(data.toStirng('utf8'));
            this.handleIncomingData(peer);
        });
    }
    handleIncomingData(peer, data) {
        switch (data.type) {
            case DataType.REQUEST_LATEST_BLOCK:
                this.sendData(peer, this.latestBlockData(block));
                break;
        }
    }
    latestBlockData(block) {
        return {
            type: DataType.RECEIVE_LATEST_BLOCK,
            data: block
        };
    }
}
exports.default = Peer;
//# sourceMappingURL=Peer.js.map