#!/usr/bin/env ./node_modules/.bin/ts-node
const vorpal = require('vorpal')();
import cli from "./cli";
vorpal.use(cli);