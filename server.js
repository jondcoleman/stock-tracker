var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var path = require('path')
var moment = require('moment')
var rp = require('request-promise')

function buildApiUrl(startDate, symbol){
  return `https://www.quandl.com/api/v3/datasets/WIKI/${symbol}/data.json?start_date=${startDate}&api_key=HyHYvuhT6Mm4szEQmauk`
}

function getStockData(symbol, callback) {
  const startDate = moment().subtract(3, 'month').format("YYYY-MM-DD")
  const requestUrl = buildApiUrl(startDate, symbol)
  const requestOptions = {
    url: requestUrl,
    json: true
  }
  rp(requestOptions)
    .then(function (data) {
      data.symbol = symbol
      callback(data)
    })
    .catch(function (err) {
      console.log(err)
    })
}

io.on('connection', function (socket) {
  // io.sockets.emit('init', { stocks: [{stockName: 'XOM'},{stockName: 'APL'}] });
  socket.on('firstStock', function(symbol) {
    getStockData(symbol, function(data) {
      io.sockets.emit('firstStockRes', data)
    })
  })
  socket.on('addStock', function (symbol) {
    getStockData(symbol, function(data) {
      io.sockets.emit('newStock', data)
    })
  })
});

app.use('/dist', express.static('dist'))

app.use('/', function(req, res) {
  res.sendFile(path.join(__dirname+'/public/index.html'));
})

var port = process.env.PORT || 3000

server.listen(port, function(){
  console.log('listening on ' + port)
})
