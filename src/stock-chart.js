import Chart from 'chart.js'
import * as RandomColor from './random-color'

export function createDatasets(stockData) {
    return stockData.map(function(stock) {
        let data = stock.dataset_data.data.map(function(item) {
            return item[4] //closing value
        })
        return {
            label: stock.symbol,
            borderColor: RandomColor.get(),
            data: data
        }
    })
}

export function initChart(chartContainer, stockData) {
    let datasets = createDatasets(stockData)
    var chartLabels = stockData[0].dataset_data.data.map(function(item) {
        return item[0];
    })
    var options = {
        pointDot: false,
        pointHitDetectionRadius: 0,
        datasetStrokeWidth: 1,
        responsive: true
    }
    var data = {
        labels: chartLabels,
        datasets: datasets
    };

    var ctx = chartContainer.getContext("2d");
    return new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    })
}

export function updateChart(stockChart, stockData) {
    let datasets = createDatasets(stockData)

    stockChart.data.datasets = datasets

    stockChart.update()
}
