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
              @click="activeLayer = index"
            >
              Layer {{ index }} {{ index === activeLayer ? "(active)" : "" }}
            </div>
          </div>
        </div>
        <div>
          <h3>Customise layer</h3>
          <div>
            <div>
              <label>
                Mark
                <select
                  :value="layersBase[activeLayer].main.mark"
                  @input="updateEncoding('mark', $event)"
                >
                  <option
                    v-for="option in ['bar', 'line', 'area']"
                    :key="option"
                    :value="option"
                    >{{ option }}</option
                  >
                </select>
              </label>
            </div>
            <div>
              <label>
                X
                <select
                  :value="layersBase[activeLayer].main.encoding.x.field"
                  @input="updateEncoding('x', $event)"
                >
                  <option
                    v-for="(type, name) in columns"
                    :key="name"
                    :value="name"
                    >{{ name }}</option
                  >
                </select>
              </label>
            </div>
            <div>
              <label>
                Y
                <select
                  :value="layersBase[activeLayer].main.encoding.y.field"
                  @input="updateEncoding('y', $event)"
                >
                  <option
                    v-for="(type, name) in columns"
                    :key="name"
                    :value="name"
                    >{{ name }}</option
                  >
                </select>
              </label>
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
      IMDB_Rating: "quantitative",
      US_Gross: "quantitative",
      Worldwide_Gross: "quantitative",
      Production_Budget: "quantitative",
      MPAA_Rating: "nominal",
      Title: "nominal",
    },
    activeLayer: 0,
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
          },
        },
        config: {
          encoding: {
            y: {
              aggregate: "average",
              scale: { domain: [0, 10] },
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
  },
  methods: {
    updateEncoding(type, event) {
      const { value } = event.target
      const workingObj = this.layersBase[this.activeLayer].main
      if (type === "mark") {
        workingObj.mark = value
      } else if (type === "x" || type === "y") {
        this.$set(this.layersBase[this.activeLayer].main.encoding, type, {
          field: value,
          type: this.columns[value],
        })
      }
    },
  },
}
</script>
