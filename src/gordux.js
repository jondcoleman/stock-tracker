import { UPDATE_STOCKS, REMOVE_STOCK } from './actions'
import _ from 'lodash'

export let store = {
  stocks: []
}

export function reducer(state, action) {
  let newStockList = []
  let symbol
  let index
  switch (action.type) {
    case UPDATE_STOCKS:
      newStockList = action.stocks
      return Object.assign({}, {
        stocks: newStockList
      })
    case REMOVE_STOCK:
      symbol = action.symbol
      index = _.findIndex(store.stocks, (stock) => stock.symbol === symbol)
      newStockList = store.stocks.splice(index, 1)
      return Object.assign({}, {
        stocks: newStockList
      })
    default:
      return state
  }
}

document.addEventListener('action', (e) => {
  store = reducer(store, e.detail)
  document.dispatchEvent(new CustomEvent('state'))
}, false)
