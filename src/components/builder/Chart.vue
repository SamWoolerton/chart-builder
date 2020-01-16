<template>
  <section class="flex-grow overflow-hidden">
    <div id="chartRoot">
      <div v-if="data.length === 0" key="empty">Data is empty!</div>
      <div
        v-else-if="error"
        class="bg-red-200 text-red-800 px-4 py-3"
        key="error"
      >
        We've hit an error! {{ error.message }}
      </div>
      <div v-else id="chartContainer" key="chart" />
    </div>
  </section>
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
    chartRoot: null,
    chartContainer: null,
    error: null,
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
      const { width, height, padding } = this.ui

      return {
        $schema: "https://vega.github.io/schema/vega-lite/v4.json",
        data: this.data,
        config: {
          axis: {
            labelFont: `"Open Sans", sans-serif`,
            titleFont: `"Open Sans", sans-serif`,
          },
        },
        width,
        height,
        padding,
        autosize: {
          type: "fit",
          contains: "padding",
        },
        layer: this.layers,
      }
    },
  },
  watch: {
    containerWidth() {
      this.loadVega()
    },
    layers: {
      handler() {
        this.loadVega()
      },
      deep: true,
    },
    data: {
      handler() {
        this.loadVega()
      },
      deep: true,
    },
  },
  async mounted() {
    this.chartRoot = getEl("chartRoot")
    this.chartContainer = getEl("chartContainer")

    // triggers Vega render via watcher
    this.containerWidth = this.chartRoot.offsetWidth
    this.configureResizeObserver()
  },
  methods: {
    loadVega() {
      if (this.data.length === 0) return
      this.error = null

      try {
        const vgSpec = compile(this.spec).spec
        const runtime = vega.parse(vgSpec)
        new vega.View(runtime)
          .logLevel(vega.Warn)
          .initialize(this.chartContainer)
          .renderer("svg")
          .run()
      } catch (err) {
        this.error = err
      }
    },
    configureResizeObserver() {
      this.resizeObserver = new ResizeObserver(
        debounce(300, async ([el]) => {
          const newWidth = el.contentRect.width
          if (Math.abs(newWidth - this.containerWidth) > 20) {
            this.containerWidth = newWidth
          }
        }),
      )

      this.resizeObserver.observe(this.chartRoot)
    },
  },
}
</script>
