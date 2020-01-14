export const validLayer = layer =>
  !!layer.mark &&
  !!(layer.encoding.x && layer.encoding.x.field) &&
  !!(layer.encoding.y && layer.encoding.y.field)

export const blankLayer = {
  main: { encoding: {} },
  config: { encoding: { x: {}, y: {}, color: {} } },
}
