<template>
  <div>
    <h2>Chart builder</h2>
    <div class="flex w-full">
      <DataPane />
      <section>
        <div>
          <h3>Layers</h3>
          <button @click="layers.push({})">Add layer</button>
          <div v-if="layers.length === 0">You don't have any layers</div>
          <div v-else>
            <div
              v-for="(layer, index) in layers"
              :key="index"
              @click="activeLayerIndex = index"
            >
              Layer {{ index }}
              {{ index === activeLayerIndex ? "(active)" : "" }}
            </div>
          </div>
        </div>
        <div>
          <h3>Customise layer</h3>
          <div>
            <div>
              Mark
              <select
                :value="activeLayer.mark"
                @input="updateEncoding('mark', $event)"
              >
                <option
                  v-for="option in ['bar', 'line', 'area']"
                  :key="option"
                  :value="option"
                  >{{ option }}</option
                >
              </select>
            </div>
            <div>
              X axis
              <select
                :value="activeLayer.encoding.x.field"
                @input="updateEncoding('x', $event)"
              >
                <option
                  v-for="(type, name) in columns"
                  :key="name"
                  :value="name"
                  >{{ name }}</option
                >
              </select>
              <div v-if="columns[activeLayer.encoding.x.field].scale">
                {{ columns[activeLayer.encoding.x.field].scale.domain }}
              </div>
            </div>
            <div>
              Y axis
              <select
                :value="activeLayer.encoding.y.field"
                @input="updateEncoding('y', $event)"
              >
                <option
                  v-for="(type, name) in columns"
                  :key="name"
                  :value="name"
                  >{{ name }}</option
                >
              </select>
              <div v-if="columns[activeLayer.encoding.y.field].scale">
                Scale domain set to
                {{ columns[activeLayer.encoding.y.field].scale.domain }}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Chart :data="data" :layers="layers" />
      <ConfigPane />
    </div>
  </div>
</template>

<script>
import deepmerge from "deepmerge"

import DataPane from "../components/DataPane"
import Chart from "../components/Chart"
import ConfigPane from "../components/ConfigPane"

export default {
  components: { DataPane, Chart, ConfigPane },
  data: () => ({
    data: {
      url: "https://vega.github.io/editor/data/movies.json",
    },
    columns: {
      IMDB_Rating: { type: "quantitative", scale: { domain: [0, 10] } },
      US_Gross: { type: "quantitative" },
      Worldwide_Gross: { type: "quantitative" },
      Production_Budget: { type: "quantitative" },
      MPAA_Rating: { type: "nominal" },
      Title: { type: "nominal" },
    },
    activeLayerIndex: 0,
    layersBase: [
      {
        main: {
          mark: "bar",
          encoding: {
            x: {
              field: "MPAA_Rating",
              type: "nominal",
            },
            y: {
              field: "IMDB_Rating",
              type: "quantitative",
            },
            color: {
              field: "IMDB_Rating",
              type: "quantitative",
            },
          },
        },
        config: {
          encoding: {
            y: {
              aggregate: "average",
            },
            color: {
              aggregate: "average",
            },
          },
        },
      },
    ],
  }),
  computed: {
    layers() {
      const validLayer = layer => !!layer.mark
      return this.layersBase
        .map(({ main, config }) => deepmerge(main, config))
        .filter(validLayer)
    },
    activeLayer() {
      return this.layers[this.activeLayerIndex]
    },
  },
  methods: {
    updateEncoding(type, event) {
      const { value } = event.target
      if (type === "mark") {
        this.layersBase[this.activeLayerIndex].main.mark = value
      } else if (type === "x" || type === "y") {
        this.$set(this.layersBase[this.activeLayerIndex].main.encoding, type, {
          field: value,
          ...this.columns[value],
        })
      }
    },
  },
}
</script>
