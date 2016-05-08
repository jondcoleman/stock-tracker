export const UPDATE_STOCKS = 'UPDATE_STOCKS'

export function updateStocks(stocks) {
  return {
    type: UPDATE_STOCKS,
    stocks
  }
}
