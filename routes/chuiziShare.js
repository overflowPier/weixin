var router = require('express').Router();
var gm = require('gm');

router.get('/chuiziShare', function (req, res, next) {
	res.render('chuiziShare', {
		title: '锤子图片生成分享功能'
	});
});


module.exports = router;