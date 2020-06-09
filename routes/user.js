var express = require("express");
var api  = express.Router();
var db = require("../config/sql")

api.post('/getUserList', function (req, res) {
    var sql = 'SELECT * FROM sys_role WHERE realname = ?'
    console.log(req)
    var req_value = [req.query.realname]
    db.query(sql, req_value, (err, results, fields) => {
        if(err){
            res.json({
                code: '1000',
                message: err
            })
        }
        res.json({
            code: '0000',
            data: results
        })
    })
});

api.get('/get', function (req, res) {
    // 返回的是json类型的数据
    // 温馨提示：在浏览器中输入http://localhost:5888/api/get，可以模拟请求，拿到{"method":"GET","stu":{"name":"韩非","age":32,"height":190}}说明正常
    db.query('SELECT * FROM name', (err, results, fields) => {
        if(err){
            console.log(err);
        }
        res.json({
            method: 'GET',
            stu: results
        })
        console.log(results)
    })
});

api.post('/login', function (req, res) {
    res.json({
        method: 'POST',
        car: {
            brand: 'BWM',
            price: 1900
        }
    })
});
module.exports = api;
