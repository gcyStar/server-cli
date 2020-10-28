/**
 * Created by chunyang.gao on 2018/2/16.
 */

let http = require('http')
let url = require('url')
let chalk = require('chalk')
let path = require('path')
let fs = require('fs')
let {promisify, inspect} = require('util')
let mime = require('mime')
let {encodeZib, detailInfoList, byteRangeStream} = require('./util')
let stat = promisify(fs.stat)
let readdir = promisify(fs.readdir)
let {picGuard} = require('./picGuard')
let{cacheSupport} = require('./cacheSupport')


// DEBUG=* (regx  filter log) node ./bin/start.js
//https://www.npmjs.com/package/debug
let debug = require('debug')('static:app')
class ServerCli {
    constructor(argv) {
        this.list = detailInfoList()
        this.config = argv
    }
    start () {
        let server = http.createServer()
        server.on('request',this.request.bind(this))
        server.listen(this.config.port,this.config.host, () => {
            // console.log('server started');
            let url = `http://${this.config.host}:${this.config.port}`
            debug(`server started at ${chalk.green(url)}`)
        })
    }
    async request (req, res) {
        if(this.config.proxy){
            let {path} = url.parse(req.url)
            let options ={
                proxy:this.config.proxy,
                port: this.config.port,
                path,
                headers: req.headers
            }
            let reqProxy = http.get(options,resProxy => {
                res.writeHead(resProxy.statusCode, resProxy.headers)
                resProxy.pipe(res)
            })
            reqProxy.on('error', err => {
                debug(`server proxy error`)
            })
            req.pipe(reqProxy)
        }else {
            let {pathname} = url.parse(req.url)
            if(pathname == '/favicon.ico'){
                return this.sendError(req, res)
            }
            // filter  Unauthorized access
            pathname = path.normalize(pathname.replace(/\.\./g, ""))
            let filepath = path.join(this.config.root, pathname)
            let exists = fs.existsSync(filepath)
                if(!exists){
                    res.writeHead(404, {
                        'Content-Type': 'text/plain'
                    });
                    res.write("This request URL " + pathname + " was not found on this server.");
                    //https://stackoverflow.com/questions/47881451/why-and-when-do-we-use-response-end-and-return-response-end-in-node-js
                  return  res.end();
                }
            try {
                let statObj = await stat(filepath)
                if(statObj.isDirectory()){
                    let files = await readdir(filepath)
                    files = files.map(file => ({
                        name: file,
                        url: path.join(pathname, file)
                    }))
                    let html = this.list({
                        title: pathname,
                        files
                    })
                    res.setHeader('Content-Type', 'text/html')
                    if(this.config.cors){
                        res.setHeader('Access-Control-Allow-Origin', '*')
                        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range')
                    }
                    res.end(html)
                }else{
                    this.sendFile(req,res,filepath,statObj,this.config)
                }
            }catch (e) {
                debug(inspect(e));//inspect把一个对象转成字符
                this.sendError(req, res,e);
            }
        }
    }
    sendFile(req, res, filepath, statObj, config) {
        if(config.cacheSupport){
            let cacheflag = cacheSupport(req,res,filepath,statObj)
            if(cacheflag){return}
        }
        res.setHeader('Content-Type', mime.getType(filepath)+';charset=utf-8');// .jpg
        if(picGuard(req, res, filepath, statObj)) return
        let encoding = encodeZib(req,res)
        let rs = byteRangeStream(req,res,filepath, statObj)
        if(encoding){
            rs.pipe(encoding).pipe(res)
        }else{
            rs.pipe(res);
        }
    }
    sendError(req, res,error) {
        res.statusCode = 500;
        res.end(error.toString());
    }
   
    
}
module.exports = ServerCli


























