/**
 * Created by chunyang.gao on 2018/2/16.
 */
//https://github.com/visionmedia/debug
// http://blog.csdn.net/isaisai/article/details/59104397
let debug = require('debug')('static:config');
let path = require('path')
let config = {
    host: '127.0.0.1',
    port: 8080,
    root: path.resolve(__dirname,'..','src')
}
debug(config)
module.exports = config