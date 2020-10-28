/**
 * Created by chunyang.gao on 2018/2/26.
 */
let yargs = require('yargs')
let fs = require('fs')
let path = require('path')

let argv = yargs.option('d', {
    alias: 'root',
    demand: 'false',
    type: 'string',
    default: process.cwd(),
    description: 'server root path'
}).option('a', {
    alias: 'host',
    demand: 'false',
    default: '127.0.0.1',
    type: 'string',
    description: 'Address to use'
}).option('p', {
    alias: 'port',
    demand: 'false',
    type: 'number',
    default: 8080,
    description: 'Port to use'
}).option('o', {
    demand: 'false',
    default: false
})
    .option('cors', {
        demand: 'false',
        type: 'string',
        default: true
    })
    .option('P', {
        alias: 'proxy',
        demand: false //非必须  默认为false 有参数为true
    })
    .option('v', {
        alias: 'version',
        demand: 'false',
        type: 'boolean',
        default: false //
    })
    .option('D',{
        alias: 'deamon',
        demand: 'false',
        default: false,
        type: 'boolean',
    })
    .option('c',{
        alias: 'cacheSupport',
        demand: 'false',
        default: false,
        type: 'boolean'
    })
    .usage('hs-server [options]')
    .example(
        'hs-server -d / -p 8080 -a 127.0.0.1', 'listening on localhost:8080'
    ).help('h').argv;

module.exports = argv