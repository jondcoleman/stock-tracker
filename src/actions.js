export const UPDATE_STOCKS = 'UPDATE_STOCKS'
export const REMOVE_STOCK = 'REMOVE_STOCK'

export function updateStocks(stocks) {
  return {
    type: UPDATE_STOCKS,
    stocks
  }
}

export function removeStock(symbol) {
  return {
    type: REMOVE_STOCK,
    symbol
  }
}
