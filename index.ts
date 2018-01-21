#!/usr/bin/env ./node_modules/.bin/ts-node
const vorpal = require('vorpal')();
import cli from "./tools/cli-vorpal";
vorpal.use(cli);