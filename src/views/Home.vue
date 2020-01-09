<template>
  <div>
    <h2>Chart builder</h2>
    <div id="vegaContainer" />
  </div>
</template>

<script>
import * as vega from "vega"
import { compile } from "vega-lite"

import { getEl, debounce, loadCSV } from "@/utility/functions"

export default {
  data: () => ({
    containerWidth: null,
    selector: "category",
    valueKey: "value",
    data: [],
    categories: [],
    resizeObserver: null,
  }),
  computed: {
    ui() {
      const width = this.containerWidth
      const height = this.containerWidth * 0.4
      const padding = 0

      return {
        width,
        height,
        padding,
      }
    },
    vegaSpec() {
      const { height, padding } = this.ui

      return {
        $schema: "https://vega.github.io/schema/vega-lite/v4.json",
        data: {
          url: "https://vega.github.io/editor/data/movies.json",
        },
        layer: [
          {
            width: 400,
            height,
            padding,
            autosize: {
              type: "fit",
              contains: "padding",
            },
            mark: "bar",
            encoding: {
              x: {
                field: "MPAA_Rating",
                type: "nominal",
              },
              y: {
                aggregate: "average",
                field: "IMDB_Rating",
                type: "quantitative",
                scale: { domain: [0, 10] },
              },
            },
          },
        ],
      }
    },
  },
  watch: {
    containerWidth() {
      this.loadVega()
    },
  },
  async mounted() {
    await this.getData()
    // triggers Vega via watcher
    this.containerWidth = getEl("vegaContainer").offsetWidth
    this.configureResizeObserver()
  },
  methods: {
    loadVega() {
      if (this.data.length === 0) return

      const vgSpec = compile(this.vegaSpec).spec
      const runtime = vega.parse(vgSpec)
      new vega.View(runtime)
        .logLevel(vega.Warn)
        .initialize(getEl("vegaContainer"))
        .renderer("svg")
        .run()
    },
    async getData() {
      const data = await loadCSV("/usage.csv")
      const categories = ["2017", "2018", "2019"]
      this.data = data
      this.categories = categories
    },
    configureResizeObserver() {
      this.resizeObserver = new ResizeObserver(
        debounce(100, ([vegaContainer]) => {
          this.containerWidth = vegaContainer.contentRect.width
        }),
      )

      this.resizeObserver.observe(getEl("vegaContainer"))
    },
  },
}
</script>
