<template>
  <div class="bg-white px-8 py-8 mt-1">
    <h3 class="text-lg text-center">Export chart config</h3>
    <div class="flex flex-wrap justify-center mt-2 p-4">
      <button @click="copyBasic" class="m-2 secondary">
        <v-icon color="white">mdi-content-copy</v-icon>
        Copy basic config
      </button>
      <button @click="copyFull" class="m-2 secondary">
        <v-icon color="white">mdi-content-copy</v-icon>
        Copy full config
      </button>
      <button @click="download" class="m-2 secondary">
        <v-icon color="white">mdi-download</v-icon>
        Download full config
      </button>
    </div>
  </div>
</template>

<script>
import copyToClipboard from "@/utility/clipboard"
import downloadFile from "@/utility/download"

export default {
  props: {
    layers: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    basicConfig() {
      return JSON.stringify(this.layers)
    },
    fullConfig() {
      return JSON.stringify({
        $schema: "https://vega.github.io/schema/vega-lite/v4.json",
        data: this.data,
        config: {
          axis: {
            labelFont: `"Open Sans", sans-serif`,
            titleFont: `"Open Sans", sans-serif`,
          },
        },
        width: 600,
        height: 600,
        padding: 0,
        autosize: {
          type: "fit",
          contains: "padding",
        },
        layer: this.layers,
      })
    },
  },
  methods: {
    copyBasic() {
      copyToClipboard(this.basicConfig)
    },
    copyFull() {
      copyToClipboard(this.fullConfig)
    },
    download() {
      downloadFile("config.json", this.fullConfig)
    },
  },
}
</script>
