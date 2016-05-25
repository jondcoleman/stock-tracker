/* eslint strict:0*/
'use strict'

require('dotenv').config()

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const path = require('path')
const quandl = require('./app/quandl')
const symbols = require('./app/symbols')
const initialStock = 'XOM' // to load chart with some initial data

// state
let stockList = []
let symbolList = []

// add stock to current list of stocks
function addStock(symbol) {
  // TODO: don't add a duplicate stock
  return quandl.getStockData(symbol)
    .then((data) => {
      const newStock = Object.assign({}, data)
      newStock.symbol = symbol
      stockList.push(newStock)
    })
    .catch((err) => {
      process.stdout.write(err)
    })
}

// remove stock from list
function deleteStock(symbol) {
  stockList = stockList.filter((stock) => stock.symbol !== symbol)
}

// get symbol list and add initial stock, then initialize the app
function initializeApp(callback) {
  Promise.all([symbols.getList(), addStock(initialStock)])
    .then((values) => {
      symbolList = values[0]
      callback()
    })
    .catch((err) => {
      throw err
    })
}

initializeApp(() => {
  io.on('connection', (socket) => {
    // on client connect send initial data and symbolList
    socket.emit('stockData', stockList)
    socket.emit('symbolList', symbolList)

    socket.on('addStock', (symbol) => {
      addStock(symbol).then(() => {
        io.sockets.emit('stockData', stockList)
      })
    })

    socket.on('deleteStock', (symbol) => {
      deleteStock(symbol)
      io.sockets.emit('stockData', stockList)
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
