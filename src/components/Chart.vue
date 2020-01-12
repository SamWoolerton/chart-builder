<template>
  <section class="flex-grow overflow-hidden">
    <div id="chartRoot">
      <div v-if="data.length === 0">Data is empty!</div>
      <div v-else id="chartContainer" />
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
    // triggers Vega render via watcher
    this.containerWidth = getEl("chartRoot").offsetWidth
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
        debounce(300, ([el]) => {
          const newWidth = el.contentRect.width
          if (Math.abs(newWidth - this.containerWidth) > 20) {
            this.containerWidth = newWidth
          }
        }),
      )

      this.resizeObserver.observe(getEl("chartRoot"))
    },
  },
}
</script>
