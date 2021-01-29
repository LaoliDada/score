// var poolConfig = require('./constant.js'),
// mysql = require('mysql');

// const pool = mysql.createPool(poolConfig);

// var query = function (sql,callback){
//   pool.getConnection(function (err,connection){
//     if(err){
//       console.log("数据库连接失败__________",err);
//       callback(err,null,null);
//     }else{
//       console.log("数据库连接成功__________");
//       connection.query(sql,function(qerr,rows,fields){    
//         connection.release();
//         callback(qerr, rows, fields);
//     })
//     }
//   })
// }
// module.exports = query;

//建立数据库连接池
// const mysql = require('mysql');
// const poolConfig = mysql.createPool({
//     host:"127.0.0.1",
//     user:"root",
//     password:"liyi0420",
//     port:3306,
//     database : 'beauty'
// })
// const query = function(sql,callback){
//     poolConfig.getConnection(function(err,connection){
//         if(err){
//             console.log("数据库连接失败__________",err);
//             callback(err,null,null);
//         }else{
//             connection.query(sql,function(qerr,rows,fields){    
//                 connection.release();
// 				callback(qerr, rows, fields);
//             })
//         }
//     })
// }
module.exports = query;