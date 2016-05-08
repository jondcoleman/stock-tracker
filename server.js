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
const Converter = require('csvtojson').Converter

const symbolListFile = ('./data/WIKI-datasets-codes.csv')

const initialStock = 'XOM'

// state
let stockList = []
let symbolList = []

function fillSymbolList(callback) {
  const converter = new Converter({})
  converter.fromFile(symbolListFile, (err, result) => {
    symbolList = result.map((item) => item.Symbol)
    callback(result)
  })
}

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
  stockList = stockList.filter((stock) => stock.symbol !== symbol)
  callback()
}

function initializeApp(callback) {
  fillSymbolList(callback)
  addStock(initialStock)
}

initializeApp(() => {
  console.log(symbolList[1])
  io.on('connection', (socket) => {
    socket.emit('stockData', stockList)
    socket.emit('symbolList', symbolList)
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
})
