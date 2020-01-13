export const getEl = id => document.getElementById(id)
export const pluck = key => obj => obj[key]
export const pluckMany = (...keys) => obj =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)))
export const identity = d => d
export const unique = arr => [...new Set(arr)]
export const debounce = (wait, callback) => {
  let timeout = null
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback(...args), wait)
  }
}
export const loadCSV = async path => {
  // Text parsing is async too
  const text = await (await fetch(path)).text()
  const [, ...rows] = text.split("\n")

  return rows
    .filter(row => row !== "")
    .map(row => {
      const [category, month, value] = row.split(",")
      return { category, month, value }
    })
}
export const removeChildren = el => {
  while (el.firstChild && !el.firstChild.remove());
}
export const mapObject = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(fn))
