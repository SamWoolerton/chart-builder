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

export const parseCsv = text => {
  const [, ...rows] = text.split("\n")

  return rows
    .filter(row => row !== "")
    .map(row => {
      const [category, month, value] = row.split(",")
      return { category, month, value }
    })
}
