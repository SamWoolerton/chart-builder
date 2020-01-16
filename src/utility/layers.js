/**
 * Valid mark
 * Valid x and y field
 * If boxplot then at least x or y needs to be quantitative
 */
export const validLayer = layer =>
  !!layer.mark &&
  layer.mark.type &&
  !!(layer.encoding.x && layer.encoding.x.field) &&
  !!(layer.encoding.y && layer.encoding.y.field) &&
  (layer.mark.type !== "boxplot" ||
    layer.encoding.x.type === "quantitative" ||
    layer.encoding.y.type === "quantitative")

export const blankLayer = {
  name: "Layer 1",
  main: { encoding: {} },
  config: { encoding: { x: {}, y: {}, color: {} } },
}
