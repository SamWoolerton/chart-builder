<template>
  <div>
    <div class="flex w-full pane-wrapper">
      <DataPane :columns="columns" />
      <section>
        <div>
          <h3>Layers</h3>
          <button @click="layersBase.push({ main: {}, config: {} })" class="my-2">Add layer</button>
          <div v-if="layersBase.length === 0">You don't have any layers</div>
          <div v-else>
            <div
              v-for="(layer, index) in layersBase"
              :key="index"
              @click="activeLayerIndex = index"
              class="cursor-pointer"
            >
              Layer {{ index }}
              {{ index === activeLayerIndex ? "(active)" : "" }}
            </div>
          </div>
        </div>
        <div class="mt-4">
          <h3>Customise layer {{ activeLayerIndex }}</h3>
          <div>
            <div>
              <div class="font-semibold">Mark</div>
              <Dropdown
                :options="['bar', 'line', 'area']"
                :value="activeLayer.mark"
                @input="updateEncoding('mark', $event)"
              />
            </div>
            <div class="mt-2">
              <div class="font-semibold">X axis</div>
              <Dropdown
                :options="Object.keys(columns)"
                :value="activeLayer.encoding.x.field"
                @input="updateEncoding('x', $event)"
              />
              <div
                v-if="columns[activeLayer.encoding.x.field].scale"
                class="text-gray-700 text-sm"
              >{{ columns[activeLayer.encoding.x.field].scale.domain }}</div>
            </div>
            <div class="mt-2">
              <div class="font-semibold">Y axis</div>
              <Dropdown
                :options="Object.keys(columns)"
                :value="activeLayer.encoding.y.field"
                @input="updateEncoding('y', $event)"
              />
              <div v-if="columns[activeLayer.encoding.y.field].scale" class="text-gray-700 text-sm">
                Domain scale set to
                {{ columns[activeLayer.encoding.y.field].scale.domain }}
              </div>
            </div>
          </div>
        </div>
      </section>
      <ConfigPane />
      <Chart :data="data" :layers="layers" />
    </div>
  </div>
</template>

<script>
import deepmerge from "deepmerge"

import DataPane from "../components/DataPane"
import Chart from "../components/Chart"
import ConfigPane from "../components/ConfigPane"
import Dropdown from "../components/ui/Dropdown"

export default {
  components: { DataPane, Chart, ConfigPane, Dropdown },
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

<style lang="scss" scoped>
section {
  min-width: 200px;
}

@media (max-width: 1199px) {
  section {
    flex-grow: 1;
  }

  .pane-wrapper {
    flex-wrap: wrap;
  }
}
</style>
