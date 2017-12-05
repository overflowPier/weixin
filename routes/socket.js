var express = require('express');
var router = express.Router();
var io = global.io;
// console.log('-------->io', io);

router.get('/socket', function (req, res, next) {
	res.render('socket', {
		title: 'socket简单练习'
	})
});

// io.on('connection', function(socket){
//   console.log('a user connected');

//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
    
//   socket.on('chat message', function(msg){
//     console.log('message: ' + msg);

//     io.emit('chat message', msg);
//   });

// });

module.exports = router;