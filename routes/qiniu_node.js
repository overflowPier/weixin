var router = require('express').Router(),
	Superagent = require('superagent'),
	formidable = require('formidable'),
	fs = require('fs'),
	url = require('url'),
	qiniu = require('qiniu'),
	request = require('request');


router.get('/qiniu_node', function (req, res, next) {
	res.render('qiniu_node', {
		title: '七牛直接上传，不存到本地'
	})
})

// 七牛配置
var qiniu_conif = {
	accessKey: 'OS6H9uFgrr1gTkIRgcVqBpBOFaG4F4s1C3srj7zU',
	secretKey: 'LS-t4PEj3u5dQ_lJxA3WwjUfrspcKHZKUzVHMpsx',
	bucket: 'linarzstfiles'		//要上传的空间
}

var mac = new qiniu.auth.digest.Mac(qiniu_conif.accessKey, qiniu_conif.secretKey);
var options = {
  scope: qiniu_conif.bucket
  // returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
  // callbackBodyType: 'application/json'
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken=putPolicy.uploadToken(mac);

var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z1;
// 是否使用https域名
//config.useHttpsDomain = true;
// 上传是否使用cdn加速
//config.useCdnDomain = true;

var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();

//构造上传函数
function uploadFile(uptoken, key, localFile) {
  formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
	  respBody, respInfo) {
	  if (respErr) {
	    throw respErr;
	  }
	  console.log('-----------------respInfo', respInfo);
	  if (respInfo.statusCode == 200) {
	     console.log('--------------respBody', respBody);
	  } else {
	    console.log('-----------------respInfo.statusCode', respInfo.statusCode);
	    console.log('--------------errRespBody', respBody);
	  }
  });
}

// 得到key
function getKey (filePath) {
	var imgUrl = decodeURIComponent(filePath);
	var imgExt = imgUrl.substr(imgUrl.lastIndexOf('.') + 1).toLowerCase();
	var options = url.parse(imgUrl);
	var key = options.path.substr(options.path.lastIndexOf('/')-10).replace(/\//g,'-o-');

	return key
}

// 上传文件
router.post('/qn_node_api', function (req, res, next) {
	var form = new formidable.IncomingForm();
	form.encoding = 'utf-8';
	form.keepExtensions = true;
	// form.multiples = true;

	form.parse(req, function(err, fields, file) {	
		uploadFile(uploadToken, getKey(file.upFile.path), file.upFile.path)
	})
})

// request('http://e.hiphotos.baidu.com/image/h%3D300/sign=e548bfb9888ba61ec0eece2f713597cc/0e2442a7d933c895853e2108db1373f082020004.jpg')
// .pipe(fs.createWriteStream("doodle.png"))

// var urlParse = {
//   protocol: 'http:',
//   slashes: true,
//   auth: null,
//   host: 'e.hiphotos.baidu.com',
//   port: null,
//   hostname: 'e.hiphotos.baidu.com',
//   hash: null,
//   search: null,
//   query: null,
//   pathname: '/image/h=300/sign=e548bfb9888ba61ec0eece2f713597cc/0e2442a7d933c895
// 853e2108db1373f082020004.jpg',
//   path: '/image/h=300/sign=e548bfb9888ba61ec0eece2f713597cc/0e2442a7d933c895853e
// 2108db1373f082020004.jpg',
//   href: 'http://e.hiphotos.baidu.com/image/h=300/sign=e548bfb9888ba61ec0eece2f71
// 3597cc/0e2442a7d933c895853e2108db1373f082020004.jpg' 
// }


// var imgUrlTxt = 'http://e.hiphotos.baidu.com/image/h%3D300/sign=e548bfb9888ba61ec0eece2f713597cc/0e2442a7d933c895853e2108db1373f082020004.jpg';
// var imgUrl = decodeURIComponent(imgUrlTxt);
// var imgExt = imgUrl.substr(imgUrl.lastIndexOf('.') + 1).toLowerCase();
// var options = url.parse(imgUrl);
// var saveName = options.path.substr(options.path.lastIndexOf('/')-10).replace(/\//g,'-o-')
// // console.log('=-----------------saveName', saveName);
// var stream = request(imgUrl);
// console.log('--------------------stream', stream);


module.exports = router;