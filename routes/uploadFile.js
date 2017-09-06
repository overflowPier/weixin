var express = require('express');
var router = express.Router();
var fs = require('fs');
var path= require("path");
var fs = require('fs');
var formidable = require('formidable');

router.get('/uploadFile', function (req, res, next) {
	// console.log('---------headersInfo', req.headers)
	var data = {
		title: '上传文件'
	}
	res.render('uploadFile', data)
})

/************************ 
  formidable 中间件的使用
********************************/
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

/************************ 
  multer 中间件的使用
********************************/
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    console.log('+=======++', file)
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({storage: storage});

var imgFilter = function (req, file, cb) {
  if (file.mimetype != 'image/jpeg' || file.mimetype != 'image/jpg' || file.mimetype != 'image/gif' || file.mimetype != 'image/png') {
    // cb(new Error('图片只能jpg/jpeg/png/gif'))  
    cb(null, false)
  }
  else {
    cb(null, true)
  }
}

// upload.fileFilter = imgFilter

// 单文件的上传练习
router.post('/m_single', upload.single('avatar'), function (req, res, next) {
  console.log('--------------', req.file)
  console.log(typeof req.file.mimetype)
  console.log('------req.file.mimetype', req.file.mimetype)
  // console.log('------------jpeg', typeof req.file.mimetype == "image\/jpeg")
  // console.log('------------jpg', typeof req.file.mimetype == "image\/jpg")
  // console.log('------------gif', typeof req.file.mimetype == "image\/gif")
  // console.log('------------png', typeof req.file.mimetype == 'image\/png')

  var originalname = req.file.originalname
  var ext = originalname.substring(originalname.lastIndexOf('.') + 1)
  console.log('------------jpeg', req.file.mimetype == "image/jpeg", ext == "jpeg")
  console.log('------------jpg', req.file.mimetype == "image/jpg", ext == "jpg")
  console.log('------------gif', req.file.mimetype == "image/gif", ext == "gif")
  console.log('------------png', req.file.mimetype == 'image/png', ext == "png")


  if (ext != "jpeg" && ext != "jpg" && ext != "gif" && ext != "png") {
    res.status(400).send({
      message: '图片只能jpg/jpeg/png/gif',
      result: null,
      success: false,
      code: -2
    })
  }
  else {
    res.status(200).send({
      message: '上传图片成功',
      success: true,
      result: [req.file.path],
      code: 1
    })
  }
})


router.post('/m_multipart', upload.fields([{ name: 'file', maxCount: 1 }, {name:'ss', maxCount: 1 }]), function (req, res, next) {
  console.log('----------req.files', req.files)
  //   var filesArr = req.files.filter(function (item, index) {
  //   var originalname = item.file.originalname
  //   var ext = originalname.substring(originalname.lastIndexOf('.') + 1)

  //   console.log('----------ext')
  //   if (ext != "jpeg" && ext != "jpg" && ext != "gif" && ext != "png") {
  //     return false
  //   }
  //   else {
  //     return true
  //   }
  // })

  // if (filesArr.length === 0) {
  //   res.status(400).send({
  //     message: '图片只能jpg/jpeg/png/gif',
  //     result: null,
  //     success: false,
  //     code: -2
  //   })
  // }
  // else {
  //   res.status(200).send({
  //     message: '上传图片成功',
  //     success: true,
  //     result: [req.file.path],
  //     code: 1
  //   })
  // }
})

module.exports = router;