var express = require('express');
var router = express.Router();
var multer  = require('multer');
var qiniu = require("qiniu");
var path = require('path');
var fs = require('fs');
var moment = require('moment');


// 判断文件夹是否存在
var nowDate = new Date();
var theDirName = moment(nowDate).format('YYYYMMDD');
var dateDir = 'uploads/' + theDirName;
var upload = multer({dest: 'uploads/' + theDirName});
var regx = /[\.jpg|\.jpeg|\.png|\.gif]/;

// 七牛配置
var qiniu_conif = {
	accessKey: 'OS6H9uFgrr1gTkIRgcVqBpBOFaG4F4s1C3srj7zU',
	secretKey: 'LS-t4PEj3u5dQ_lJxA3WwjUfrspcKHZKUzVHMpsx',
	bucket: 'linarzstfiles'		//要上传的空间
}

var mac = new qiniu.auth.digest.Mac(qiniu_conif.accessKey, qiniu_conif.secretKey);
console.log('------------mac', mac);

var options = {
  scope: qiniu_conif.bucket
  // returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
  // callbackBodyType: 'application/json'
};
var putPolicy = new qiniu.rs.PutPolicy(options);
// 设置回调
// putPolicy.callbackUrl = 'http://www.zhouyalin.com',
// putPolicy.callbackBody = '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
// putPolicy.callbackBodyType = 'application/json'
var uploadToken=putPolicy.uploadToken(mac);
console.log('------------uploadToken', uploadToken);

var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z1;
// 是否使用https域名
//config.useHttpsDomain = true;
// 上传是否使用cdn加速
//config.useCdnDomain = true;



var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();
var randomNum = Math.random().toString();
var randomNumTxt = randomNum.substring(randomNum.indexOf('.') + 1)
var skey= dateDir + '_' + randomNumTxt;		//上传到七牛后保存的文件名

//构造上传函数
function uploadFile(uptoken, key, localFile) {

    formUploader.putFile(uptoken, key, localFile, putExtra, function(err, ret) {
      if(!err) {
        // 上传成功， 处理返回值
        console.log('=++++++++++++++++++++++=ret', ret);
        // console.log(ret.hash, ret.key, ret.persistentId);       
      } else {
        // 上传失败， 处理返回代码
        console.log(err);
      }
  });
}

// 路由
router.get('/qiniu_file', function (req, res, next) {
	var data = {
		title: '七牛上传'
	};
	
	// 判断文件夹是否存在
	fs.exists(dateDir , function (exists) {
		if (!exists) {
			fs.mkdir(dateDir)
		}
	});

	res.render('qiniu_file', data);
});


// 单文件接口
router.post('/qn_file', upload.single('upFile'), function (req, res, next) {
	console.log('-----------req', req.file)
	
	var fileName = req.file.originalname;

	if (!regx.test(fileName.toLowerCase())) {
		console.log('---------图片只能jpg/jpeg/png/gif',)

		res.status(800).json({
			success: false,
			message: '图片只能jpg/jpeg/png/gif'
		});
	}
	else {
		console.log('--------------匹配')
		var localFile = path.resolve(__dirname, '../uploads', theDirName, req.file.filename);
		//调用uploadFile上传
		uploadFile(uploadToken, skey, localFile);

		res.status(200).json({
			success: true,
			message: '上传成功',
			result: req.file
		});
	}
});

module.exports = router;