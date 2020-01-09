export const getEl = id => document.getElementById(id)
export const pluck = key => obj => obj[key]
export const pluckMany = (...keys) => obj =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)))
export const identity = d => d
export const unique = arr => [...new Set(arr)]
export const debounce = (wait, callback) => {
  let timeout = null
  return (...args) => {
    const next = () => callback(...args)
    clearTimeout(timeout)
    timeout = setTimeout(next, wait)
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
