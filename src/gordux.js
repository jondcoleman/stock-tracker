import { UPDATE_STOCKS } from './actions'

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
    default:
      return state
  }
}

document.addEventListener('action', (e) => {
  store = reducer(store, e.detail)
  document.dispatchEvent(new CustomEvent('state'))
}, false)
