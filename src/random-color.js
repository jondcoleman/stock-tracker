const randomcolor = require('randomcolor')

export function get(transparent) {
  const color = randomcolor({
    format: 'rgb'
  })
    .replace('rgb', 'rgba')
    .replace(/\s/g, '')
    .replace(')', ',1)')
  if (transparent) {
    return color.replace(',1)', ',0.2)')
  }
  return color
}
