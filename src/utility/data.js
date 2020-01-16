import { parse } from "papaparse"

export const fetchData = async path => {
  const fetcher = path.endsWith("json") ? fetchJson : fetchCsv
  return fetcher(path)
}

export const fetchJson = async path => {
  return (await fetch(path)).json()
}

export const fetchCsv = async path => {
  // Text parsing is async too
  const text = await (await fetch(path)).text()
  return parseCsv(text)
}

export const parseCsv = text =>
  parse(text, { dynamicTyping: true, header: true, skipEmptyLines: "greedy" })
    .data

// original from https://stackoverflow.com/a/56737666/7170445
export const readFile = async file =>
  new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = ({ target: { result } }) => resolve(result)
    reader.readAsText(file)
  })

export const readData = async file => {
  const fetcher = file.type === "application/json" ? readJson : readCsv
  return fetcher(file)
}
export const readCsv = async file => parseCsv(await readFile(file))
export const readJson = async file => JSON.parse(await readFile(file))
