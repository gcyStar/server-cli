/**
 * Created by chunyang.gao on 2018/2/26.
 */

let Server = require('../src/app.js')
let defautConfig = require('../src/config')
let config = Object.assign({}, defautConfig, process.env)
let server = new Server(config);
server.start();
