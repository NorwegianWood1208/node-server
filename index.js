/**
 * @author Wujy
 * @date 2020/6/3
 * @Description: index
*/
var express = require('express');
var app = express();
var winston =require('winston');
var expressWinston =require('express-winston');


// 正常请求的日志
app.use(expressWinston.logger({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'  //成功的日志记录在log/success.log
        })
    ]
}));


// 登录接口文件
var login = require("./routes/login");
var user = require("./routes/user")
var role = require("./routes/role")
var menu = require("./routes/menu")

app.use("/api", login);
app.use("/api", user);
app.use("/api", role);
app.use("/api", menu);


//记录错误的日志信息
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'   //失败的日志记录在log/success.log
        })
    ]
}));


app.listen(7001)
