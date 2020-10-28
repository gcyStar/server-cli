/**
 * Created by chunyang.gao on 2018/3/1.
 */

function cacheSupport(req, res, filepath, statObj) {
    let ifModifiedSince = req.headers['if-modified-since'];
    let isNoneMatch = req.headers['is-none-match'];
    res.setHeader('Cache-Control', 'private,max-age=30');
    res.setHeader('Expires', new Date(Date.now() + 15 * 1000).toGMTString());
    let etag = statObj.size;
    let lastModified = statObj.ctime.toGMTString();
    
    res.setHeader('ETag', etag);
    res.setHeader('Last-Modified', lastModified);
    console.log(etag,lastModified)
    console.log(isNoneMatch,ifModifiedSince)

    if(isNoneMatch && isNoneMatch != etag || ifModifiedSince && ifModifiedSince != lastModified){
       return false
   }
    if(!isNoneMatch &&!ifModifiedSince){
        return false
    }
    res.writeHead(304)
    res.end()
    return true
}
module.exports = {
    cacheSupport
}