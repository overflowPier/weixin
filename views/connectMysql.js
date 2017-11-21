var express = require('express');
var app = express();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    port : 3306,
    database : 'test'
})

sql = 'select * from websites';

var arr = [];
connection.query(sql,function (err, results) {
    if (err){
        console.log(err)
    }else{
        console.log(results);
        for(var i = 0;i < results.length;i++){
            arr[i] = results[i].name;
        }

        app.get('/',function (req, res) {
            res.send(arr);  //这里必须用res.send,因为有数据返回到客户端
        })
    }
})

app.listen(3001);