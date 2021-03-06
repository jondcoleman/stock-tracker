import io from 'socket.io-client'
import * as StockChart from './stock-chart'
import { store } from './gordux'
import * as actions from './actions'

const baseUrl = window.location.origin
const socket = io(baseUrl)

let stockChart
let symbolList

function docReady(fn) {
  if (document.readyState !== 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

docReady(() => {
  const addBtn = document.getElementById('btn-add-stock')
  const stockInput = document.getElementById('stock-to-add')
  const chartContainer = document.getElementById('chart')
  const stockList = document.getElementById('stock-list')

  function render() {
    let html = ''
    store.stocks.forEach((stock) => {
      html += `<div data-symbol=${stock.symbol} class="button big remove icon btn-stock">
        ${stock.symbol}
        </div>`
    })

    stockList.innerHTML = html

    const stocks = document.querySelectorAll('#stock-list > div')

    // add event listeners to each li
    for (let i = 0; i < stocks.length; i++) {
      const curStock = stocks[i]
      curStock.addEventListener('click', (e) => {
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

  function completeInput() {
    addStock(stockInput.value.toUpperCase())
    stockInput.value = ''
  }

  addBtn.addEventListener('click', (e) => {
    e.preventDefault()
    completeInput()
  })

  socket.on('stockData', (stockData) => {
    document.dispatchEvent(
      new CustomEvent('action', {
        detail: actions.updateStocks(stockData)
      })
    )
  })

  socket.on('symbolList', (symbolData) => {
    symbolList = symbolData
    const v = new Awesomplete(stockInput, {
      list: symbolList,
      minChars: 1,
      maxItems: 4
    })
    window.addEventListener('awesomplete-selectcomplete', () => {
      completeInput()
    }, false)
  })
})
