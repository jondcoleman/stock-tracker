'use strict'
import Ajax from 'simple-ajax'
import io from 'socket.io-client'
import * as StockChart from './stock-chart'
import { store } from './gordux'
import * as actions from './actions'

const baseUrl = window.location.origin
const socket = io(baseUrl)

var stockChart

function docReady(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

docReady(function() {
    const addBtn = document.getElementById('btn-add-stock')
    const stockInput = document.getElementById('stock-to-add')
    const chartContainer = document.getElementById('chart')
    const stockList = document.getElementById('stock-list')

    function render() {
      console.log('render', store.stocks)
      let html = ''
      store.stocks.forEach(function(stock) {
          console.log(stock)
          html += `<div data-symbol=${stock.symbol} class="button big remove icon btn-stock">${stock.symbol}</div>`
      })

      document.getElementById('stock-list').innerHTML = html

      let stocks = document.querySelectorAll('#stock-list > div')

      // add event listeners to each li
      for (let i = 0; i < stocks.length;  i++) {
        let curStock = stocks[i]
        curStock.addEventListener('click', function(e) {
          // document.dispatchEvent(
          //   new CustomEvent('action', {
          //     detail: actions.removeStock(e.target.dataset.symbol)
          //   })
          // )
          console.log(e.target.dataset.symbol)
          socket.emit('deleteStock', e.target.dataset.symbol)
        }, false)
      }

      // init or update the chart
      if (stockChart === undefined) {
        stockChart = StockChart.initChart(chartContainer, store.stocks)
      } else {
        StockChart.updateChart(stockChart, store.stocks)
      }

    }

    document.addEventListener('state', render)

    function addStock(symbol) {
        socket.emit('addStock', symbol)
    }

    addBtn.addEventListener('click', function(e) {
        e.preventDefault()
        addStock(stockInput.value.toUpperCase())
        stockInput.value = ""
    })

    socket.on('stockData', function(stockData) {
        document.dispatchEvent(
            new CustomEvent('action', {
                detail: actions.updateStocks(stockData)
            })
        )
    })

    socket.on('init', function(stocks) {
        console.log(stocks)
    });

})
