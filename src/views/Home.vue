<template>
  <div class="relative">
    <Data
      :baseData="baseData"
      :columns="columns"
      :demo="demo"
      :loading="loading"
      :previewData="previewData"
      @done="focusBuilder"
      @updateData="updateData"
      @removeColumn="removeColumn"
      @updateColumnType="updateColumnType"
    />
    <Builder
      v-if="loadedData.length > 0"
      :data="data"
      :columns="columns"
      :demo="demo"
    />
    <div
      class="absolute bottom-0 inset-x-0 mb-3 text-center text-sm color-gray-700"
    >
      This project uses
      <a href="https://vega.github.io/vega-lite/" class="font-semibold"
        >Vega-Lite</a
      >
    </div>
  </div>
</template>

<script>
import Data from "@/components/data/Data"
import Builder from "@/components/builder/Builder"

import { mapObject, strIsValidDate } from "@/utility/functions"
import { smoothScrollTo } from "@/utility/scroll"
import { fetchData, readData } from "@/utility/data"
import demos from "@/config/demos"

const inferTypes = row =>
  mapObject(row, ([key, value]) => [
    key,
    {
      type:
        typeof value === "number"
          ? "quantitative"
          : strIsValidDate(value)
          ? "temporal"
          : "nominal",
    },
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
    this.useDemo("movies")
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
      return
    },
    async useDemo(demo) {
      const { data, dataMethod, columns } = demos[demo]
      this.demo = demo
      await this.updateData({ method: dataMethod, value: data[dataMethod] })

      if (columns) {
        // could instead rely on it automatically detecting column types
        this.columns = columns

        // remove every column that's not specified in the demo
        const columnNames = Object.keys(columns)
        Object.keys(this.loadedData[0])
          .filter(column => !columnNames.includes(column))
          .forEach(column => this.removeColumnByName(column))
      }

      await this.$nextTick()
      this.focusBuilder()
    },
    removeColumnByName(name) {
      this.$delete(this.columns, name)
      // eslint-disable-next-line
      this.loadedData = this.loadedData.map(({ [name]: n, ...cell }) => cell)
    },
    removeColumn(index) {
      const name = Object.keys(this.columns)[index]
      this.$delete(this.columns, name)
      // eslint-disable-next-line
      this.loadedData = this.loadedData.map(({ [name]: n, ...cell }) => cell)
    },
    updateColumnType({ column, type }) {
      this.columns[column].type = type
    },
    focusBuilder() {
      smoothScrollTo("builder-root")
    },
  },
}
</script>
