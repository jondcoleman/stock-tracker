import { UPDATE_STOCKS, REMOVE_STOCK } from './actions'
import _ from 'lodash'

export let store = {
    stocks: []
}

export function reducer(state, action) {
    let newStockList = []
    switch (action.type) {
        case UPDATE_STOCKS:
            newStockList = action.stocks
            return Object.assign({}, {
                stocks: newStockList
            })
        case REMOVE_STOCK:
          let symbol = action.symbol
          let index = _.findIndex(store.stocks, function(stock) {
            return stock.symbol === symbol
          })
          console.log(index)
          newStockList = store.stocks.splice(index, 1)
          return Object.assign({}, {
              stocks: newStockList
          })
        default:
            return state
    }
}

document.addEventListener('action', function(e) {
    console.log(e.detail)
    store = reducer(store, e.detail)
    document.dispatchEvent(new CustomEvent('state'))
}, false)
