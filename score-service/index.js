var express = require('express');
var http = require('http');
var WebSocket = require('ws');
var fs = require('fs');
const ejs = require('ejs');

var app = express();
app.engine('html', ejs.__express);
app.set('view engine', 'html');
app.use(express.static(__dirname));

var server = http.createServer(app);
var wss = new WebSocket.Server({server});

app.get('/index', function (req, res) {
  res.render('./index.html');
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