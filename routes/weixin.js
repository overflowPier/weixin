var router = require('express').Router();
var request = require('superagent');
var wxUrl = 'https://api.weixin.qq.com/cgi-bin';
var wxOauth2Url = 'https://open.weixin.qq.com/connect/oauth2';

var wx = {
	grant_type: 'client_credential',
	appid: 'wx487526afe7cbbfdc',
	secret: '2cab5c70608be99c5b3f6b98566685ad'
}

router.get('/token', function (req, res, next) {
	request.get(wxUrl + '/token')
		.query(wx)
		.then(function (tokenRes) {
			res.send(tokenRes)
		})
		.catch(function (err) {
			res.send(err)
		});
});

router.get('/groupGet', function (req, res, next) {
	request.get(wxUrl + '/token')
	.query(wx)
	.then(function (tokenRes) {

		request.get(wxUrl + '/groups/get')
		.query({access_token: tokenRes.body.access_token})
		.then(function (groupRes) {
			res.send(groupRes)
		})
		.catch(function (groupErr) {
			res.send(groupErr)
		})
	})
	.catch(function (tokenErr) {
		res.send(tokenErr)
	})
});

// 第一步：用户同意授权，获取code
function getCode (res, appid, rUri, scopeType, state) {
    request.get(wxOauth2Url + '/authorize?appid='+ appid +'&redirect_uri='+ rUri +'&response_type=code&scope='+ scopeType +'&state='+ state +'#wechat_redirect')
        .then(function (codeRes) {
            res.send(codeRes)
        })
        .catch(function (err) {
            res.send(err)
        })
}


// 请求基本的code， snsapi_base 不弹出授权页面，直接跳转，只能获取用户openid
router.get('/getBaseCode', function (req, res) {
    getCode(res, wx.appid, 'http://h5.cloudm.com/index.html', 'snsapi_base', 'cloudm');
})

// 在授权后获取该用户的基本信息。  可通过openid拿到昵称、性别、所在地。并且，即使在未关注的情况下，只要用户授权，也能获取其信息
router.get('/getUserinfoCode', function(req, res) {
	getCode(res, wx.appid, 'http://h5.cloudm.com/index.html', 'snsapi_userinfo', 'cloudm');
})

module.exports = router;