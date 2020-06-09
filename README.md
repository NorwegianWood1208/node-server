# node-server
前端进阶路上node是躲不过去的技术栈，对于大部分前端来说，都或多或少的写过一些node代码或者demo，接下来就一步一步构建属于自己的node后台接口。

技术栈：node.js、express框架、mysql、pm2

## 写在前面
    
这篇博客适合有一定前端开发经验、学习过一点node.js的同学，因为项目当中使用了非常多的es6语法，所以最好对es6也有一定的了解。

# 一、express

## 1、新建一个js文件（index.js）
    
## 2、全局安装：
    npm install express --save
    
## 3、js文件引入express

    var express = require('express');
    var app = express();
    
## 4、新建一个get请求的接口
    
    app.get('/api/get', function (req, res) {
        // 返回的是json类型的数据
        // 温馨提示：在浏览器中输入http://localhost:8000/api/get，可以模拟请求，拿到{"method":"GET","data":{"name":"wanghuahua","age":18}}说明正常
        res.json({
            method: 'GET',
            data: [{
                name: 'wanghuahua',
                age: 18
            }]
        })
    });

## 5、app.listen(8000)

浏览器输入http://localhost:8000/api/get，OK，一个node接口就开发完了。

完成这一步，恭喜你，你已经是一个全栈开发工程师了！

一切不从实战出发的的学习都是耍流氓，把刚开发完的接口连上数据库才能更逼真。

# 二、连接数据库

## 1、远程连接数据库
    
    需要一个可视化工具，Navicat之类，这里就以Navicat为例
    
    在阿里云配置数据库的时候，需要配置外网地址和账号密码
    
    打开Navicat直接连接就好了
    
    随便建一个库，库里面建一个表

## 2、安装mysql
    
    npm install mysql --save
    
## 3、项目引入sql
    
    var mysql = require('mysql');     //引入mysql模块
    
## 4、创建一个sql实例，加入配置
    
    var connection = mysql.createConnection({      //创建mysql实例
        host: 'rm-xxxxxxxx.mysql.zhangbei.rds.aliyuncs.com',	// 连接的sql地址,外网地址
        user: 'jerry',	// 用户名
        password: 'xxxxxx',	// 用户密码
        database: 'xx'	// 选择的库
    });
    connection.connect();
    
## 5、接口里面使用数据库的数据
    
    app.get('/api/get', function (req, res) {
        // 返回的是json类型的数据
        connection.query('SELECT * FROM name', (err, results, fields) => {
            if(err){
                console.log(err);
            }
            res.json({
                method: 'GET',
                data: results
            })
        })
    });
    
在浏览器中输入http://localhost:8000/api/get，拿到刚才新建表中的数据

数据库连接成功！

# 三、封装sql
    
项目中要使用express，肯定要使用路由进行多模块开发，每一个模块都创建一个sql实例，就太麻烦了，把sql抽离出来，进行一些封装，让代码看起来更加优雅。

    
## 1、新建一个config目录
    
    目录下是baseData.js和sql.js两个文件
    
## 2、basedata.js里面放数据库配置
    
    module.exports = {
        host: 'rm-xxxxxx.mysql.zhangbei.rds.aliyuncs.com',	// 连接的服务器
        user: 'jerry',	// 用户名
        password: '@xxxxxx',	// 用户密码
        database: 'pt'	// 选择的库
    }
    
## 3、sql.js里面用来暴露一个方法
    
    var mysql = require('mysql');
    var database = require('./config')
    //向外暴露方法
    module.exports = {
        query : function(sql,params,callback){
            //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
            var connection = mysql.createConnection(database);        
            connection.connect(function(err){
                if(err){
                    console.log('数据库链接失败');
                    throw err;
                }
             //开始数据操作
             //传入三个参数，第一个参数sql语句，第二个参数sql语句中需要的数据，第三个参数回调函数
            connection.query( sql, params, function(err,results,fields ){
               if(err){
                    console.log('数据操作失败');
                    throw err;
                }
                //将查询出来的数据返回给回调函数
                callback && callback(results, fields);
                //results作为数据操作后的结果，fields作为数据库连接的一些字段
                //停止链接数据库，必须再查询语句后，要不然一调用这个方法，就直接停止链接，数据操作就会失败
                 connection.end(function(err){
                      if(err){
                          console.log('关闭数据库连接失败！');
                          throw err;
                      }
                  });
               });
           });
        }
    };
    
## 3、修改index.js

刚才的index.js就可以直接引入封装好的sql了

    var db = require("../config/sql")
    
    app.get('/api/get', function (req, res) {
        db.query('SELECT * FROM name', (err, results, fields) => {
            if(err){
                console.log(err);
            }
            res.json({
                method: 'GET',
                data: results
            })
        })
    });   

sql就封装完成了

# 四、使用express路由

要开发整套的接口，不可能一个js文件上开发，要模块化开发就得使用router，express的路由非常方便。
    
## 1、新建一个routes文件夹
    
    里面放需要模块化的接口文件（user.js）
        
## 2、开发user.js
    
    var express = require("express");
    var api  = express.Router();
    var db = require("../config/sql")
    
    api.post('/getUserList', function (req, res) {
        db.query('SELECT * FROM sys_user', (err, results, fields) => {
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
    
    module.exports = api;
    
## 3、修改index.js
    
    var user = require("./routes/user")
    app.use("/api", user);
    
这样user.js模块的接口就挂在api下面，可以暴露出来请求了

# 五、mysql基本操作
    
因为我们用的是mysql当做数据库来开发，，虽然后面为了写的更快，会使用sequelize这些工具，但是要做一个全栈，sql语句肯定要掌握。
    
此处的语句示例来自21分钟mysql入门教程:

## 1、查询

select 列名称 from 表名称 where 条件

查询年龄在21岁以上的所有人信息: select * from students where age > 21


## 2、新增

insert [into] 表名 [(列名1, 列名2, 列名3, ...)] values (值1, 值2, 值3, ...);

insert into students values(NULL, "吴建运", "男", 20, "13811371377");

## 3、update

update 表名称 set 列名称=新值 where 更新条件;

将id为5的手机号改为默认的"-": update students set tel=default where id=5;

## 4、delete

delete from 表名称 where 删除条件;

删除id为2的行: delete from students where id=2;

## 5、添加列

alter table 表名 add 列名 列数据类型 [after 插入位置];

在表的最后追加列 address: alter table students add address char(60);

## 6、修改列

alter table 表名 change 列名称 列新名称 新数据类型;

将表 tel 列改名为 telphone: alter table students change tel telphone char(13) default "-";

## 7、删除列

alter table 表名 drop 列名称;

删除 birthday 列: alter table students drop birthday;

## 8、重命名表

alter table 表名 rename 新表名;

重命名 students 表为 workmates: alter table students rename workmates;

## 9、删除表

drop table 表名;

删除 workmates 表: drop table workmates;

## 10、删除整个数据库

drop database 数据库名

samp_db 数据库: drop database samp_db;

## 写在结尾
    
项目做到这儿，写几个增删改查的接口没啥问题了，但是如果想系统的搭建一个项目的架构，可能还需要很多的组件、工具

比如日志、获取请求参数的body-parser、实现ORM的sequelize等等
    
