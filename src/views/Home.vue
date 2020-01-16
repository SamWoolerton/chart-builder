<template>
  <div class="h-full">
    <Data
      :baseData="baseData"
      :columns="columns"
      :demo="demo"
      :loading="loading"
      :previewData="previewData"
      @done="focusBuilder"
      @updateData="updateData"
    />
    <Builder :data="data" :columns="columns" :demo="demo" />
  </div>
</template>

<script>
import Data from "../components/data/Data"
import Builder from "../components/builder/Builder"

import { mapObject } from "../utility/functions"
import { smoothScrollTo } from "../utility/scroll"
import { fetchData, readData } from "../utility/data"

import demos from "../demos"

const inferTypes = row =>
  mapObject(row, ([key, value]) => [
    key,
    typeof value === "number" ? "quantitative" : "nominal",
  ])

export default {
  components: { Data, Builder },
  data: () => ({
    baseData: {},
    dataMethod: "",
    columns: {},
    demo: null,
    loading: false,
    loadedData: [],
  }),
  computed: {
    data() {
      const { dataMethod } = this
      return { [dataMethod]: this.baseData[dataMethod] }
    },
    previewData() {
      // first 6 rows
      return this.loadedData.slice(0, 6)
    },
  },
  mounted() {
    // this.useDemo("movies")
  },
  methods: {
    async updateData({ method, value }) {
      this.loading = true
      this.dataMethod = method

      if (method === "url") {
        this.loadedData = await fetchData(value)
        this.baseData.url = value
      } else if (method === "file") {
        this.loadedData = await readData(value)
        this.baseData.values = this.loadedData
      }

      this.columns = inferTypes(this.loadedData[0] || {})
      this.loading = false
    },
    useDemo(demo) {
      const { data, dataMethod, columns } = demos[demo]
      this.baseData = data
      this.dataMethod = dataMethod
      this.columns = columns
      this.demo = demo
    },
    focusBuilder() {
      smoothScrollTo("builder-root")
    },
  },
}
</script>
