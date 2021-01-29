var express = require('express');
var http = require('http');
var WebSocket = require('ws');
var fs = require('fs');
const ejs = require('ejs');
const query = require('./dataBase/conncetBase');

var app = express();

app.engine('html', ejs.__express);
app.set('view engine', 'html');
app.use(express.static(__dirname));

var server = http.createServer(app);
var wss = new WebSocket.Server({server});

app.get('/index', function (req, res) {
  res.render('./index.html');
})

query("SELECT * FROM ScoreCore",(a,b,c)=>{
  console.log('a_____',a);
  console.log('b_____',b);
  console.log('c_____',c);
})

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    });
});

server.listen(8000, function listening() {
    console.log('服务器启动成功！');
});