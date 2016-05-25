const moment = require('moment')
const rp = require('request-promise')

function buildApiUrl(startDate, symbol) {
  return `https://www.quandl.com/api/v3/datasets/WIKI/${symbol}/data.json?start_date=${startDate}&api_key=${process.env.API_KEY}`
}

module.exports = {
  getStockData(symbol) {
    const startDate = moment().subtract(3, 'month').format('YYYY-MM-DD')
    const requestUrl = buildApiUrl(startDate, symbol)
    const requestOptions = {
      url: requestUrl,
      json: true
    }
    return rp(requestOptions)
  }
}
