const moment = require('moment')
const Chart = require('chart.js')
const Ajax = require('simple-ajax')
const io = require('socket.io-client')
const randomcolor = require('randomcolor')

const baseUrl = window.location.origin
const socket = io(baseUrl)
const initialStock = 'XOM'

var stockChart

function docReady(fn) {
  if (typeof fn !== 'function') {
    return
  }
  // Why is this necessary?
  if (document.readyState === 'complete') {
    return fn()
  }
  document.addEventListener('DOMContentLoaded', fn, false)
}

function getRandomColor(transparent) {
  let color = randomcolor({
    format: 'rgb'
  })
    .replace('rgb', 'rgba')
    .replace(/\s/g, "")
    .replace(")", ",1)")
  if (transparent) {
    return color.replace(",1)", ",0.2)")
  }
  return color
}

docReady(function() {
  const addBtn = document.getElementById('btn-add-stock')
  const stockInput = document.getElementById('stock-to-add')
  const chartContainer = document.getElementById('chart')

  function initChart(firstStockData) {
    var dataset = firstStockData.dataset_data.data
    console.log(firstStockData)
    var chartLabels = dataset.map(function(item) {
      return item[0];
    })
    var chartData = dataset.map(function(item) {
      return item[4];
    })
    var options = {
      pointDot: false,
      pointHitDetectionRadius: 0,
      datasetStrokeWidth: 1,
      responsive: true
    }
    var data = {
      labels: chartLabels,
      datasets: [{
        label: firstStockData.symbol,
        // backgroundColor: getRandomColor(true),
        borderColor: getRandomColor(),
        data: chartData
      }]
    };

    var ctx = chartContainer.getContext("2d");
    return new Chart(ctx, {
      type: 'line',
      data: data,
      options: options
    })
  }

  socket.emit('firstStock', 'XOM')
  socket.on('firstStockRes', function(data) {
    stockChart = initChart(data)
    console.log(stockChart)
  })

  function addStockToChart(stockData) {
    console.log('adding to chart', stockData, stockChart)
    var dataset = stockData.dataset_data.data
    var chartData = dataset.map(function(item) {
      return item[4];
    })
    stockChart.data.datasets.push({
      label: stockData.symbol,
      data: chartData,
      // backgroundColor: getRandomColor(true),
      borderColor: getRandomColor()
    })
    stockChart.update()
    console.log(stockChart)
  }

  function getStockData(symbol) {
    socket.emit('addStock', symbol)
  }

  function handleNewStock(symbol) {
    getStockData(symbol, addStockToChart)
  }

  addBtn.addEventListener('click', function(e) {
    handleNewStock(stockInput.value)
    stockInput.value = ""
  })

  socket.on('init', function(stocks) {
    console.log(stocks)
  });
  socket.on('newStock', function(stock) {
    addStockToChart(stock)
  })

})
