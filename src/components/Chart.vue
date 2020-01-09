<template>
  <div>
    <div v-if="data.length === 0">Data is empty!</div>
    <div v-else id="chartContainer" />
  </div>
</template>

<script>
import * as vega from "vega"
import { compile } from "vega-lite"

import { getEl, debounce } from "@/utility/functions"

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    layers: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    containerWidth: null,
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
    spec() {
      const { height, padding } = this.ui

      return {
        $schema: "https://vega.github.io/schema/vega-lite/v4.json",
        data: this.data,
        layer: this.layers.map(layer => ({
          ...layer,
          ...{
            width: 400,
            height,
            padding,
            autosize: {
              type: "fit",
              contains: "padding",
            },
          },
        })),
      }
    },
  },
  watch: {
    containerWidth() {
      this.loadVega()
    },
  },
  async mounted() {
    // triggers Vega render via watcher
    this.containerWidth = getEl("chartContainer").offsetWidth
    this.configureResizeObserver()
  },
  methods: {
    loadVega() {
      if (this.data.length === 0) return

      const vgSpec = compile(this.spec).spec
      const runtime = vega.parse(vgSpec)
      new vega.View(runtime)
        .logLevel(vega.Warn)
        .initialize(getEl("chartContainer"))
        .renderer("svg")
        .run()
    },
    configureResizeObserver() {
      this.resizeObserver = new ResizeObserver(
        debounce(100, ([el]) => {
          this.containerWidth = el.contentRect.width
        }),
      )

      this.resizeObserver.observe(getEl("chartContainer"))
    },
  },
}
</script>
