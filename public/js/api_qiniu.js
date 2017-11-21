var qiniu = require("qiniu")

var accessKey = 'your access key';
var secretKey = 'your secret key';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);