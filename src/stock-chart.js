import Chart from 'chart.js'
import * as RandomColor from './random-color'

export function createDatasets(stockData) {
  return stockData.map((stock) => {
    const data = stock.dataset_data.data.map((item) => item[4]) // closing value
    return {
      label: stock.symbol,
      borderColor: RandomColor.get(),
      data
    }
  })
}

export function initChart(chartContainer, stockData) {
  const datasets = createDatasets(stockData)
  const chartLabels = stockData[0].dataset_data.data.map((item) => item[0])
  const options = {
    pointDot: false,
    pointHitDetectionRadius: 0,
    datasetStrokeWidth: 1,
    responsive: true
  }
  const data = {
    labels: chartLabels,
    datasets
  }

  const ctx = chartContainer.getContext('2d')
  return new Chart(ctx, {
    type: 'line',
    data,
    options
  })
}

export function updateChart(stockChart, stockData) {
  const datasets = createDatasets(stockData)

  stockChart.data.datasets = datasets

  stockChart.update()
}
