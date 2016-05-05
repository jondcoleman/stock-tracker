'use strict'

var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var path = require('path')
var moment = require('moment')
var rp = require('request-promise')
var _ = require('lodash')

let stockList = []

function buildApiUrl(startDate, symbol) {
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
        .then(function(data) {
            data.symbol = symbol
            callback(data)
        })
        .catch(function(err) {
            console.log(err)
        })
}

function addStock(symbol, callback) {
    getStockData(symbol, function(data) {
        stockList.push(data)
        callback()
    })
}

function deleteStock(symbol, callback) {
  let index = _.findIndex(stockList, function(item) {
    return item.symbol === symbol
  })
  let symbolList = stockList.map(function(stock){
    return stock.symbol
  })
  stockList.splice(index, 1)
  callback()
}

addStock('XOM', function() {})

io.on('connection', function(socket) {
    socket.emit('stockData', stockList)
    socket.on('addStock', function(symbol) {
        addStock(symbol, function() {
            io.sockets.emit('stockData', stockList)
        })
    })
    socket.on('deleteStock', function(symbol) {
        deleteStock(symbol, function() {
          io.sockets.emit('stockData', stockList)
        })
    })
});
app.use('/dist', express.static('dist'))

app.use('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})

var port = process.env.PORT || 3000

server.listen(port, function() {
    console.log('listening on ' + port)
})
