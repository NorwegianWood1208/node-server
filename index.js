
/**
 * Created by wujy on 2020/06/03.
 */
var express = require('express');
var app = express();


var login = require("./routes/login");





// connection.query('SELECT * FROM name', (err, results, fields) => {
//     if(err){
//         console.log(err);
//     }
//     app.get('/api/get', function (req, res) {
//         // 返回的是json类型的数据
//         // 温馨提示：在浏览器中输入http://localhost:5888/api/get，可以模拟请求，拿到{"method":"GET","stu":{"name":"韩非","age":32,"height":190}}说明正常
//         res.json({
//             method: 'GET',
//             stu: results
//         })
//     });
//     console.log(results);
// })



// app.post('/api/post', function (req, res) {
//     res.json({
//         method: 'POST',
//         car: {
//             brand: 'BWM',
//             price: 1900
//         }
//     })
// });

app.use("/api", login);

app.listen(7001)