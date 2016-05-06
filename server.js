/* eslint strict:0*/
'use strict'

require('dotenv').config()

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const path = require('path')
const moment = require('moment')
const rp = require('request-promise')
const _ = require('lodash')

const initialStock = 'XOM'
const stockList = []

function buildApiUrl(startDate, symbol) {
  return `https://www.quandl.com/api/v3/datasets/WIKI/${symbol}/data.json?start_date=${startDate}&api_key=${process.env.API_KEY}`
}

function getStockData(symbol, callback) {
  const startDate = moment().subtract(3, 'month').format('YYYY-MM-DD')
  const requestUrl = buildApiUrl(startDate, symbol)
  const requestOptions = {
    url: requestUrl,
    json: true
  }
  rp(requestOptions)
    .then((json) => {
      const data = Object.assign({}, json)
      data.symbol = symbol
      callback(data)
    })
    .catch((err) => {
      process.stdout.write(err)
    })
}

function addStock(symbol, callback) {
  getStockData(symbol, (data) => {
    stockList.push(data)
    if (callback) callback()
  })
}

function deleteStock(symbol, callback) {
  const index = _.findIndex(stockList, (item) => item.symbol === symbol)
  stockList.splice(index, 1)
  callback()
}

addStock(initialStock)

io.on('connection', (socket) => {
  socket.emit('stockData', stockList)
  socket.on('addStock', (symbol) => {
    addStock(symbol, () => {
      io.sockets.emit('stockData', stockList)
    })
  })
  socket.on('deleteStock', (symbol) => {
    deleteStock(symbol, () => {
      io.sockets.emit('stockData', stockList)
    })
  })
})

app.use('/dist', express.static('dist'))
app.use('/public', express.static('public'))

app.use('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public/index.html`))
})

const port = process.env.PORT || 3000

server.listen(port, () => {
  process.stdout.write(`listening on ${port}`)
})
