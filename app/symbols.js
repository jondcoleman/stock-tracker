const Converter = require('csvtojson').Converter
const symbolListFile = ('./data/WIKI-datasets-codes.csv')

// get symbol list from static stock list for use in autocomplete
module.exports = {
  getList() {
    const converter = new Converter({})
    return new Promise((resolve, reject) => {
      converter.fromFile(symbolListFile, (err, result) => {
        if (err) reject(err)
        resolve(result.map((item) => item.Symbol))
      })
    })
  }
}
