var express = require('express');
var router = express.Router();
var fs = require('fs');
var path= require("path");
var formidable = require('formidable');
router.get('/uploadFile', function (req, res, next) {
	console.log('---------headersInfo', req.headers)
	var data = {
		title: '上传文件'
	}
	res.render('uploadFile', data)
})
	
router.post('/upload', function(req, res, next) {
  console.log('开始文件上传....');
   var form = new formidable.IncomingForm();
    //设置编辑
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = "./public/images/";
    //保留后缀
    form.keepExtensions = true;
    //设置单文件大小限制    
    form.maxFieldsSize = 2 * 1024 * 1024;
    //form.maxFields = 1000;  设置所以文件的大小总和

    form.parse(req, function(err, fields, files) {
      //console.log(fields);
      console.log(files.thumbnail.path);
      console.log('文件名:'+files.thumbnail.name);
            var t = (new Date()).getTime();
            //生成随机数
            var ran = parseInt(Math.random() * 8999 +10000);
            //拿到扩展名
            var extname = path.extname(files.thumbnail.name);

      //path.normalize('./path//upload/data/../file/./123.jpg'); 规范格式文件名
      var oldpath =   path.normalize(files.thumbnail.path);

      //新的路径
      let newfilename=t+ran+extname;
      var newpath =  './public/images/'+newfilename;
      console.warn('oldpath:'+oldpath+' newpath:'+newpath);
      fs.rename(oldpath,newpath,function(err){
        if(err){
              console.error("改名失败"+err);
        }
        res.render('index', { title: '文件上传成功:', imginfo: newfilename });
      });
     
      
      //res.end(util.inspect({fields: fields, files: files}));
    });

   

});

module.exports = router;