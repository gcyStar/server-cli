/**
 * Created by chunyang.gao on 2018/2/28.
 */
let url = require('url')
let path = require('path')
let mime = require('mime')
let fs = require('fs')
const whiteList = [
    'localhost'
]

function picGuard(req, res, filepath, statObj) {
    let refer = req.headers['referer'] || req.headers['refer']
    if(refer){
        let referHost = url.parse(refer, true).hostname
        let currentHost = url.parse(req.url, true).hostname
        if(currentHost!= referHost &&  whiteList.indexOf(referHost) == -1){
            res.setHeader('Content-Type', mime.getType(filepath))
            fs.createReadStream(path.join(__dirname,'/asset/imgs/picGuard.png')).pipe(res)
            return true
        }
    }
    return false
}
module.exports = {
    picGuard
}