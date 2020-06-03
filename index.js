/**
 * @author Wujy
 * @date 2020/6/3
 * @Description: index
*/
var express = require('express');
var app = express();

// 登录接口文件
var login = require("./routes/login");
var user = require("./routes/user")


app.use("/api", login);
app.use("/api", user);

app.listen(7001)
