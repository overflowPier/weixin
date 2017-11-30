var router = require('express').Router();
var Superagent = require('superagent');

// 基本信息
var wxConfig = {
	appId: 'wx487526afe7cbbfdc',
	appSecret: 'd95a50d76243e9e78fdbd8e089b9c5a9'
};


// 第三方登录页面路由
router.get('/login', function (req, res, next) {
	res.render('login', {
		title: '第三方登录'
	})
});


// 获取 code
router.get('/getCode', function (req, res, next) {

});

// 获取 access_token
router.get('/getAccess_token', function (req, res, next) {

});

module.exports = router;