<template>
  <section class="flex-grow overflow-hidden">
    <div id="chartRoot">
      <div v-if="layers.length === 0" key="no-layers">
        <div class="py-2">
          <div class="py-12 relative">
            <div class="absolute top-0 bottom-0 left-0 right-0">
              <div class="mt-4 px-16">
                <div class="w-4/5 bg-gray-200 opacity-75 h-16 mt-4" />
                <div class="w-1/2 bg-gray-200 opacity-75 h-16 mt-4" />
                <div class="w-2/3 bg-gray-200 opacity-75 h-16 mt-4" />
                <div class="w-4/5 bg-gray-200 opacity-75 h-16 mt-4" />
                <div class="w-2/5 bg-gray-200 opacity-75 h-16 mt-4" />
              </div>
            </div>
            <div class="relative my-10">
              <div class="mx-auto flex justify-center">
                <div class="rounded-full info mt-2 mb-6 mx-auto p-4">
                  <v-icon color="white">mdi-alert-circle-outline</v-icon>
                </div>
              </div>
              <div class="text-center text-lg font-bold">
                Customise your chart to get started
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="data.length === 0" key="no-data">
        <div class="py-10">
          <div class="m-auto flex justify-center">
            <div class="rounded-full info mt-2 mb-6 mx-auto p-4">
              <v-icon color="white">mdi-alert-circle-outline</v-icon>
            </div>
          </div>
          <div class="text-center text-lg font-bold">
            No data provided.
          </div>
        </div>
      </div>
      <div v-else-if="error" key="error">
        <div class="py-10">
          <div class="m-auto flex justify-center">
            <div class="rounded-full error mt-2 mb-6 mx-auto p-4">
              <v-icon color="white">mdi-alert-circle-outline</v-icon>
            </div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold">
              We've hit an error!
            </div>
            <div class="mt-1">{{ error && error.message }}</div>
          </div>
        </div>
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
