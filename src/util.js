/**
 * Created by chunyang.gao on 2018/2/25.
 */
let zlib = require('zlib')
let fs = require('fs')
let handlebars = require('handlebars')
let path = require('path')

function encodeZib(req, res){
    let acceptEncoding = req.headers['accept-encoding']
    if(/\bgzip\b/.test(acceptEncoding)){
        res.setHeader('Content-Encoding','gzip')
        return zlib.createGzip()
    }else if(/\bdeflate\b/.test(acceptEncoding)){
        res.setHeader('Content-Encoding','deflate')
        return zlib.createDeflate()
    }else {
        return null
    }
}

function detailInfoList() {
    let tmpl = fs.readFileSync(path.resolve(__dirname, 'template', 'detail-info.html'), 'utf8')
    return handlebars.compile(tmpl)
}
function byteRangeStream(req, res, filepath, statObj) {
    let start = 0
    let end = statObj.size-1
    let range = req.headers['range']
    if (range){
        res.setHeader('Accept-Range','bytes')
        res.statusCode = 206 //表示返回内容的一部分
        let result = range.match(/bytes=(\d*)-(\d*)/);
        if (result) {
            start = isNaN(result[1]) ? start : parseInt(result[1]);
            end = isNaN(result[2]) ? end : parseInt(result[2]) - 1;
        }
    }
    return fs.createReadStream(filepath,{
        start,
        end
    })
}
module.exports ={
    encodeZib,
    detailInfoList,
    byteRangeStream
}