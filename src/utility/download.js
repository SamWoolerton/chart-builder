// from https://stackoverflow.com/a/33542499/7170445
export default function downloadFile(filename, data) {
  const blob = new Blob([data], { type: "text/csv" })
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename)
  } else {
    const elem = window.document.createElement("a")
    elem.href = window.URL.createObjectURL(blob)
    elem.download = filename
    document.body.appendChild(elem)
    elem.click()
    document.body.removeChild(elem)
  }
}
